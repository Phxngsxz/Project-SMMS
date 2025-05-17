"use client";

import { auth } from '../firebaseConfig';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';

export default function UserPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p className="text-blue-500">คุณคือ User</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}