// Firebase
import { initializeApp as initializeAdminApp, cert } from "firebase-admin/lib/app";
import { getAuth as getAuthAdmin } from "firebase-admin/lib/auth";
import { initializeApp } from "@firebase/app";
import { getAuth } from "firebase/auth";
// Local Code
import serviceAccount from '../serviceAccountKey.json'; // This file is extremely confidential. It's hidden by ".gitignore".

const firebaseConfig = {
	apiKey: "AIzaSyBY8_G-sDhZyADMcJ0gikABniXspB7B7wo",
	authDomain: "halen-assessment-12345.firebaseapp.com",
	projectId: "halen-assessment-12345",
	storageBucket: "halen-assessment-12345.appspot.com",
	messagingSenderId: "436328559305",
	appId: "1:436328559305:web:891ce88e7220f9f3639318"
};

//const app = initializeApp(firebaseConfig);
const adminApp = initializeAdminApp({credential: cert(serviceAccount)});
const app = initializeApp(firebaseConfig);
export const authAdmin = getAuthAdmin(adminApp);
export const auth = getAuth(app);