// Firebase
import admin from 'firebase-admin';
// Local Code
import serviceAccount from '../serviceAccountKey.json'; // This file is extremely confidential. It's hidden by ".gitignore".

// @ts-ignore
const app = admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

const auth = admin.auth(app);
const firestore = admin.firestore(app);

export {auth, firestore};
export const firebaseApiKey = "AIzaSyBY8_G-sDhZyADMcJ0gikABniXspB7B7wo";