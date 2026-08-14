import React from 'react';
import { FilterState } from '../types';
import { SlidersHorizontal, PawPrint, LayoutGrid, List, Map, X, ArrowDownUp } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onOpenMoreFilters: () => void;
  onResetFilters: () => void;
  viewMode: 'grid' | 'list' | 'map';
  setViewMode: (mode: 'grid' | 'list' | 'map') => void;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onUpdateFilters,
  onOpenMoreFilters,
  onResetFilters,
  viewMode,
  setViewMode,
  totalCount
}) => {
  // Count how many non-default filters are active
  const activeCount = [
    Boolean(filters.searchTerm),
    Boolean(filters.selectedCity),
    Boolean(filters.minBeds),
    Boolean(filters.maxPrice),
    Boolean(filters.minPrice),
    filters.petOnly,
    filters.propertyTypes.length > 0,
    filters.selectedAmenities.length > 0,
    Boolean(filters.minBaths),
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Results title and count */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Apartments for rent
            </h2>
            <span
              id="resultsCount"
              className="bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-red-100"
            >
              <span className="font-bold">{totalCount}</span> {totalCount === 1 ? 'rental' : 'rentals'}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Updated today with verified leasing terms and available move-in specials
          </p>
        </div>

        {/* Quick Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Beds Dropdown */}
          <select
            id="bedFilter"
            value={filters.minBeds}
            onChange={(e) => onUpdateFilters({ minBeds: e.target.value })}
            className="border border-slate-200 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="">Beds (Any)</option>
            <option value="1">1+ Beds</option>
            <option value="2">2+ Beds</option>
            <option value="3">3+ Beds</option>
            <option value="4">4+ Beds</option>
          </select>

          {/* Price Dropdown */}
          <select
            id="priceFilter"
            value={filters.maxPrice}
            onChange={(e) => onUpdateFilters({ maxPrice: e.target.value })}
            className="border border-slate-200 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="">Price (Max)</option>
            <option value="1000">Under $1,000</option>
            <option value="1500">Under $1,500</option>
            <option value="2000">Under $2,000</option>
            <option value="2500">Under $2,500</option>
          </select>

          {/* Pet Friendly Toggle Button (matches mockup) */}
          <button
            type="button"
            id="petBtn"
            onClick={() => onUpdateFilters({ petOnly: !filters.petOnly })}
            className={`border rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
              filters.petOnly
                ? 'bg-red-50 border-red-200 text-red-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PawPrint className="w-3.5 h-3.5" />
            <span>Pet friendly</span>
          </button>

          {/* More Filters button */}
          <button
            type="button"
            id="moreFiltersBtn"
            onClick={onOpenMoreFilters}
            className="border border-slate-200 rounded-md px-3.5 py-2 text-xs sm:text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs sm:text-sm shadow-xs">
            <ArrowDownUp className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="sortBySelector"
              value={filters.sortBy}
              onChange={(e) => onUpdateFilters({ sortBy: e.target.value as any })}
              aria-label="Sort listings"
              className="bg-transparent font-medium text-slate-700 outline-none cursor-pointer pr-1"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="sqft-desc">Largest Sq Ft</option>
              <option value="rating-desc">Top Rated</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-md border border-slate-200">
            <button
              type="button"
              id="view-mode-grid"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="view-mode-list"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="view-mode-map"
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded transition cursor-pointer ${
                viewMode === 'map' ? 'bg-white text-red-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Interactive Map View"
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active:</span>

          {filters.searchTerm && (
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-md border border-red-100">
              Query: &quot;{filters.searchTerm}&quot;
              <button
                type="button"
                onClick={() => onUpdateFilters({ searchTerm: '' })}
                className="hover:text-red-900 cursor-pointer"
                aria-label="Remove search term filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.selectedCity && (
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-medium px-2.5 py-1 rounded-md border border-red-100">
              City: {filters.selectedCity}
              <button
                type="button"
                onClick={() => onUpdateFilters({ selectedCity: null })}
                className="hover:text-red-900 cursor-pointer"
                aria-label="Remove city filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.minBeds && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200">
              {filters.minBeds}+ Beds
              <button
                type="button"
                onClick={() => onUpdateFilters({ minBeds: '' })}
                className="hover:text-slate-900 cursor-pointer"
                aria-label="Remove beds filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.maxPrice && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200">
              Max ${Number(filters.maxPrice).toLocaleString()}
              <button
                type="button"
                onClick={() => onUpdateFilters({ maxPrice: '' })}
                className="hover:text-slate-900 cursor-pointer"
                aria-label="Remove max price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.minPrice && (
            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200">
              Min ${Number(filters.minPrice).toLocaleString()}
              <button
                type="button"
                onClick={() => onUpdateFilters({ minPrice: '' })}
                className="hover:text-slate-900 cursor-pointer"
                aria-label="Remove min price filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.petOnly && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs font-medium px-2.5 py-1 rounded-md border border-emerald-200">
              🐾 Pet Friendly
              <button
                type="button"
                onClick={() => onUpdateFilters({ petOnly: false })}
                className="hover:text-emerald-950 cursor-pointer"
                aria-label="Remove pet friendly filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.propertyTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200"
            >
              {type}
              <button
                type="button"
                onClick={() =>
                  onUpdateFilters({
                    propertyTypes: filters.propertyTypes.filter((t) => t !== type),
                  })
                }
                className="hover:text-slate-900 cursor-pointer"
                aria-label={`Remove ${type} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {filters.selectedAmenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200"
            >
              {amenity}
              <button
                type="button"
                onClick={() =>
                  onUpdateFilters({
                    selectedAmenities: filters.selectedAmenities.filter((a) => a !== amenity),
                  })
                }
                className="hover:text-slate-900 cursor-pointer"
                aria-label={`Remove ${amenity} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onResetFilters}
            id="clear-all-filters-btn"
            className="text-xs font-bold text-red-600 hover:text-red-800 underline ml-1 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
