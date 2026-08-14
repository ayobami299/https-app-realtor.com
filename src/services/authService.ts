import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { AuthUserProfile, UserInquiryRecord } from '../types';

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const signUpWithEmail = async (email: string, pass: string, displayName: string, role: 'renter' | 'landlord' = 'renter') => {
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (displayName) {
    await updateProfile(cred.user, { displayName });
  }
  
  // Save user profile to Firestore
  try {
    const userDocRef = doc(db, 'users', cred.user.uid);
    await setDoc(userDocRef, {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: displayName || cred.user.displayName || 'User',
      photoURL: cred.user.photoURL || '',
      role: role,
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('Error saving user profile to Firestore:', err);
  }

  return cred.user;
};

export const logInWithEmail = async (email: string, pass: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
};

export const logInWithGoogle = async () => {
  const cred = await signInWithPopup(auth, googleProvider);
  
  // Save or update profile in Firestore
  try {
    const userDocRef = doc(db, 'users', cred.user.uid);
    const existing = await getDoc(userDocRef);
    if (!existing.exists()) {
      await setDoc(userDocRef, {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || 'User',
        photoURL: cred.user.photoURL || '',
        role: 'renter',
        createdAt: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('Error recording Google user in Firestore:', err);
  }

  return cred.user;
};

export const logOut = async () => {
  await fbSignOut(auth);
};

// Firestore Sync for Saved Favorites per user
export const fetchUserFavorites = async (userId: string): Promise<number[]> => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const ids: number[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (typeof data.propertyId === 'number') {
        ids.push(data.propertyId);
      }
    });
    return ids;
  } catch (err) {
    console.error('Error fetching user favorites from Firestore:', err);
    return [];
  }
};

export const addFavoriteToFirestore = async (
  userId: string,
  property: { id: number; name: string; price: string; image: string; address: string }
) => {
  try {
    const favoriteDocId = `${userId}_${property.id}`;
    const docRef = doc(db, 'favorites', favoriteDocId);
    await setDoc(docRef, {
      userId,
      propertyId: property.id,
      propertyName: property.name,
      propertyPrice: property.price,
      propertyImage: property.image,
      propertyAddress: property.address,
      savedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error adding favorite to Firestore:', err);
  }
};

export const removeFavoriteFromFirestore = async (userId: string, propertyId: number) => {
  try {
    const favoriteDocId = `${userId}_${propertyId}`;
    const docRef = doc(db, 'favorites', favoriteDocId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error removing favorite from Firestore:', err);
  }
};

// Inquiries & Tours storage
export const recordInquiryInFirestore = async (inquiry: UserInquiryRecord) => {
  try {
    const inquiriesCol = collection(db, 'inquiries');
    const docRef = await addDoc(inquiriesCol, inquiry);
    return docRef.id;
  } catch (err) {
    console.error('Error adding inquiry to Firestore:', err);
    return null;
  }
};

export const fetchUserInquiries = async (userId: string): Promise<UserInquiryRecord[]> => {
  try {
    const q = query(collection(db, 'inquiries'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const records: UserInquiryRecord[] = [];
    querySnapshot.forEach((docSnap) => {
      records.push({
        id: docSnap.id,
        ...(docSnap.data() as Omit<UserInquiryRecord, 'id'>)
      });
    });
    return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.error('Error fetching user inquiries from Firestore:', err);
    return [];
  }
};
