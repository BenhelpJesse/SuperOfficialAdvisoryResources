import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8O_453riLo46RGx42C68RlHIxVIDZ4iY",
  authDomain: "community-chat-66170.firebaseapp.com",
  projectId: "community-chat-66170",
  storageBucket: "community-chat-66170.firebasestorage.app",
  messagingSenderId: "221123230077",
  appId: "1:221123230077:web:34c4e61afa2db6bf4b7414"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// safer pattern (avoids silent module issues)
signInAnonymously(auth).catch(console.error);

export { db };