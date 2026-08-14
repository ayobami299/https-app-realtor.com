import React, { useState, useMemo, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { Property, FilterState, InquiryFormData, AdviceArticle } from './types';
import { INITIAL_PROPERTIES, POPULAR_CITIES, ADVICE_ARTICLES } from './data/listingsData';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { PopularCities } from './components/PopularCities';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { MapView } from './components/MapView';
import { PropertyDetailsModal } from './components/PropertyDetailsModal';
import { ContactModal } from './components/ContactModal';
import { MoreFiltersModal } from './components/MoreFiltersModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { RentCalculatorModal } from './components/RentCalculatorModal';
import { AdviceSection } from './components/AdviceSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { UserAccountModal } from './components/UserAccountModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SearchX, Sparkles, Building, CheckCircle, RefreshCw } from 'lucide-react';
import {
  subscribeToAuth,
  logOut,
  fetchUserFavorites,
  addFavoriteToFirestore,
  removeFavoriteFromFirestore,
  recordInquiryInFirestore
} from './services/authService';

export default function App() {
  // State
  const [properties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [activeNav, setActiveNav] = useState<string>('Rent');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCity: null,
    minBeds: '',
    maxPrice: '',
    minPrice: '',
    petOnly: false,
    propertyTypes: [],
    selectedAmenities: [],
    minBaths: '',
    sortBy: 'featured'
  });

  const [savedPropertyIds, setSavedPropertyIds] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('renthub_saved_ids');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          if (parsed.length === 2 && parsed.includes(1) && parsed.includes(4)) {
            localStorage.removeItem('renthub_saved_ids');
            return [];
          }
          return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Modal controls
  const [selectedPropertyForDetails, setSelectedPropertyForDetails] = useState<Property | null>(null);
  const [selectedPropertyForContact, setSelectedPropertyForContact] = useState<Property | null>(null);
  const [contactModalType, setContactModalType] = useState<'general' | 'tour' | 'pricing' | 'application'>('general');
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isUserAccountOpen, setIsUserAccountOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' | 'manage' }>({
    isOpen: false,
    mode: 'login'
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, message?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth State Listener & Firestore Favorites Synchronization
  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const remoteFavorites = await fetchUserFavorites(user.uid);
          if (remoteFavorites.length > 0) {
            setSavedPropertyIds(remoteFavorites);
            localStorage.setItem('renthub_saved_ids', JSON.stringify(remoteFavorites));
          } else {
            // Push any local favorites into user's firestore on initial sync
            const currentLocal = savedPropertyIds;
            for (const propId of currentLocal) {
              const p = properties.find((item) => item.id === propId);
              if (p) {
                await addFavoriteToFirestore(user.uid, {
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  image: p.image,
                  address: p.address
                });
              }
            }
          }
        } catch (err) {
          console.error('Error synchronizing user favorites:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Toggle favorite with Firestore + localStorage persistence
  const handleToggleSave = async (property: Property) => {
    const exists = savedPropertyIds.includes(property.id);
    let updated: number[];

    if (exists) {
      updated = savedPropertyIds.filter((id) => id !== property.id);
      addToast('info', 'Removed from Saved', `${property.name} removed from your saved list.`);
      if (currentUser) {
        await removeFavoriteFromFirestore(currentUser.uid, property.id);
      }
    } else {
      updated = [...savedPropertyIds, property.id];
      addToast('success', 'Property Saved!', `${property.name} added to your saved favorites.`);
      if (currentUser) {
        await addFavoriteToFirestore(currentUser.uid, {
          id: property.id,
          name: property.name,
          price: property.price,
          image: property.image,
          address: property.address
        });
      }
    }

    setSavedPropertyIds(updated);
    try {
      localStorage.setItem('renthub_saved_ids', JSON.stringify(updated));
    } catch {}
  };

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Search term (name, address, city, state, zip, managed)
      if (filters.searchTerm.trim()) {
        const q = filters.searchTerm.toLowerCase().trim();
        const matchesQuery =
          item.name.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q) ||
          item.zip.toLowerCase().includes(q) ||
          item.managed.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Selected City
      if (filters.selectedCity) {
        if (item.city.toLowerCase() !== filters.selectedCity.toLowerCase()) {
          return false;
        }
      }

      // Beds
      if (filters.minBeds) {
        const requiredBeds = parseInt(filters.minBeds, 10);
        if (item.bedsMax < requiredBeds) return false;
      }

      // Price Max
      if (filters.maxPrice) {
        const maxLimit = parseInt(filters.maxPrice, 10);
        if (item.priceMin > maxLimit) return false;
      }

      // Price Min
      if (filters.minPrice) {
        const minLimit = parseInt(filters.minPrice, 10);
        if (item.priceMax < minLimit) return false;
      }

      // Pet Friendly
      if (filters.petOnly && !item.pet) {
        return false;
      }

      // Property Type
      if (filters.propertyTypes.length > 0) {
        if (!filters.propertyTypes.includes(item.propertyType)) {
          return false;
        }
      }

      // Bathrooms
      if (filters.minBaths) {
        const minB = parseFloat(filters.minBaths);
        if (item.bathsCount < minB) return false;
      }

      // Amenities
      if (filters.selectedAmenities.length > 0) {
        const combinedAmenities = [...item.amenities, ...item.communityFeatures].map((a) =>
          a.toLowerCase()
        );
        const hasAllAmenities = filters.selectedAmenities.every((filterAmenity) =>
          combinedAmenities.some((a) => a.includes(filterAmenity.toLowerCase().split('/')[0].trim()))
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.priceMin - b.priceMin;
        case 'price-desc':
          return b.priceMin - a.priceMin;
        case 'sqft-desc':
          return b.sqftMax - a.sqftMax;
        case 'rating-desc':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  }, [properties, filters]);

  // Saved properties array
  const savedPropertiesList = useMemo(() => {
    return properties.filter((p) => savedPropertyIds.includes(p.id));
  }, [properties, savedPropertyIds]);

  // Handlers
  const handleUpdateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      selectedCity: null,
      minBeds: '',
      maxPrice: '',
      minPrice: '',
      petOnly: false,
      propertyTypes: [],
      selectedAmenities: [],
      minBaths: '',
      sortBy: 'featured'
    });
    addToast('info', 'Filters Reset', 'All filter constraints have been cleared.');
  };

  const handleContactSubmit = async (data: InquiryFormData, property: Property) => {
    if (currentUser) {
      await recordInquiryInFirestore({
        ...data,
        userId: currentUser.uid,
        propertyId: property.id,
        propertyName: property.name,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
    }

    addToast(
      'success',
      'Inquiry Sent!',
      `Thank you ${data.fullName || 'renter'}! Your ${
        data.inquiryType === 'tour' ? 'tour request' : 'inquiry'
      } for ${property.name} has been recorded in your account & sent to ${property.managed}.`
    );
  };

  const handleAuthSuccess = (email: string, mode: string) => {
    addToast(
      'success',
      mode === 'login' ? 'Signed In' : mode === 'signup' ? 'Account Created' : 'Welcome!',
      `Welcome to RentHub! Logged in as ${email}.`
    );
  };

  const handleLogout = async () => {
    await logOut();
    setCurrentUser(null);
    addToast('info', 'Signed Out', 'You have been signed out of your account.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Header */}
      <Header
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        savedCount={savedPropertyIds.length}
        onOpenSaved={() => setIsFavoritesOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenManageRentals={() => setAuthModal({ isOpen: true, mode: 'manage' })}
        user={currentUser}
        onOpenUserAccount={() => setIsUserAccountOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {/* Hero Search Section */}
        <HeroSearch
          searchTerm={filters.searchTerm}
          setSearchTerm={(term) => handleUpdateFilters({ searchTerm: term })}
          onPerformSearch={(query) => {
            handleUpdateFilters({ searchTerm: query });
            const resultsElement = document.getElementById('listingsGridSection');
            if (resultsElement) {
              resultsElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onQuickFilter={(key, val) => {
            if (key === 'city') handleUpdateFilters({ selectedCity: val, searchTerm: '' });
            if (key === 'price') handleUpdateFilters({ maxPrice: val });
            if (key === 'pet') handleUpdateFilters({ petOnly: Boolean(val) });
            const resultsElement = document.getElementById('listingsGridSection');
            if (resultsElement) {
              resultsElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          totalListingsCount={properties.length}
        />

        {/* Popular Cities Grid */}
        <PopularCities
          cities={POPULAR_CITIES}
          selectedCity={filters.selectedCity}
          onSelectCity={(city) => {
            handleUpdateFilters({ selectedCity: city, searchTerm: '' });
            const resultsElement = document.getElementById('listingsGridSection');
            if (resultsElement) {
              resultsElement.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />

        {/* Listings Section (Filters + Grid / Map) */}
        <section id="listingsGridSection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-2">
          <FilterBar
            filters={filters}
            onUpdateFilters={handleUpdateFilters}
            onOpenMoreFilters={() => setIsMoreFiltersOpen(true)}
            onResetFilters={handleResetFilters}
            viewMode={viewMode}
            setViewMode={setViewMode}
            totalCount={filteredProperties.length}
          />

          {/* Render Mode: Map vs Grid vs List */}
          {filteredProperties.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-xl p-10 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-8 space-y-4">
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <SearchX className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No rental listings match your criteria</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Try expanding your price range, clearing bedroom limits, or removing the pet restriction.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-semibold px-4 py-2 rounded-md transition shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : viewMode === 'map' ? (
            /* Map View */
            <MapView
              properties={filteredProperties}
              onSelectProperty={(prop) => setSelectedPropertyForDetails(prop)}
              onContactProperty={(prop) => {
                setSelectedPropertyForContact(prop);
                setContactModalType('tour');
              }}
              savedIds={savedPropertyIds}
              onToggleSave={handleToggleSave}
            />
          ) : (
            /* Grid or List View */
            <div
              id="listingsGrid"
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredProperties.map((property) => (
                <ListingCard
                  key={property.id}
                  property={property}
                  isSaved={savedPropertyIds.includes(property.id)}
                  onToggleSave={handleToggleSave}
                  onContact={(prop) => {
                    setSelectedPropertyForContact(prop);
                    setContactModalType('general');
                  }}
                  onViewDetails={(prop) => setSelectedPropertyForDetails(prop)}
                  viewMode={viewMode === 'list' ? 'list' : 'grid'}
                />
              ))}
            </div>
          )}
        </section>

        {/* Advice & Guides Section */}
        <div id="adviceSection">
          <AdviceSection articles={ADVICE_ARTICLES} />
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onSelectCity={(city) => {
          handleUpdateFilters({ selectedCity: city, searchTerm: '' });
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
      />

      {/* Modals & Drawers */}
      <PropertyDetailsModal
        property={selectedPropertyForDetails}
        isOpen={Boolean(selectedPropertyForDetails)}
        onClose={() => setSelectedPropertyForDetails(null)}
        isSaved={selectedPropertyForDetails ? savedPropertyIds.includes(selectedPropertyForDetails.id) : false}
        onToggleSave={handleToggleSave}
        onContact={(prop, type) => {
          setSelectedPropertyForDetails(null);
          setSelectedPropertyForContact(prop);
          setContactModalType(type || 'general');
        }}
      />

      <ContactModal
        property={selectedPropertyForContact}
        isOpen={Boolean(selectedPropertyForContact)}
        onClose={() => setSelectedPropertyForContact(null)}
        onSubmitInquiry={handleContactSubmit}
        initialType={contactModalType}
      />

      <MoreFiltersModal
        isOpen={isMoreFiltersOpen}
        onClose={() => setIsMoreFiltersOpen(false)}
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredProperties.length}
      />

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        savedProperties={savedPropertiesList}
        onRemoveFavorite={(id) => {
          const prop = properties.find((p) => p.id === id);
          if (prop) handleToggleSave(prop);
        }}
        onClearAll={async () => {
          if (currentUser) {
            for (const propId of savedPropertyIds) {
              await removeFavoriteFromFirestore(currentUser.uid, propId);
            }
          }
          setSavedPropertyIds([]);
          try {
            localStorage.removeItem('renthub_saved_ids');
          } catch {}
          addToast('info', 'Favorites Cleared', 'All saved properties were removed.');
        }}
        onSelectProperty={(prop) => setSelectedPropertyForDetails(prop)}
        onContactProperty={(prop) => {
          setSelectedPropertyForContact(prop);
          setContactModalType('general');
        }}
      />

      <RentCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onApplyMaxPrice={(price) => {
          handleUpdateFilters({ maxPrice: price });
          addToast('success', 'Budget Applied', `Max rent filtered to $${Number(price).toLocaleString()}/month.`);
          const resultsElement = document.getElementById('listingsGridSection');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        initialMode={authModal.mode}
        onSuccess={handleAuthSuccess}
      />

      <UserAccountModal
        isOpen={isUserAccountOpen}
        onClose={() => setIsUserAccountOpen(false)}
        user={currentUser}
        savedProperties={savedPropertiesList}
        onSelectProperty={(prop) => setSelectedPropertyForDetails(prop)}
        onRemoveFavorite={async (id) => {
          const prop = properties.find((p) => p.id === id);
          if (prop) handleToggleSave(prop);
        }}
        onLogout={handleLogout}
        onOpenSavedDrawer={() => {
          setIsUserAccountOpen(false);
          setIsFavoritesOpen(true);
        }}
      />
    </div>
  );
}
