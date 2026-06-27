// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBlCs1VSVKYWJIevL2xZSywVOPx2J8uFM",
  authDomain: "safesyn-b1b29.firebaseapp.com",
  projectId: "safesyn-b1b29",
  storageBucket: "safesyn-b1b29.firebasestorage.app",
  messagingSenderId: "770031537026",
  appId: "1:770031537026:web:d9a6440a4ccd38ec6e9d9b",
  measurementId: "G-XF3JV3TCSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { app, analytics };
