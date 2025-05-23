// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz5vM2NzoHglHNw11ZeCjoatuIn7TwX1c",
  authDomain: "plan-clima.firebaseapp.com",
  projectId: "plan-clima",
  storageBucket: "plan-clima.firebasestorage.app",
  messagingSenderId: "1040151029740",
  appId: "1:1040151029740:web:8feb34e2b60b9e457982c9",
  measurementId: "G-JYTS2S11RS",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
