"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-bounce">
          ยินดีต้อนรับเข้าสู่ระบบ
        </h1>
        <p className="text-lg md:text-xl mb-8">ระบบบริการซ่อมและหลังบริการ</p>

        {/* Buttons */}
        <div className="flex justify-center items-center space-x-4">
          <Link href="/login">
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300 transform hover:scale-105">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300 transform hover:scale-105">
              Register
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm">
        <p>© {new Date().getFullYear()} My App. All rights reserved.</p>
      </footer>
    </div>
  );
}
