import React, { useState, useEffect } from 'react';
import { Property, FloorPlan } from '../types';
import {
  X,
  Heart,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  PawPrint,
  Car,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Compass,
  Star,
  Play,
  Pause
} from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (property: Property) => void;
  onContact: (property: Property, type?: 'general' | 'tour' | 'pricing' | 'application') => void;
}

export const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onContact
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<FloorPlan | null>(null);
  const [includeParking, setIncludeParking] = useState(false);
  const [includePet, setIncludePet] = useState(false);

  const images = property?.images && property.images.length > 0 ? property.images : (property ? [property.image] : []);

  // Autoplay slideshow timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlayingSlideshow && images.length > 1) {
      interval = setInterval(() => {
        setActiveImageIdx((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayingSlideshow, images.length]);

  // Reset slide index when opening a new property
  useEffect(() => {
    setActiveImageIdx(0);
    setIsPlayingSlideshow(false);
  }, [property?.id, isOpen]);

  if (!isOpen || !property) return null;

  const activePlan = selectedPlan || (property.floorPlans && property.floorPlans[0]) || null;
  const baseRent = activePlan ? activePlan.price : property.priceMin;
  const parkingCost = includeParking ? 50 : 0;
  const petCost = includePet && property.pet ? 30 : 0;
  const estimatedUtilities = 135;
  const totalMonthlyCost = baseRent + parkingCost + petCost + estimatedUtilities;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div
        id={`property-details-dialog-${property.id}`}
        className="bg-white rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Floating Bar / Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-20">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              {property.propertyType} in {property.city}, {property.state}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {property.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(property)}
              className={`p-2 rounded-md border transition cursor-pointer ${
                isSaved
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save property'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600 text-red-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              id="close-details-modal-btn"
              className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
              aria-label="Close details modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto p-6 space-y-8 text-sm">
          {/* Gallery with Slide Mode & Navigation */}
          <div className="space-y-3">
            <div className="relative rounded-lg overflow-hidden h-72 sm:h-96 bg-slate-900 group/gallery">
              <img
                key={activeImageIdx}
                src={images[activeImageIdx]}
                alt={`${property.name} photo ${activeImageIdx + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Slideshow Autoplay Button Top-Right */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
                  id="toggle-slideshow-btn"
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs font-medium px-2.5 py-1.5 rounded-md backdrop-blur-xs flex items-center gap-1.5 border border-white/20 transition cursor-pointer z-10"
                >
                  {isPlayingSlideshow ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-red-400" />
                      <span>Pause Slide</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Play Slide</span>
                    </>
                  )}
                </button>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIdx((p) => (p === 0 ? images.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-xs border border-slate-700 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIdx((p) => (p === images.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer shadow-xs border border-slate-700 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Slide Dots Indicator inside main viewport */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/10">
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveImageIdx(dotIdx)}
                      className={`transition-all rounded-full cursor-pointer ${
                        activeImageIdx === dotIdx
                          ? 'w-5 h-2 bg-red-500'
                          : 'w-2 h-2 bg-white/60 hover:bg-white'
                      }`}
                      aria-label={`Go to photo ${dotIdx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Bottom badging on image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
                <div className="flex flex-wrap gap-1.5 pointer-events-auto">
                  {property.badges.map((b) => (
                    <span key={b} className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs">
                      {b}
                    </span>
                  ))}
                  {property.pet && (
                    <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <PawPrint className="w-3 h-3" /> Pet Friendly
                    </span>
                  )}
                </div>
                <span className="bg-slate-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-xs border border-slate-700 pointer-events-auto">
                  {activeImageIdx + 1} of {images.length} Photos
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-md overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activeImageIdx === idx ? 'border-red-600 ring-2 ring-red-500/30 opacity-100 scale-102' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-medium">Monthly Rent</span>
              <p className="text-lg font-bold text-slate-900">{property.price}</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Layout</span>
              <p className="text-lg font-bold text-slate-900">{property.beds} Bed · {property.baths} Bath</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Living Area</span>
              <p className="text-lg font-bold text-slate-900">{property.sqft} sq ft</p>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium">Community Rating</span>
              <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{property.rating}</span>
                <span className="text-xs text-slate-500 font-normal">({property.reviewCount})</span>
              </p>
            </div>
          </div>

          {/* Address & Neighborhood Walk Scores */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-red-50/50 border border-red-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-md bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{property.address}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Professionally managed by {property.managed} · Built in {property.yearBuilt}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
              <div className="text-center">
                <span className="block text-base font-bold text-red-600">{property.walkScore}/100</span>
                <span>Walk Score</span>
              </div>
              <div className="h-8 w-px bg-red-200" />
              <div className="text-center">
                <span className="block text-base font-bold text-red-600">{property.transitScore}/100</span>
                <span>Transit Score</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-2">About {property.name}</h3>
            <p className="text-slate-600 leading-relaxed">{property.description}</p>
          </div>

          {/* Available Floor Plans */}
          {property.floorPlans && property.floorPlans.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-red-600" />
                  Available Floor Plans & Pricing
                </h3>
                <span className="text-xs text-slate-500">Click a plan to calculate total monthly cost</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {property.floorPlans.map((plan) => {
                  const isSelected = activePlan?.id === plan.id;
                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-3.5 rounded-lg border text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-red-600 bg-red-50/60 ring-2 ring-red-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-slate-900 text-sm">{plan.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 py-0.2 rounded">Selected</span>
                        )}
                      </div>
                      <p className="text-lg font-bold text-red-600">${plan.price.toLocaleString()}<span className="text-xs font-normal text-slate-500">/mo</span></p>
                      <div className="mt-2 text-xs text-slate-600 space-y-1">
                        <p>{plan.beds} Bed · {plan.baths} Bath · {plan.sqft} sq ft</p>
                        <p className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          {plan.availability}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Rent & Fees Calculator */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-lg border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                Estimated Total Monthly Out-of-Pocket
              </h3>
              <span className="text-xs font-bold text-slate-500">
                Plan: {activePlan ? activePlan.name : 'Selected Plan'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Base Unit Rent</span>
                  <span className="font-bold text-slate-900">${baseRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-600">Estimated Utilities (Electric, Water, Trash)</span>
                  <span className="font-bold text-slate-900">${estimatedUtilities}</span>
                </div>
                <label className="flex justify-between items-center py-1 cursor-pointer">
                  <span className="flex items-center gap-2 text-slate-700 font-medium">
                    <Car className="w-3.5 h-3.5 text-slate-500" />
                    Reserved Covered Parking (+ $50/mo)
                  </span>
                  <input
                    type="checkbox"
                    checked={includeParking}
                    onChange={(e) => setIncludeParking(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 border-slate-300"
                  />
                </label>
                {property.pet && (
                  <label className="flex justify-between items-center py-1 cursor-pointer">
                    <span className="flex items-center gap-2 text-slate-700 font-medium">
                      <PawPrint className="w-3.5 h-3.5 text-slate-500" />
                      Pet Rent (+ $30/mo)
                    </span>
                    <input
                      type="checkbox"
                      checked={includePet}
                      onChange={(e) => setIncludePet(e.target.checked)}
                      className="rounded text-red-600 focus:ring-red-500 border-slate-300"
                    />
                  </label>
                )}
              </div>

              {/* Total Output Card */}
              <div className="bg-white p-4 rounded-md border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Estimated Monthly Budget</span>
                  <p className="text-2xl font-bold text-red-600 mt-1">
                    ${totalMonthlyCost.toLocaleString()}
                    <span className="text-xs font-normal text-slate-500">/mo</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Deposit: {property.deposit} · Security deposit is refundable upon move-out inspection.
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  <span>No hidden admin fees guaranteed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                Apartment Features
              </h4>
              <ul className="space-y-2">
                {property.amenities.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-indigo-600" />
                Community Amenities
              </h4>
              <ul className="space-y-2">
                {property.communityFeatures.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700 text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pet Policy */}
          <div className="bg-amber-50/60 p-3.5 rounded-lg border border-amber-200 text-xs">
            <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5 text-sm">
              <PawPrint className="w-4 h-4 text-amber-700" />
              Pet Policy
            </h4>
            <p className="text-amber-800 leading-relaxed">
              {property.petDetails || (property.pet ? "Pets are warmly welcomed in this community." : "No pets allowed on premises.")}
            </p>
          </div>
        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500">Starting from</span>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">
              ${baseRent.toLocaleString()}
              <span className="text-xs font-normal text-slate-500">/mo</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onContact(property, 'tour')}
              id="details-schedule-tour-btn"
              className="flex-1 sm:flex-none bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold px-4 py-2 rounded-md transition text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Schedule Tour</span>
            </button>

            <button
              type="button"
              onClick={() => onContact(property, 'application')}
              id="details-contact-property-btn"
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-5 py-2 rounded-md transition text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Apply ($75 Fee) & Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
