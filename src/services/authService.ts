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
import { db } from '../lib/firebase';
import { UserProfile, UserInquiryRecord, SocialPlatform, SocialLink } from '../types';

const PROFILE_STORAGE_KEY = 'renthub_active_social_profile';
const ALL_PROFILES_KEY = 'renthub_saved_profiles';

const listeners: Array<(profile: UserProfile | null) => void> = [];

export const getStoredProfile = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getSavedProfilesList = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(ALL_PROFILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveActiveProfile = async (profile: UserProfile): Promise<UserProfile> => {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));

    // Update list of saved profiles
    const list = getSavedProfilesList();
    const existingIndex = list.findIndex((p) => p.id === profile.id);
    if (existingIndex >= 0) {
      list[existingIndex] = profile;
    } else {
      list.push(profile);
    }
    localStorage.setItem(ALL_PROFILES_KEY, JSON.stringify(list));

    // Sync to Firestore cloud
    try {
      const docRef = doc(db, 'profiles', profile.id);
      await setDoc(docRef, profile, { merge: true });
    } catch (fsErr) {
      console.warn('Firestore profile sync info:', fsErr);
    }

    notifyListeners(profile);
    return profile;
  } catch (err) {
    console.error('Error saving profile:', err);
    notifyListeners(profile);
    return profile;
  }
};

export const switchProfile = (profileId: string): UserProfile | null => {
  const list = getSavedProfilesList();
  const found = list.find((p) => p.id === profileId);
  if (found) {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(found));
    notifyListeners(found);
    return found;
  }
  return null;
};

export const removeProfile = async (profileId: string) => {
  try {
    let list = getSavedProfilesList();
    list = list.filter((p) => p.id !== profileId);
    localStorage.setItem(ALL_PROFILES_KEY, JSON.stringify(list));

    const current = getStoredProfile();
    if (current?.id === profileId) {
      if (list.length > 0) {
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(list[0]));
        notifyListeners(list[0]);
      } else {
        localStorage.removeItem(PROFILE_STORAGE_KEY);
        notifyListeners(null);
      }
    }
  } catch (err) {
    console.error('Error removing profile:', err);
  }
};

export const logOutProfile = () => {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
  notifyListeners(null);
};

export const subscribeToProfile = (callback: (profile: UserProfile | null) => void) => {
  listeners.push(callback);
  callback(getStoredProfile());
  return () => {
    const index = listeners.indexOf(callback);
    if (index >= 0) listeners.splice(index, 1);
  };
};

const notifyListeners = (profile: UserProfile | null) => {
  listeners.forEach((cb) => {
    try {
      cb(profile);
    } catch (e) {
      console.error(e);
    }
  });
};

// Social Profile Helpers
export const formatSocialUrl = (platform: SocialPlatform, handle: string): string => {
  const cleanHandle = handle.replace(/^@/, '').trim();
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${cleanHandle}`;
    case 'x':
      return `https://x.com/${cleanHandle}`;
    case 'linkedin':
      return `https://linkedin.com/in/${cleanHandle}`;
    case 'facebook':
      return `https://facebook.com/${cleanHandle}`;
    case 'tiktok':
      return `https://tiktok.com/@${cleanHandle}`;
    case 'github':
      return `https://github.com/${cleanHandle}`;
    case 'youtube':
      return `https://youtube.com/@${cleanHandle}`;
    default:
      return `#`;
  }
};

export const createSocialProfile = async (data: {
  displayName: string;
  handle: string;
  primarySocial: SocialPlatform;
  role: 'renter' | 'buyer' | 'landlord' | 'agent';
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  additionalSocials?: SocialLink[];
}): Promise<UserProfile> => {
  const cleanHandle = data.handle.startsWith('@') ? data.handle : `@${data.handle.trim()}`;
  const profileId = `profile_${data.primarySocial}_${cleanHandle.replace('@', '').toLowerCase()}_${Date.now().toString(36)}`;
  
  const defaultAvatars: Record<SocialPlatform, string> = {
    instagram: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    x: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    linkedin: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    facebook: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    tiktok: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    github: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    youtube: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
  };

  const primaryLink: SocialLink = {
    platform: data.primarySocial,
    handle: cleanHandle,
    url: formatSocialUrl(data.primarySocial, cleanHandle),
    verified: true
  };

  const allLinks = [primaryLink, ...(data.additionalSocials || [])];

  const newProfile: UserProfile = {
    id: profileId,
    displayName: data.displayName.trim() || cleanHandle.replace('@', ''),
    handle: cleanHandle,
    avatarUrl: data.avatarUrl || defaultAvatars[data.primarySocial] || defaultAvatars.instagram,
    email: data.email || `${cleanHandle.replace('@', '').toLowerCase()}@social.renthub.app`,
    phone: data.phone || '',
    bio: data.bio || `Verified ${data.role} connecting through ${data.primarySocial.toUpperCase()}`,
    role: data.role,
    primarySocial: data.primarySocial,
    socialLinks: allLinks,
    location: data.location || 'United States',
    createdAt: new Date().toISOString()
  };

  return await saveActiveProfile(newProfile);
};

// Favorites persistence linked to active social profile
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
    console.error('Error fetching user favorites:', err);
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
    console.warn('Favorite Firestore sync:', err);
  }
};

export const removeFavoriteFromFirestore = async (userId: string, propertyId: number) => {
  try {
    const favoriteDocId = `${userId}_${propertyId}`;
    const docRef = doc(db, 'favorites', favoriteDocId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Remove favorite Firestore:', err);
  }
};

// Inquiries & Tours storage
export const recordInquiryInFirestore = async (inquiry: UserInquiryRecord) => {
  try {
    const inquiriesCol = collection(db, 'inquiries');
    const docRef = await addDoc(inquiriesCol, inquiry);
    return docRef.id;
  } catch (err) {
    console.warn('Inquiry Firestore sync:', err);
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
    console.warn('Inquiries fetch:', err);
    return [];
  }
};
