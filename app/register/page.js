"use client";

import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc, getFirestore } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isEmailValid, setIsEmailValid] = useState(true);

  // URL รูปโปรไฟล์เริ่มต้น - ใช้ Unsplash เพื่อภาพที่สวยงามกว่า
  const defaultProfileImageUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80";

  // ตรวจสอบความแข็งแรงของรหัสผ่าน
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // เพิ่มคะแนนสำหรับความยาว
    if (password.length >= 8) strength += 25;
    // เพิ่มคะแนนสำหรับตัวเลข
    if (/\d/.test(password)) strength += 25;
    // เพิ่มคะแนนสำหรับตัวอักษรพิเศษ
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    // เพิ่มคะแนนสำหรับตัวอักษรผสม
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;

    setPasswordStrength(strength);
  }, [password]);

  // ตรวจสอบรูปแบบอีเมล
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  useEffect(() => {
    if (email) {
      setIsEmailValid(validateEmail(email));
    } else {
      setIsEmailValid(true);
    }
  }, [email]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    // ตรวจสอบรหัสผ่าน
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);

    try {
      // สมัครสมาชิกด้วยอีเมลและรหัสผ่าน
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ตั้งค่าโปรไฟล์เริ่มต้น
      const defaultProfile = {
        email: user.email,
        displayName: email.split('@')[0], // ใช้ส่วนแรกของอีเมลเป็นชื่อเริ่มต้น
        photoURL: defaultProfileImageUrl,
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // บันทึกข้อมูลผู้ใช้ลงใน Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), defaultProfile);

      // แสดง SweetAlert2 เมื่อสมัครสมาชิกสำเร็จ
      Swal.fire({
        icon: 'success',
        title: 'ยินดีต้อนรับ!',
        text: 'คุณได้สมัครสมาชิกเรียบร้อยแล้ว',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          popup: 'animated fadeInDown'
        }
      });

      // นำผู้ใช้ไปยังหน้า Dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      let errorMessage = 'สมัครสมาชิกไม่สำเร็จ: ' + error.message;

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'อีเมลนี้ถูกใช้ไปแล้ว กรุณาใช้อีเมลอื่น';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'รูปแบบอีเมลไม่ถูกต้อง';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'รหัสผ่านไม่ปลอดภัยเพียงพอ กรุณาใช้รหัสผ่านที่ซับซ้อนมากขึ้น';
      }

      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: errorMessage,
        confirmButtonColor: '#4F46E5',
      });
    } finally {
      setLoading(false);
    }
  };

  // คำนวณสีของแถบความแข็งแรงของรหัสผ่าน
  const getStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-yellow-500';
    if (passwordStrength <= 75) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // คำนวณข้อความแสดงความแข็งแรงของรหัสผ่าน
  const getStrengthText = () => {
    if (!password) return '';
    if (passwordStrength <= 25) return 'อ่อนแอ';
    if (passwordStrength <= 50) return 'พอใช้';
    if (passwordStrength <= 75) return 'ดี';
    return 'แข็งแรงมาก';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-center relative overflow-hidden">
          {/* เพิ่มลวดลายพื้นหลัง */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute bottom-10 right-10 w-20 h-20 rounded-full bg-white"></div>
            <div className="absolute top-40 right-20 w-10 h-10 rounded-full bg-white"></div>
          </div>
          
          <h1 className="text-3xl font-bold text-white">สมัครสมาชิกใหม่</h1>
          <p className="text-indigo-100 mt-2">เริ่มต้นการใช้งานกับเรา</p>
        </div>

        <div className="p-8">
          {/* Profile Image Preview */}
          <div className="flex justify-center mb-8">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg transform transition-all duration-300 hover:scale-105">
              <img
                src={defaultProfileImageUrl}
                alt="Default Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border-l-4 border-red-500 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 w-full px-4 py-3.5 border ${!isEmailValid && email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-indigo-500'} rounded-lg focus:ring-2 focus:ring-indigo-200 transition-all duration-200`}
                  required
                />
                {!isEmailValid && email && (
                  <p className="mt-1 text-sm text-red-500">รูปแบบอีเมลไม่ถูกต้อง</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">รหัสผ่าน</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="ป้อนรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-200"
                  required
                />
              </div>
              
              {/* แสดงความแข็งแรงของรหัสผ่าน */}
              {password && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div 
                      className={`h-2 rounded-full ${getStrengthColor()}`} 
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 flex justify-between">
                    <span>ความปลอดภัยของรหัสผ่าน:</span>
                    <span className={`font-medium ${
                      passwordStrength <= 25 ? 'text-red-500' : 
                      passwordStrength <= 50 ? 'text-yellow-500' : 
                      passwordStrength <= 75 ? 'text-blue-500' : 
                      'text-green-500'
                    }`}>
                      {getStrengthText()}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 w-full px-4 py-3.5 border ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-indigo-500'
                  } rounded-lg focus:ring-2 focus:ring-indigo-200 transition-all duration-200`}
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">รหัสผ่านไม่ตรงกัน</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-4 px-6 rounded-lg font-medium shadow-lg ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 transform hover:translate-y-[-2px]'
              } transition-all duration-300 flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  กำลังสมัครสมาชิก...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  สมัครสมาชิก
                </>
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                มีบัญชีผู้ใช้อยู่แล้ว?{' '}
                <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
            
            <div className="text-xs text-center text-gray-500 mt-4">
              การสมัครสมาชิกถือว่าคุณยอมรับ{' '}
              <a href="#" className="text-indigo-600 hover:underline">เงื่อนไขการใช้งาน</a>{' '}
              และ{' '}
              <a href="#" className="text-indigo-600 hover:underline">นโยบายความเป็นส่วนตัว</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}