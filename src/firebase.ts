// Firebase
import { initializeApp, cert } from "firebase-admin/lib/app";
import { getAuth } from "firebase-admin/lib/auth";
import { getFirestore } from "firebase-admin/lib/firestore";
// Local Code
import serviceAccount from '../serviceAccountKey.json'; // This file is extremely confidential. It's hidden by ".gitignore".

// @ts-ignore
const app = initializeApp({credential: cert(serviceAccount)});

const auth = getAuth(app);
const firestore = getFirestore(app);

export {auth, firestore};
export const firebaseApiKey = "AIzaSyBY8_G-sDhZyADMcJ0gikABniXspB7B7wo";