"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getFirestore, onSnapshot } from "firebase/firestore";
import { app, auth } from "../../firebaseConfig";
import Sidebar from '../../components/Sidebar';
import Navbar from "../../components/Navbar";
import Swal from "sweetalert2";

export default function UserRepairRequests() {
  const [repairRequests, setRepairRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const db = getFirestore(app);

  // ดึงข้อมูลคำขอซ่อมของ User ปัจจุบันแบบ Real-time
  useEffect(() => {
    setIsLoading(true);
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(
          collection(db, "repairRequests"),
          (querySnapshot) => {
            const requests = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (data.userId === user.uid) {
                requests.push({
                  id: doc.id,
                  ...data,
                  createdAt: data.createdAt?.toDate(), // แปลง Timestamp เป็น Date
                });
              }
            });
            
            // จัดเรียงข้อมูลตามวันที่สร้าง (ล่าสุดไปเก่าสุด)
            const sortedRequests = requests.sort((a, b) => {
              if (!a.createdAt) return 1;
              if (!b.createdAt) return -1;
              return b.createdAt - a.createdAt;
            });
            
            setRepairRequests(sortedRequests);
            setIsLoading(false);
          }
        );

        return () => unsubscribeSnapshot(); // ยกเลิกการติดตามเมื่อ component ถูกลบ
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribeAuth(); // ยกเลิกการติดตามเมื่อ component ถูกลบ
  }, [db]);

  // สร้างคำขอซ่อมใหม่
  const handleCreateRequest = async () => {
    const result = await Swal.fire({
      title: '<span class="text-green-600 font-bold text-xl">สร้างคำขอซ่อมใหม่</span>',
      html: `
        <div class="mb-3 text-left">
          <label class="block text-gray-700 text-sm font-medium mb-1">รายละเอียดการซ่อม</label>
          <textarea id="description" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-green-500" 
            rows="4" placeholder="โปรดระบุรายละเอียดการซ่อม..."></textarea>
        </div>
        
        <div class="mb-3 text-left">
          <label class="block text-gray-700 text-sm font-medium mb-1">ความเร่งด่วน</label>
          <select id="priority" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-green-500">
            <option value="low">ปกติ</option>
            <option value="medium">เร่งด่วนปานกลาง</option>
            <option value="high">เร่งด่วนมาก</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-save mr-1"></i> สร้างคำขอ',
      cancelButtonText: '<i class="fas fa-times mr-1"></i> ยกเลิก',
      confirmButtonColor: '#10B981', // สีเขียว Tailwind
      cancelButtonColor: '#6B7280', // สีเทา Tailwind
      customClass: {
        container: 'custom-swal-container',
        popup: 'rounded-2xl shadow-xl border-0',
        confirmButton: 'rounded-lg text-sm font-medium',
        cancelButton: 'rounded-lg text-sm font-medium'
      },
      focusConfirm: false,
      preConfirm: () => {
        const description = Swal.getPopup().querySelector('#description').value;
        const priority = Swal.getPopup().querySelector('#priority').value;
        
        if (!description) {
          Swal.showValidationMessage('กรุณากรอกรายละเอียดการซ่อม');
          return false;
        }
        
        return { description, priority };
      }
    });
  
    if (result.isConfirmed) {
      const { description, priority } = result.value;
      const user = auth.currentUser;
      
      if (user) {
        const requestData = {
          description: description,
          priority: priority,
          status: "pending",
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
  
        try {
          const docRef = await addDoc(collection(db, "repairRequests"), requestData);
          console.log("Document written with ID:", docRef.id);
  
          // แจ้งเตือนเมื่อสร้างคำขอสำเร็จ
          Swal.fire({
            icon: "success",
            title: '<span class="text-green-600 font-bold">สำเร็จ!</span>',
            html: '<p class="text-gray-700">สร้างคำขอซ่อมเรียบร้อยแล้ว</p>',
            confirmButtonColor: '#10B981',
            confirmButtonText: 'ตกลง',
            customClass: {
              popup: 'rounded-2xl border-0',
              confirmButton: 'rounded-lg text-sm font-medium'
            }
          });
        } catch (error) {
          console.error("Error adding document:", error);
          Swal.fire({
            icon: "error",
            title: '<span class="text-red-600 font-bold">เกิดข้อผิดพลาด</span>',
            html: '<p class="text-gray-700">ไม่สามารถสร้างคำขอซ่อมได้</p>',
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'ตกลง',
            customClass: {
              popup: 'rounded-2xl border-0',
              confirmButton: 'rounded-lg text-sm font-medium'
            }
          });
        }
      } else {
        Swal.fire({
          icon: "warning",
          title: '<span class="text-amber-600 font-bold">ไม่สามารถดำเนินการได้</span>',
          html: '<p class="text-gray-700">คุณต้องเข้าสู่ระบบก่อนสร้างคำขอซ่อม</p>',
          confirmButtonColor: '#F59E0B',
          confirmButtonText: 'ตกลง',
          customClass: {
            popup: 'rounded-2xl border-0',
            confirmButton: 'rounded-lg text-sm font-medium'
          }
        });
      }
    }
  };
  

  // แก้ไขคำขอซ่อม (เฉพาะรายละเอียด)
  const handleEditRequest = async (id, currentDescription, currentPriority = "low") => {
    const result = await Swal.fire({
      title: '<span class="text-blue-600 font-bold text-xl">แก้ไขคำขอซ่อม</span>',
      html: `
        <div class="mb-3 text-left">
          <label class="block text-gray-700 text-sm font-medium mb-1">รายละเอียดการซ่อม</label>
          <textarea id="description" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500" 
            rows="4" placeholder="โปรดระบุรายละเอียดการซ่อม...">${currentDescription}</textarea>
        </div>
        
        <div class="mb-3 text-left">
          <label class="block text-gray-700 text-sm font-medium mb-1">ความเร่งด่วน</label>
          <select id="priority" class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500">
            <option value="low" ${currentPriority === 'low' ? 'selected' : ''}>ปกติ</option>
            <option value="medium" ${currentPriority === 'medium' ? 'selected' : ''}>เร่งด่วนปานกลาง</option>
            <option value="high" ${currentPriority === 'high' ? 'selected' : ''}>เร่งด่วนมาก</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-save mr-1"></i> บันทึกการแก้ไข',
      cancelButtonText: '<i class="fas fa-times mr-1"></i> ยกเลิก',
      confirmButtonColor: '#3B82F6', // สีฟ้า Tailwind
      cancelButtonColor: '#6B7280', // สีเทา Tailwind
      customClass: {
        container: 'custom-swal-container',
        popup: 'rounded-2xl shadow-xl border-0',
        confirmButton: 'rounded-lg text-sm font-medium',
        cancelButton: 'rounded-lg text-sm font-medium'
      },
      focusConfirm: false,
      preConfirm: () => {
        const description = Swal.getPopup().querySelector('#description').value;
        const priority = Swal.getPopup().querySelector('#priority').value;
        
        if (!description) {
          Swal.showValidationMessage('กรุณากรอกรายละเอียดการซ่อม');
          return false;
        }
        
        return { description, priority };
      }
    });
  
    if (result.isConfirmed) {
      const { description, priority } = result.value;
      
      try {
        await updateDoc(doc(db, "repairRequests", id), {
          description: description,
          priority: priority,
          updatedAt: new Date(),
        });
  
        // แจ้งเตือนเมื่อแก้ไขสำเร็จ
        Swal.fire({
          icon: "success",
          title: '<span class="text-blue-600 font-bold">สำเร็จ!</span>',
          html: '<p class="text-gray-700">แก้ไขคำขอซ่อมเรียบร้อยแล้ว</p>',
          confirmButtonColor: '#3B82F6',
          confirmButtonText: 'ตกลง',
          customClass: {
            popup: 'rounded-2xl border-0',
            confirmButton: 'rounded-lg text-sm font-medium'
          }
        });
      } catch (error) {
        console.error("Error updating document:", error);
        Swal.fire({
          icon: "error",
          title: '<span class="text-red-600 font-bold">เกิดข้อผิดพลาด</span>',
          html: '<p class="text-gray-700">ไม่สามารถแก้ไขคำขอซ่อมได้</p>',
          confirmButtonColor: '#EF4444',
          confirmButtonText: 'ตกลง',
          customClass: {
            popup: 'rounded-2xl border-0',
            confirmButton: 'rounded-lg text-sm font-medium'
          }
        });
      }
    }
  };

  // ลบคำขอซ่อม
  const handleDeleteRequest = async (id) => {
    Swal.fire({
      title: '<span class="text-red-600 font-bold">ยืนยันการลบ</span>',
      html: '<p class="text-gray-700 mb-2">คุณต้องการลบคำขอซ่อมนี้ใช่หรือไม่?</p><p class="text-gray-500 text-sm">หากลบแล้วจะไม่สามารถกู้คืนข้อมูลได้</p>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '<i class="fas fa-trash-alt mr-1"></i> ยืนยันการลบ',
      cancelButtonText: '<i class="fas fa-times mr-1"></i> ยกเลิก',
      confirmButtonColor: '#EF4444', // สีแดง Tailwind
      cancelButtonColor: '#6B7280', // สีเทา Tailwind
      customClass: {
        container: 'custom-swal-container',
        popup: 'rounded-2xl shadow-xl border-0',
        confirmButton: 'rounded-lg text-sm font-medium',
        cancelButton: 'rounded-lg text-sm font-medium'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "repairRequests", id));
  
          // แจ้งเตือนเมื่อลบสำเร็จ
          Swal.fire({
            icon: "success",
            title: '<span class="text-green-600 font-bold">สำเร็จ!</span>',
            html: '<p class="text-gray-700">ลบคำขอซ่อมเรียบร้อยแล้ว</p>',
            confirmButtonColor: '#10B981',
            confirmButtonText: 'ตกลง',
            customClass: {
              popup: 'rounded-2xl border-0',
              confirmButton: 'rounded-lg text-sm font-medium'
            }
          });
        } catch (error) {
          console.error("Error deleting document:", error);
          Swal.fire({
            icon: "error",
            title: '<span class="text-red-600 font-bold">เกิดข้อผิดพลาด</span>',
            html: '<p class="text-gray-700">ไม่สามารถลบคำขอซ่อมได้</p>',
            confirmButtonColor: '#EF4444',
            confirmButtonText: 'ตกลง',
            customClass: {
              popup: 'rounded-2xl border-0',
              confirmButton: 'rounded-lg text-sm font-medium'
            }
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 flex-1 flex flex-col">
          {/* Header section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">ระบบคำขอซ่อม</h1>
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-sm font-medium">
                  User
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
              <p className="text-xl mb-1">จัดการคำขอซ่อมของฉัน</p>
              <p className="opacity-80 text-sm">คุณสามารถสร้าง แก้ไข และติดตามสถานะคำขอซ่อมได้ที่นี่</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mb-4">
            <button
              onClick={handleCreateRequest}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow"
            >
              + สร้างคำขอซ่อมใหม่
            </button>
          </div>

          {/* Table section */}
          <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left text-gray-600 border-b sticky top-0 bg-gray-50">ลำดับ</th>
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
                          <button
                            onClick={() => handleEditRequest(request.id, request.description)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-3 text-center text-gray-500">ไม่พบข้อมูลคำขอซ่อม</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination - แสดงเฉพาะเมื่อมีข้อมูลมากกว่า requestsPerPage */}
            {totalPages > 1 && (
              <div className="p-4 border-t flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ก่อนหน้า
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                        currentPage === number
                          ? 'bg-green-500 text-white border-green-500 z-10'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ถัดไป
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}