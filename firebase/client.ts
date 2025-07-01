// Import the functions you need from the SDKs you need
import { initializeApp ,getApp,getApps} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAj7av7_8MIc1uIqq09pnj8QRW1vEVVDd8",
  authDomain: "prepwise-ecc2e.firebaseapp.com",
  projectId: "prepwise-ecc2e",
  storageBucket: "prepwise-ecc2e.firebasestorage.app",
  messagingSenderId: "280581803837",
  appId: "1:280581803837:web:1bc4b7c5790faff3ed3f54",
  measurementId: "G-PRL098RJTX"
};

// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig ) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);