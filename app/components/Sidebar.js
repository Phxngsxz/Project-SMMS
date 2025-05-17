"use client";

import { auth } from '../firebaseConfig';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Link from 'next/link';

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);

        // ดึงข้อมูลโปรไฟล์จาก Firestore
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          setUserProfile(userDoc.data()); // บันทึกข้อมูลโปรไฟล์
        }
      } else {
        setUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ฟังก์ชันสร้างลิงก์ตามบทบาท
  const getLink = (basePath) => {
    return userProfile?.role === 'admin' ? `/admin${basePath}` : `/user${basePath}`;
  };

  return (
    <div className="w-64 bg-white h-screen shadow-lg p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Sidebar</h2>
      {userProfile && (
        <div className="flex flex-col items-center mb-6">
          <img
            src={userProfile.photoURL}
            alt="Profile"
            className="w-16 h-16 rounded-full mb-2"
          />
          <p className="text-sm text-gray-700">{userProfile.displayName}</p>
          <p className="text-xs text-gray-500">{userProfile.email}</p>
        </div>
      )}

      {/* เมนูสำหรับ Admin และ User */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href={getLink('/')} className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <span>หน้าหลัก</span>
            </Link>
          </li>
          <li>
            <Link href={getLink('/repair-requests')} className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <span>ระบบจัดการคำขอซ่อม</span>
            </Link>
          </li>
          <li>
            <Link href={getLink('/repair-status')} className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <span>ระบบติดตามสถานะการซ่อม</span>
            </Link>
          </li>
          <li>
            <Link href={getLink('/service-evaluation')} className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <span>ระบบประเมินผลการบริการ</span>
            </Link>
          </li>
          <li>
            <Link href={getLink('/repair-history')} className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
              <span>ระบบประวัติการซ่อม</span>
            </Link>
          </li>

          {/* เมนูสำหรับ Admin เท่านั้น */}
          {userProfile?.role === 'admin' && (
            <li>
              <Link href="/admin/notifications" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <span>ระบบแจ้งเตือน</span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* ปุ่ม Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        ออกจากระบบ
      </button>
    </div>
  );
}