import { initializeApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCksT7zTVeokhHy04icS9yFiu0DYFq7qc8",
  authDomain: "servicemaintenance-management.firebaseapp.com",
  projectId: "servicemaintenance-management",
  storageBucket: "servicemaintenance-management.appspot.com",
  messagingSenderId: "887805560743",
  appId: "1:887805560743:web:a983bf345d290e94f15882",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Google Provider
export const provider = new GoogleAuthProvider()

// Facebook Provider
export const facebookProvider = new FacebookAuthProvider()
facebookProvider.addScope("email")

// Line Provider (ใช้ OAuthProvider)
export const lineProvider = new OAuthProvider("oidc.line")
lineProvider.addScope("profile")
lineProvider.addScope("openid")
lineProvider.addScope("email")

// Firestore functions
const addRequest = async (request) => {
  try {
    const docRef = await addDoc(collection(db, "requests"), {
      ...request,
      createdAt: serverTimestamp(),
    })
    console.log("Document written with ID: ", docRef.id)
    return docRef.id
  } catch (e) {
    console.error("Error adding document: ", e)
    return null
  }
}

const updateRequest = async (id, request) => {
  try {
    const requestDoc = doc(db, "requests", id)
    await updateDoc(requestDoc, request)
    console.log("Document updated with ID: ", id)
    return true
  } catch (e) {
    console.error("Error updating document: ", e)
    return false
  }
}

const deleteRequest = async (id) => {
  try {
    const requestDoc = doc(db, "requests", id)
    await deleteDoc(requestDoc)
    console.log("Document deleted with ID: ", id)
    return true
  } catch (e) {
    console.error("Error deleting document: ", e)
    return false
  }
}

const getRequest = async (id) => {
  try {
    const requestDoc = doc(db, "requests", id)
    const docSnap = await getDoc(requestDoc)

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data())
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      console.log("No such document!")
      return null
    }
  } catch (e) {
    console.error("Error getting document: ", e)
    return null
  }
}

const getUserRequests = async (userId) => {
  try {
    const q = query(collection(db, "requests"), where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    const requests = []
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() })
    })
    return requests
  } catch (e) {
    console.error("Error getting documents: ", e)
    return []
  }
}

// Auth functions
const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider)
  } catch (err) {
    console.error(err)
  }
}

const logOut = async () => {
  try {
    await signOut(auth)
  } catch (err) {
    console.error(err)
  }
}

const checkAuthState = (callback) => {
  return onAuthStateChanged(auth, callback)
}

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return ""
  try {
    const date = timestamp.toDate() // Convert Firebase Timestamp to JavaScript Date object
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
  } catch (error) {
    console.error("Error formatting timestamp:", error)
    return "Invalid Date"
  }
}

export {
  app,
  addRequest,
  updateRequest,
  deleteRequest,
  getRequest,
  getUserRequests,
  signInWithGoogle,
  logOut,
  checkAuthState,
  formatTimestamp,
}

export default app
