"use client";

import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";

export default function AdminPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push("/login"); // ถ้าไม่ได้ล็อกอิน ให้กลับไปหน้า Login
        return;
      }

      // ดึงข้อมูลผู้ใช้จาก Firestore
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        const userRole = userDoc.data().role;

        // ตรวจสอบว่าเป็น Admin หรือไม่
        if (userRole !== "admin") {
          router.push("/dashboard"); // ถ้าไม่ใช่ Admin ให้กลับไปหน้า Dashboard
          return;
        }

        setUsername(user.displayName || user.email);
      } else {
        alert("ไม่พบข้อมูลผู้ใช้");
        router.push("/login");
      }

      setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อดึงข้อมูลเสร็จสิ้น
    });

    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
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
          <div className="p-4 flex-1 flex flex-col overflow-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
                    Admin
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                <p className="text-xl mb-2">ยินดีต้อนรับ, {username}</p>
                <p className="opacity-80">คุณคือ Admin ของระบบนี้</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-green-500 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">ผู้ใช้งานทั้งหมด</p>
                      <p className="text-2xl font-bold text-gray-800">123</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-blue-500 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">รายงานทั้งหมด</p>
                      <p className="text-2xl font-bold text-gray-800">45</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
                  <div className="flex items-center">
                    <div className="bg-purple-500 p-3 rounded-lg mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">กิจกรรมวันนี้</p>
                      <p className="text-2xl font-bold text-gray-800">12</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                การดำเนินการล่าสุด
              </h2>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-gray-600 font-medium">{item}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        การอัปเดตระบบ #{item}
                      </p>
                      <p className="text-sm text-gray-500">
                        เมื่อ 2 ชั่วโมงที่แล้ว
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      ดำเนินการแล้ว
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
