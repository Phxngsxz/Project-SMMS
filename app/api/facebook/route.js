import { signInWithPopup, FacebookAuthProvider } from "firebase/auth"
import { auth } from "@/firebaseConfig"
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore"

export async function POST(request) {
  try {
    const provider = new FacebookAuthProvider()
    provider.addScope("email")

    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // บันทึกข้อมูลผู้ใช้ลง Firestore
    const db = getFirestore()
    const userDoc = await getDoc(doc(db, "users", user.uid))

    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "user",
        provider: "facebook",
        createdAt: new Date().toISOString(),
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Facebook login error:", error)
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
