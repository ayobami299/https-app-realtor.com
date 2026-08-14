export interface FloorPlan {
  id: string;
  name: string;
  beds: number;
  baths: number;
  sqft: number;
  price: number;
  availability: string;
  deposit: number;
}

export interface Property {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: string;
  priceMin: number;
  priceMax: number;
  beds: string;
  bedsMin: number;
  bedsMax: number;
  baths: string;
  bathsCount: number;
  sqft: string;
  sqftMin: number;
  sqftMax: number;
  image: string;
  images: string[];
  badges: string[];
  pet: boolean;
  petDetails?: string;
  managed: string;
  propertyType: 'Apartment' | 'Townhome' | 'Condo' | 'House';
  description: string;
  amenities: string[];
  communityFeatures: string[];
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  yearBuilt: number;
  availableDate: string;
  floorPlans: FloorPlan[];
  walkScore: number;
  transitScore: number;
  deposit: string;
  parkingFee?: string;
}

export interface PopularCity {
  name: string;
  state: string;
  count: number;
  avgPrice: string;
  image: string;
}

export interface FilterState {
  searchTerm: string;
  selectedCity: string | null;
  minBeds: string;
  maxPrice: string;
  minPrice: string;
  petOnly: boolean;
  propertyTypes: string[];
  selectedAmenities: string[];
  minBaths: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'sqft-desc' | 'rating-desc';
}

export interface AdviceArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  image: string;
  summary: string;
  content: string[];
  author: string;
  date: string;
}

export interface InquiryFormData {
  fullName: string;
  email: string;
  phone: string;
  moveInDate: string;
  message: string;
  inquiryType: 'general' | 'tour' | 'pricing' | 'application';
  tourDate?: string;
  tourTime?: string;
  preferredBeds?: string;
}

export type SocialPlatform = 'instagram' | 'x' | 'linkedin' | 'facebook' | 'tiktok' | 'github' | 'youtube';

export interface SocialLink {
  platform: SocialPlatform;
  handle: string;
  url?: string;
  verified?: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl: string;
  email?: string;
  phone?: string;
  bio?: string;
  role: 'renter' | 'buyer' | 'landlord' | 'agent';
  primarySocial: SocialPlatform;
  socialLinks: SocialLink[];
  location?: string;
  createdAt: string;
}

export interface UserInquiryRecord extends InquiryFormData {
  id?: string;
  userId: string;
  propertyName: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'completed';
}

