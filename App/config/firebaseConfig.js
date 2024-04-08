// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZX0C6TxlaWD5JK5IXFXb1ifGe-XStris",
  authDomain: "skincare-ee652.firebaseapp.com",
  projectId: "skincare-ee652",
  storageBucket: "skincare-ee652.appspot.com",
  messagingSenderId: "970614467761",
  appId: "1:970614467761:web:e0083f004708620aad4690"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };