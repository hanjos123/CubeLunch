// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHi1BG_cmmQLUGDJ9A7tlTmuIjH-HHPpM",
  authDomain: "cubelunch-26d58.firebaseapp.com",
  databaseURL:
    "https://cubelunch-26d58-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cubelunch-26d58",
  storageBucket: "cubelunch-26d58.appspot.com",
  messagingSenderId: "847299392402",
  appId: "1:847299392402:web:88c0390a4e74efc530874b",
  measurementId: "G-373MVN82DH",
};

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyCHi1BG_cmmQLUGDJ9A7tlTmuIjH-HHPpM",
  authDomain: "cubelunch-26d58.firebaseapp.com",
  databaseURL:
    "https://cubelunch-26d58-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cubelunch-26d58",
  storageBucket: "cubelunch-26d58.appspot.com",
  messagingSenderId: "847299392402",
  appId: "1:847299392402:web:88c0390a4e74efc530874b",
  measurementId: "G-373MVN82DH",
});

export const database = getDatabase(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
