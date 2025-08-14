import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ตั้งค่าโปรไฟล์เริ่มต้น
    const defaultProfile = {
      email: user.email,
      displayName: "ผู้ใช้ใหม่",
      photoURL: "https://raw.githubusercontent.com/twbs/icons/main/icons/person-circle.svg",
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    // บันทึกข้อมูลผู้ใช้ลงใน Firestore
    const db = getFirestore();
    await setDoc(doc(db, 'users', user.uid), defaultProfile);

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}