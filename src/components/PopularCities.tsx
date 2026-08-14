import React from 'react';
import { PopularCity } from '../types';
import { Building, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PopularCitiesProps {
  cities: PopularCity[];
  selectedCity: string | null;
  onSelectCity: (city: string | null) => void;
}

export const PopularCities: React.FC<PopularCitiesProps> = ({
  cities,
  selectedCity,
  onSelectCity
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse apartments in popular cities
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Explore curated rental inventory with updated specials across top metropolitan areas
          </p>
        </div>
        {selectedCity && (
          <button
            onClick={() => onSelectCity(null)}
            id="clear-city-filter-btn"
            className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md self-start sm:self-auto transition flex items-center gap-1.5 border border-red-100 cursor-pointer"
          >
            <span>Filtering: {selectedCity}</span>
            <span className="font-bold text-sm">× Clear</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
        {cities.map((city) => {
          const isSelected = selectedCity?.toLowerCase() === city.name.toLowerCase();
          return (
            <button
              key={city.name}
              id={`city-card-${city.name.toLowerCase()}`}
              onClick={() => onSelectCity(isSelected ? null : city.name)}
              className={`text-left p-4 sm:p-5 rounded-xl transition-all duration-200 group relative border overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-red-50/80 border-red-500 shadow-sm ring-2 ring-red-500/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-red-100 flex items-center justify-center text-slate-600 group-hover:text-red-600 transition mb-3">
                  <Building className="w-4 h-4" />
                </div>
                {isSelected && (
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>

              <h3 className={`font-bold text-base sm:text-lg transition ${
                isSelected ? 'text-red-700' : 'text-slate-900 group-hover:text-red-600'
              }`}>
                {city.name}, {city.state}
              </h3>
              
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {city.count}+ rentals
                </span>
                <span className="font-semibold text-slate-700">
                  avg {city.avgPrice}
                </span>
              </div>

              <div className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View listings</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
