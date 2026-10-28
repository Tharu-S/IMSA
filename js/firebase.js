import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyCYcPCplEFTJeU7dmmud6FDKb7Nh3eBqr4",
  authDomain: "imsa-a6097.firebaseapp.com",
  projectId: "imsa-a6097",
  storageBucket: "imsa-a6097.firebasestorage.app",
  messagingSenderId: "1070356410607",
  appId: "1:1070356410607:web:c44223d5e0317209b7eb1a"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
