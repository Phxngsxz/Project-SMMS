"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, deleteDoc, getFirestore } from "firebase/firestore";
import { app } from '../firebaseConfig';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
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

      <div className="flex-1 flex flex-col">
      <Navbar />
      {/* Main Content */}
     
     </div>
    </div>
  );
}