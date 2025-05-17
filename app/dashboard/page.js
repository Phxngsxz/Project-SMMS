"use client";

import { auth } from '../firebaseConfig';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, getFirestore } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // State เพื่อตรวจสอบสถานะการโหลด

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login'); // ถ้าไม่ได้ล็อกอิน ให้กลับไปหน้า Login
        return;
      }

      try {
        const db = getFirestore();
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {
          // หากมีข้อมูลผู้ใช้อยู่แล้ว
          const userRole = userDoc.data().role;
          handleRouting(userRole); // นำทางไปยังหน้าที่เหมาะสม
        } else {
          // หากไม่มีข้อมูลผู้ใช้ ให้สร้างข้อมูลใหม่
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            name: user.displayName || 'ไม่ระบุชื่อ',
            role: 'user', // กำหนดบทบาทเริ่มต้นเป็น 'user'
            createdAt: new Date(),
          });

          console.log('สร้างข้อมูลผู้ใช้ใหม่สำเร็จ:', user.uid);
          handleRouting('user'); // นำทางไปยังหน้า User
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงหรือสร้างข้อมูลผู้ใช้:', error);
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        router.push('/login');
      } finally {
        setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อดึงข้อมูลเสร็จสิ้น
      }
    });

    return () => unsubscribe(); // ยกเลิกการติดตามเมื่อ component ถูกลบ
  }, [router]);

  const handleRouting = (userRole) => {
    // นำทางไปยังหน้าที่เหมาะสมตาม Role
    if (userRole === 'admin') {
      router.push('/admin'); // ไปหน้า Admin
    } else if (userRole === 'user') {
      router.push('/user'); // ไปหน้า User
    } else {
      alert('บทบาทผู้ใช้ไม่ถูกต้อง');
      router.push('/login');
    }
  };

  // แสดง Loading State ขณะดึงข้อมูล
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  return null;
}