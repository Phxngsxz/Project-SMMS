import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, query, where, getDocs, Timestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCksT7zTVeokhHy04icS9yFiu0DYFq7qc8",
  authDomain: "servicemaintenance-management.firebaseapp.com",
  projectId: "servicemaintenance-management",
  storageBucket: "servicemaintenance-management.appspot.com",
  messagingSenderId: "887805560743",
  appId: "1:887805560743:web:a983bf345d290e94f15882",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// ฟังก์ชันช่วยเหลือ
const addRequest = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

const updateRequest = async (collectionName, id, data) => {
  try {
    await updateDoc(doc(db, collectionName, id), data);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

const deleteRequest = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

const getRequest = async (collectionName, id) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Document not found");
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

const getUserRequests = async (userId) => {
  try {
    const q = query(collection(db, "repairRequests"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    return requests;
  } catch (error) {
    console.error("Error getting user requests:", error);
    throw error;
  }
};

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

const checkAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};

const formatTimestamp = (timestamp) => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate().toLocaleString();
  }
  return "Invalid Date";
};

export {
  auth,
  provider,
  app,
  db,
  storage,
  addRequest,
  updateRequest,
  deleteRequest,
  getRequest,
  getUserRequests,
  signInWithGoogle,
  logOut,
  checkAuthState,
  formatTimestamp,
};