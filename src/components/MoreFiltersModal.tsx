import React from 'react';
import { FilterState } from '../types';
import { AMENITIES_LIST } from '../data/listingsData';
import { X, Check, RotateCcw, SlidersHorizontal, DollarSign } from 'lucide-react';

interface MoreFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
}

export const MoreFiltersModal: React.FC<MoreFiltersModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  totalFilteredCount
}) => {
  if (!isOpen) return null;

  const propertyTypeOptions = ['Apartment', 'Townhome', 'Condo', 'House'];
  const bathroomOptions = [
    { label: 'Any', value: '' },
    { label: '1+', value: '1' },
    { label: '1.5+', value: '1.5' },
    { label: '2+', value: '2' },
    { label: '2.5+', value: '2.5' }
  ];

  const handleTogglePropertyType = (type: string) => {
    const current = filters.propertyTypes;
    if (current.includes(type)) {
      onUpdateFilters({ propertyTypes: current.filter((t) => t !== type) });
    } else {
      onUpdateFilters({ propertyTypes: [...current, type] });
    }
  };

  const handleToggleAmenity = (amenity: string) => {
    const current = filters.selectedAmenities;
    if (current.includes(amenity)) {
      onUpdateFilters({ selectedAmenities: current.filter((a) => a !== amenity) });
    } else {
      onUpdateFilters({ selectedAmenities: [...current, amenity] });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="more-filters-dialog"
        className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-bold text-slate-900">Custom Filters</h3>
          </div>
          <button
            onClick={onClose}
            id="close-filters-modal-btn"
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-slate-200/60 transition cursor-pointer"
            aria-label="Close filters modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Price Range */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Monthly Price Range
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1">Minimum Price ($)</label>
                <input
                  type="number"
                  placeholder="No Min"
                  value={filters.minPrice}
                  onChange={(e) => onUpdateFilters({ minPrice: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-medium block mb-1">Maximum Price ($)</label>
                <input
                  type="number"
                  placeholder="No Max (e.g. 2000)"
                  value={filters.maxPrice}
                  onChange={(e) => onUpdateFilters({ maxPrice: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Property Types */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-3">Property Type</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {propertyTypeOptions.map((type) => {
                const isSelected = filters.propertyTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTogglePropertyType(type)}
                    className={`py-2 px-3 rounded-md border font-medium text-xs sm:text-sm transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bathrooms */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-3">Bathrooms</h4>
            <div className="flex flex-wrap gap-2">
              {bathroomOptions.map((b) => {
                const isSelected = filters.minBaths === b.value;
                return (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => onUpdateFilters({ minBaths: b.value })}
                    className={`px-3.5 py-1.5 rounded-md border text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {b.label} {b.value ? 'Baths' : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amenities & Features */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 mb-3">Amenities & Unit Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AMENITIES_LIST.map((amenity) => {
                const isChecked = filters.selectedAmenities.includes(amenity);
                return (
                  <label
                    key={amenity}
                    className="flex items-center gap-2.5 p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleAmenity(amenity)}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
                    />
                    <span className="text-slate-700 font-medium text-xs sm:text-sm">{amenity}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetFilters}
            id="modal-reset-filters-btn"
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm px-3 py-2 rounded-md hover:bg-slate-200/60 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset all</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            id="modal-apply-filters-btn"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-6 py-2 rounded-md shadow-xs transition text-xs sm:text-sm cursor-pointer"
          >
            Show {totalFilteredCount} {totalFilteredCount === 1 ? 'rental' : 'rentals'}
          </button>
        </div>
      </div>
    </div>
  );
};
