// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhu2LmHfq6egn5bJ5aeXjm1LU3rJTqzrY",
  authDomain: "twitter-65b8e.firebaseapp.com",
  projectId: "twitter-65b8e",
  storageBucket: "twitter-65b8e.appspot.com",
  messagingSenderId: "922265364483",
  appId: "1:922265364483:web:0364ab0782939444670636"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage }