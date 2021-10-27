// Firebase
import { initializeApp, cert } from "firebase-admin/lib/app";
import { getAuth } from "firebase-admin/lib/auth";
// Local Code
import serviceAccount from '../serviceAccountKey.json'; // This file is extremely confidential. It's hidden by ".gitignore".

// @ts-ignore
const app = initializeApp({credential: cert(serviceAccount)});
export const auth = getAuth(app);
export const firebaseApiKey = "AIzaSyBY8_G-sDhZyADMcJ0gikABniXspB7B7wo";