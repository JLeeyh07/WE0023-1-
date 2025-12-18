// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTSEX-KMCddwLaKNCSEvEI0OQr58uayyg",
  authDomain: "we0023-59d22.firebaseapp.com",
  projectId: "we0023-59d22",
  storageBucket: "we0023-59d22.firebasestorage.app",
  messagingSenderId: "443902240610",
  appId: "1:443902240610:web:a649d92142e78c51b3ee3b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
