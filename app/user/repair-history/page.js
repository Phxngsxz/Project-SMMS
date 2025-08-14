"use client";

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { app, auth } from "../../firebaseConfig";
import Sidebar from "../../components/Sidebar";
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

  // คำนวณข้อมูลสำหรับหน้าปัจจุบัน
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = repairRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
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
    <div className="flex h-screen ไbg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        {/* Main Content */}
      </div>
    </div>
  );
}
