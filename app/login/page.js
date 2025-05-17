"use client";

import { useState } from 'react';
import { auth, provider } from '../firebaseConfig';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import Swal from 'sweetalert2'; // นำเข้า SweetAlert2

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ล็อกอินด้วย Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ดึงข้อมูลผู้ใช้จาก Firestore
      const db = getFirestore();
      const userDoc = await getDoc(doc(db, 'users', user.uid));

      // หากไม่มีข้อมูลผู้ใช้ ให้บันทึกข้อมูลโปรไฟล์จาก Google ลงใน Firestore
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName, // ชื่อที่แสดงใน Google
          photoURL: user.photoURL, // URL รูปโปรไฟล์จาก Google
          role: 'user', // กำหนด Role เริ่มต้นเป็น 'user'
          createdAt: new Date().toISOString(),
        });
      }

      // แสดง SweetAlert2 เมื่อล็อกอินสำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'ล็อกอินสำเร็จ!',
        text: 'คุณได้ล็อกอินเข้าสู่ระบบแล้ว',
        showConfirmButton: false,
        timer: 1500,
      });

      // นำผู้ใช้ไปยังหน้า Dashboard เพื่อตรวจสอบ Role
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'ล็อกอินไม่สำเร็จ',
        text: error.message,
      });
    }
  };

  // ล็อกอินด้วยอีเมลและรหัสผ่าน
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // แสดง SweetAlert2 เมื่อล็อกอินสำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'ล็อกอินสำเร็จ!',
        text: 'คุณได้ล็อกอินเข้าสู่ระบบแล้ว',
        showConfirmButton: false,
        timer: 1500,
      });

      // นำผู้ใช้ไปยังหน้า Dashboard เพื่อตรวจสอบ Role
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'ล็อกอินไม่สำเร็จ',
        text: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* ลวดลายพื้นหลัง */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute top-20 right-20 w-60 h-60 rounded-full bg-white"></div>
          <div className="absolute bottom-10 left-1/4 w-80 h-80 rounded-full bg-white"></div>
          <div className="absolute top-1/3 right-1/3 w-60 h-60 rounded-full bg-white"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="grid grid-cols-12 gap-4 w-full h-full p-8">
            {Array(48).fill().map((_, i) => (
              <div key={i} className="bg-white rounded-lg transform rotate-3"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md w-full p-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-2xl z-10 border border-white border-opacity-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">เข้าสู่ระบบ</h1>
          <p className="text-gray-600 mt-2">ยินดีต้อนรับกลับมา กรุณาเข้าสู่ระบบ</p>
        </div>

        {/* ฟอร์มล็อกอินด้วยอีเมลและรหัสผ่าน */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                จดจำฉัน
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                ลืมรหัสผ่าน?
              </a>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg transform hover:-translate-y-0.5"
          >
            เข้าสู่ระบบด้วยอีเมล
          </button>
        </form>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">หรือ</span>
          </div>
        </div>
        
        {/* ปุ่มล็อกอินด้วย Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200 shadow-md transform hover:-translate-y-0.5"
        >
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          เข้าสู่ระบบด้วย Google
        </button>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี? 
          <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
            สมัครสมาชิกใหม่
          </a>
        </div>
      </div>
    </div>
  );
}