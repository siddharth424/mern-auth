// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-f0021.firebaseapp.com",
  projectId: "mern-auth-f0021",
  storageBucket: "mern-auth-f0021.appspot.com",
  messagingSenderId: "346966845809",
  appId: "1:346966845809:web:5812547d8ee6454c97aed0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);