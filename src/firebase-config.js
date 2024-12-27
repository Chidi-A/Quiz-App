import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDInuEbedBdA7uFplZ8wPHTKNSYlatOmHs",
  authDomain: "quiz-app-707e6.firebaseapp.com",
  projectId: "quiz-app-707e6",
  storageBucket: "quiz-app-707e6.firebasestorage.app",
  messagingSenderId: "812858923363",
  appId: "1:812858923363:web:f9adaf49d8287fd78bdb56",
  measurementId: "G-XZPP3W8X0D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 