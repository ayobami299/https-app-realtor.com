import React, { useState } from 'react';
import { Property } from '../types';
import { Heart, PawPrint, Eye, ChevronLeft, ChevronRight, CheckCircle, Calendar, Star, ArrowRight } from 'lucide-react';

interface ListingCardProps {
  property: Property;
  isSaved: boolean;
  onToggleSave: (property: Property) => void;
  onContact: (property: Property) => void;
  onViewDetails: (property: Property) => void;
  viewMode?: 'grid' | 'list';
}

export const ListingCard: React.FC<ListingCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  onContact,
  onViewDetails,
  viewMode = 'grid'
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = property.images && property.images.length > 0 ? property.images : [property.image];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const isList = viewMode === 'list';

  return (
    <div
      id={`property-card-${property.id}`}
      className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-slate-300 transition-all ${
        isList ? 'md:flex-row' : ''
      }`}
    >
      {/* Image Container with Badges */}
      <div className={`relative overflow-hidden bg-slate-200 ${isList ? 'md:w-80 h-56 md:h-auto shrink-0' : 'h-48'}`}>
        <img
          src={images[activeImageIndex]}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          onClick={() => onViewDetails(property)}
          loading="lazy"
        />

        {/* Gradient overlay on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

        {/* Top-Left Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[70%]">
          {property.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter shadow-xs flex items-center gap-1 ${
                badge.includes('Special')
                  ? 'bg-red-600'
                  : badge.includes('3D')
                  ? 'bg-indigo-600'
                  : 'bg-blue-600'
              }`}
            >
              {badge}
            </span>
          ))}
          {property.badges.length === 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter shadow-xs">
              Verified Unit
            </span>
          )}
        </div>

        {/* Top-Right Pet Friendly & Save */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {property.pet && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter flex items-center gap-1 shadow-xs">
              <PawPrint className="w-3 h-3" />
              <span>Pet OK</span>
            </span>
          )}
          <button
            type="button"
            id={`save-btn-${property.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-md cursor-pointer ${
              isSaved
                ? 'bg-white text-red-600 shadow-md'
                : 'bg-white/20 hover:bg-white text-white hover:text-red-600'
            }`}
            aria-label={isSaved ? 'Remove from saved' : 'Save property'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-600 text-red-600' : ''}`} />
          </button>
        </div>

        {/* Price overlay on image bottom-left */}
        <div className="absolute bottom-3 left-3 text-white font-bold text-lg leading-none drop-shadow-sm flex items-baseline gap-1">
          <span>{property.price}</span>
          <span className="text-xs font-normal text-slate-200">/mo</span>
        </div>

        {/* Image carousel arrows if multiple images */}
        {images.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-xs">
              {activeImageIndex + 1}/{images.length}
            </div>
          </div>
        )}

        {/* Quick View trigger button */}
        <button
          onClick={() => onViewDetails(property)}
          className="absolute bottom-3 right-14 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-xs cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Content Info Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Specs Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 uppercase tracking-wide">
              <span>{property.beds} BEDS</span>
              <span className="text-slate-300">•</span>
              <span>{property.baths} BATHS</span>
              <span className="text-slate-300">•</span>
              <span>{property.sqft} SQFT</span>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{property.rating}</span>
            </div>
          </div>

          {/* Name & Address */}
          <h3
            onClick={() => onViewDetails(property)}
            className="font-bold text-slate-900 text-lg leading-tight mb-1 group-hover:text-red-600 transition-colors cursor-pointer truncate"
            title={property.name}
          >
            {property.name}
          </h3>

          <p className="text-sm text-slate-500 mb-3 truncate" title={property.address}>
            {property.address}
          </p>

          {/* Managed by / availability line */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span className="truncate">
              By <span className="font-medium text-slate-700">{property.managed}</span>
            </span>
            <span className="text-emerald-600 font-medium shrink-0 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              {property.availableDate}
            </span>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            id={`contact-property-btn-${property.id}`}
            onClick={() => onContact(property)}
            className="flex-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-semibold py-2 px-3 rounded-md transition text-center text-xs shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>

          <button
            type="button"
            id={`details-btn-${property.id}`}
            onClick={() => onViewDetails(property)}
            className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2 px-3 rounded-md transition text-xs cursor-pointer flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
