import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  projectId: "organic-rune-pcf5x",
  appId: "1:315696293776:web:362d73819aef5e9fc37515",
  apiKey: "AIzaSyDj6NNgENOYFAKh74f1T9xrpQTJilu8usQ",
  authDomain: "organic-rune-pcf5x.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-renthub-656d7300-a333-4189-a3da-366555233088",
  storageBucket: "organic-rune-pcf5x.firebasestorage.app",
  messagingSenderId: "315696293776",
  measurementId: "",
  oAuthClientId: "315696293776-jb25mreal7fu9nv4115p31otipbenkk2.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

export default app;
