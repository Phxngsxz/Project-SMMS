"use client";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getFirestore, onSnapshot , query, where } from "firebase/firestore";
import { app, auth } from "../../firebaseConfig";
import Sidebar from '../../components/Sidebar';
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";

export default function RepairTrackingSystem() {
  const [user, loadingAuth] = useAuthState(auth);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const db = getFirestore(app);

  useEffect(() => {
    if (!user || loadingAuth) return;

    const unsubscribe = onSnapshot(
      query(
        collection(db, "repairs"),
        where("customerEmail", "==", user.email)
      ),
      (querySnapshot) => {
        const repairsData = [];
        querySnapshot.forEach((doc) => {
          repairsData.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            updatedAt: doc.data().updatedAt?.toDate()
          });
        });
        setRepairs(repairsData.sort((a, b) => b.createdAt - a.createdAt));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching repairs:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถโหลดข้อมูลการซ่อมได้",
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, loadingAuth]);

  const statusOptions = [
    { value: "all", label: "ทั้งหมด" },
    { value: "pending", label: "รอดำเนินการ" },
    { value: "in_progress", label: "กำลังซ่อม" },
    { value: "completed", label: "เสร็จสิ้น" },
    { value: "rejected", label: "ยกเลิก" }
  ];

  const filteredRepairs = filter === "all" 
    ? repairs 
    : repairs.filter(repair => repair.status === filter);

  const statusColors = {
    pending: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    pending: "รอดำเนินการ",
    in_progress: "กำลังซ่อม",
    completed: "เสร็จสิ้น",
    rejected: "ยกเลิก"
  };

  const progressValues = {
    pending: 20,
    in_progress: 60,
    completed: 100,
    rejected: 0
  };

  const progressColors = {
    pending: "bg-gray-300",
    in_progress: "bg-blue-500",
    completed: "bg-green-500",
    rejected: "bg-red-500"
  };

  if (loading || loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full pb-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">ติดตามสถานะการซ่อม</h1>
            </div>
          </div>

          {/* Filter Section */}
          <div className="max-w-7xl mx-auto mt-6">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-700">สถานะ:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-sm text-gray-500">
                  พบ {filteredRepairs.length} รายการ
                </div>
              </div>
            </div>
          </div>

          {/* Repair List */}
          <div className="max-w-7xl mx-auto mt-6 space-y-4">
            {filteredRepairs.length === 0 ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-2 text-gray-500">ไม่พบรายการซ่อม</p>
              </div>
            ) : (
              filteredRepairs.map((repair) => (
                <div key={repair.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Repair Info */}
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${statusColors[repair.status]}`}>
                              <span className="text-xs font-medium">
                                REP-{repair.id.slice(0, 3).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900">
                              {repair.serviceType}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              แจ้งซ่อมเมื่อ: {repair.createdAt?.toLocaleDateString('th-TH')}
                            </p>
                            {repair.updatedAt && (
                              <p className="text-sm text-gray-500">
                                อัพเดทล่าสุด: {repair.updatedAt?.toLocaleDateString('th-TH')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status and Progress */}
                      <div className="w-full md:w-64 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[repair.status]}`}>
                            {statusLabels[repair.status]}
                          </span>
                          <span className="text-xs text-gray-500">
                            {progressValues[repair.status]}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${progressColors[repair.status]}`}
                            style={{ width: `${progressValues[repair.status]}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Technician Notes */}
                    {repair.technicianNote && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-blue-800">หมายเหตุจากช่าง:</h4>
                        <p className="text-sm text-blue-700 mt-1">{repair.technicianNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}