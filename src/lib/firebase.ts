import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1bhaSX9ubSJyWKALNqREuCyO7LFltl1g",
  authDomain: "cuida-se.firebaseapp.com",
  projectId: "cuida-se",
  storageBucket: "cuida-se.firebasestorage.app",
  messagingSenderId: "647513724546",
  appId: "1:647513724546:web:fe6526976b5cc92c94469b",
  measurementId: "G-53E49M4GQ3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 