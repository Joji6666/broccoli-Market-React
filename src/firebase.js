// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2tf8K11JFKe8Z9B57p1Gf2L3Rv154nfw",
  authDomain: "broccoli-market-react.firebaseapp.com",
  projectId: "broccoli-market-react",
  storageBucket: "broccoli-market-react.appspot.com",
  messagingSenderId: "345367878757",
  appId: "1:345367878757:web:35f11e50ec6ea3c7c2ba8c",
  measurementId: "G-5E34Q1LJHS",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
