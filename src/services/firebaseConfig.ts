import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBAYydv21UVFvYUWinAEhiXE6wkM8p0LWY",
  authDomain: "hielo-polar-produccion.firebaseapp.com",
  projectId: "hielo-polar-produccion",
  storageBucket: "hielo-polar-produccion.appspot.com",
  messagingSenderId: "386729283990",
  appId: "1:386729283990:web:83f6724ce7eede86478db7",
  measurementId: "G-F4KGBG01WN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
