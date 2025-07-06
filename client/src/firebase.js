// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCit4n1NYLOunTf0NcLXC5KIl20TBdXIQ8",
  authDomain: "midosis-26991.firebaseapp.com",
  projectId: "midosis-26991",
  storageBucket: "midosis-26991.firebasestorage.app",
  messagingSenderId: "147492626152",
  appId: "1:147492626152:web:9219eed92b22b2cc0e335d",
  measurementId: "G-RD2566SX90"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
