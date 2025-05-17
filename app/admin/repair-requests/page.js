"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, getFirestore } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import Sidebar from '../../components/Sidebar';
import Swal from "sweetalert2";

export default function AdminRepairRequests() {
  const [repairRequests, setRepairRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const db = getFirestore(app);

  // ดึงข้อมูลคำขอซ่อมจาก Firestore
  useEffect(() => {
    const fetchRepairRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "repairRequests"));
        const requests = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          requests.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(), // แปลง Timestamp เป็น Date
          });
        });
        
        // จัดเรียงข้อมูลตามวันที่สร้าง (ล่าสุดไปเก่าสุด)
        const sortedRequests = requests.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt - a.createdAt;
        });
        
        setRepairRequests(sortedRequests);
      } catch (error) {
        console.error("Error fetching repair requests:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถดึงข้อมูลคำขอซ่อมได้",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepairRequests();
  }, [db]);

  // อัปเดตสถานะการซ่อม
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "repairRequests", id), {
        status: newStatus,
        updatedAt: new Date(),
      });

      // อัปเดต state โดยไม่ต้องดึงข้อมูลใหม่ทั้งหมด
      setRepairRequests(
        repairRequests.map((request) =>
          request.id === id ? { ...request, status: newStatus } : request
        )
      );

      // แจ้งเตือนเมื่ออัปเดตสถานะสำเร็จ
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "อัปเดตสถานะสำเร็จ",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัปเดตสถานะได้",
      });
    }
  };

  // ลบคำขอซ่อม
  const handleDeleteRequest = async (id) => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณจะไม่สามารถกู้คืนข้อมูลนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "repairRequests", id));

          // อัปเดต state โดยไม่ต้องดึงข้อมูลใหม่ทั้งหมด
          const updatedRequests = repairRequests.filter((request) => request.id !== id);
          setRepairRequests(updatedRequests);

          // ตรวจสอบว่าหลังจากลบแล้ว หน้าปัจจุบันมีข้อมูลหรือไม่
          // ถ้าไม่มีข้อมูลและไม่ใช่หน้าแรก ให้ย้อนกลับไปหน้าก่อนหน้า
          const totalPagesAfterDelete = Math.ceil(updatedRequests.length / requestsPerPage);
          if (currentPage > totalPagesAfterDelete && currentPage > 1) {
            setCurrentPage(totalPagesAfterDelete);
          }

          // แจ้งเตือนเมื่อลบข้อมูลสำเร็จ
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "ลบคำขอซ่อมสำเร็จ",
          });
        } catch (error) {
          console.error("Error deleting request:", error);
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถลบคำขอซ่อมได้",
          });
        }
      }
    });
  };

  // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = repairRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(repairRequests.length / requestsPerPage);

  // เปลี่ยนหน้า
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 flex-1 flex flex-col overflow-auto">
          {/* Header section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">ระบบจัดการคำขอซ่อม</h1>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
                  Admin
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
              <p className="text-xl mb-1">จัดการคำขอซ่อม</p>
              <p className="opacity-80 text-sm">คุณสามารถดูและอัปเดตสถานะคำขอซ่อมได้ที่นี่</p>
            </div>
          </div>

          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-gray-500 text-sm">คำขอทั้งหมด</h3>
              <p className="text-2xl font-bold">{repairRequests.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-gray-500 text-sm">กำลังดำเนินการ</h3>
              <p className="text-2xl font-bold text-yellow-500">
                {repairRequests.filter(r => r.status === 'in_progress').length}
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-gray-500 text-sm">เสร็จสิ้น</h3>
              <p className="text-2xl font-bold text-green-500">
                {repairRequests.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>

          {/* Table section */}
          <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">รายการคำขอซ่อม</h2>
                <div className="text-sm text-gray-500">
                  แสดง {indexOfFirstRequest + 1}-{Math.min(indexOfLastRequest, repairRequests.length)} จาก {repairRequests.length} รายการ
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-gray-600 border-b sticky top-0 bg-gray-50">ลำดับ</th>
                    <th className="p-3 text-left text-gray-600 border-b sticky top-0 bg-gray-50">ลูกค้า</th>
                    <th className="p-3 text-left text-gray-600 border-b sticky top-0 bg-gray-50">รายละเอียด</th>
                    <th className="p-3 text-left text-gray-600 border-b sticky top-0 bg-gray-50">สถานะ</th>
                    <th className="p-3 text-left text-gray-600 border-b sticky top-0 bg-gray-50">วันที่สร้าง</th>
                    <th className="p-3 text-left text-gray-600 border-b sticky top-0 bg-gray-50">การดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.length > 0 ? (
                    currentRequests.map((request, index) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{indexOfFirstRequest + index + 1}</td>
                        <td className="p-3">{request.userId}</td>
                        <td className="p-3">{request.description}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            request.status === 'completed' ? 'bg-green-100 text-green-800' :
                            request.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status === 'pending' ? 'รอดำเนินการ' :
                             request.status === 'in_progress' ? 'กำลังดำเนินการ' :
                             request.status === 'completed' ? 'เสร็จสิ้น' : request.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {request.createdAt
                            ? request.createdAt.toLocaleString("th-TH", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "ไม่มีข้อมูลวันที่"}
                        </td>
                        <td className="p-3 flex space-x-2">
                          <select
                            value={request.status}
                            onChange={(e) => handleUpdateStatus(request.id, e.target.value)}
                            className="p-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="pending">รอดำเนินการ</option>
                            <option value="in_progress">กำลังดำเนินการ</option>
                            <option value="completed">เสร็จสิ้น</option>
                          </select>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-3 text-center text-gray-500">ไม่พบข้อมูลคำขอซ่อม</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination - ติดอยู่ที่ด้านล่างสุดตลอดเวลา */}
        <div className="p-4 border-t bg-white sticky bottom-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              หน้า {currentPage} จาก {totalPages > 0 ? totalPages : 1}
            </div>
            
            <nav className="inline-flex rounded-md shadow">
              {/* ปุ่มก่อนหน้า */}
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ก่อนหน้า
              </button>
              
              {/* ปุ่มถัดไป */}
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ถัดไป
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}