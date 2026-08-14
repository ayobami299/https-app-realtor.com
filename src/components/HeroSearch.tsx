import React, { useState } from 'react';
import { Search, MapPin, Sparkles, X } from 'lucide-react';

interface HeroSearchProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onPerformSearch: (query: string) => void;
  onQuickFilter: (filterKey: string, val: any) => void;
  totalListingsCount: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchTerm,
  setSearchTerm,
  onPerformSearch,
  onQuickFilter,
  totalListingsCount
}) => {
  const [localInput, setLocalInput] = useState(searchTerm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPerformSearch(localInput);
  };

  const quickTags = [
    { label: 'Austin, TX', action: () => onQuickFilter('city', 'Austin') },
    { label: 'Atlanta, GA', action: () => onQuickFilter('city', 'Atlanta') },
    { label: 'Buford, GA', action: () => onQuickFilter('city', 'Buford') },
    { label: 'Ann Arbor, MI', action: () => onQuickFilter('city', 'Ann Arbor') },
    { label: 'Under $1,500', action: () => onQuickFilter('price', '1500') },
    { label: '🐾 Pet Friendly', action: () => onQuickFilter('pet', true) },
  ];

  return (
    <section className="bg-slate-900 text-white py-12 md:py-16 relative overflow-hidden border-b border-slate-800">
      {/* Background ambient accents */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 bg-slate-800/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-4 text-slate-300 border border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Over {totalListingsCount * 120}+ Verified Units Available</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
          Apartments for rent
        </h1>
        <p className="text-base sm:text-lg text-slate-300 font-normal max-w-2xl mx-auto mb-8 leading-relaxed">
          Search verified apartments, condos, and townhomes with upfront pricing and virtual 3D tours
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-2 shadow-xl max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 border border-slate-200 transition focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500"
        >
          <div className="flex-1 flex items-center px-3 py-1 text-slate-800">
            <MapPin className="w-5 h-5 text-red-600 shrink-0 mr-3" />
            <input
              type="text"
              id="heroSearchInput"
              value={localInput}
              onChange={(e) => {
                setLocalInput(e.target.value);
                setSearchTerm(e.target.value);
              }}
              placeholder="City, neighborhood, address, or ZIP..."
              className="w-full py-2 text-sm sm:text-base outline-hidden text-slate-900 placeholder-slate-400 bg-transparent font-medium"
            />
            {localInput && (
              <button
                type="button"
                onClick={() => {
                  setLocalInput('');
                  setSearchTerm('');
                  onPerformSearch('');
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            id="heroSearchSubmitBtn"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-6 sm:px-8 py-3 rounded-md transition flex items-center justify-center gap-2 shadow-xs hover:shadow-sm cursor-pointer text-sm"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Search</span>
          </button>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 font-medium mr-1 hidden sm:inline uppercase tracking-wider">Popular:</span>
          {quickTags.map((tag, idx) => (
            <button
              key={idx}
              type="button"
              id={`quick-tag-${idx}`}
              onClick={() => {
                tag.action();
              }}
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-md border border-slate-700 transition cursor-pointer font-medium"
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
