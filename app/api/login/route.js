import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebaseConfig"

export async function POST(request) {
  const { email, password } = await request.json()

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
}
