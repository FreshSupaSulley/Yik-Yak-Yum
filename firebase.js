// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBN2XwW32G0UPZi5knt1ylY8fNVCIo7mfk",
  authDomain: "yik-yak-yum.firebaseapp.com",
  projectId: "yik-yak-yum",
  storageBucket: "yik-yak-yum.appspot.com",
  messagingSenderId: "748377152338",
  appId: "1:748377152338:web:18821fa28250e946cbb88b",
  measurementId: "G-NL5P7RWJ99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };