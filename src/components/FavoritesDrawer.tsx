import React from 'react';
import { Property } from '../types';
import { X, Trash2, Heart, ExternalLink, Calendar } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedProperties: Property[];
  onRemoveFavorite: (propertyId: number) => void;
  onClearAll: () => void;
  onSelectProperty: (property: Property) => void;
  onContactProperty: (property: Property) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  savedProperties,
  onRemoveFavorite,
  onClearAll,
  onSelectProperty,
  onContactProperty
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div
        id="favorites-drawer"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Saved Apartments</h3>
              <p className="text-xs text-slate-500">{savedProperties.length} properties saved</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedProperties.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-500 hover:text-red-600 font-medium px-2 py-1 rounded-md hover:bg-red-50 transition cursor-pointer"
                title="Clear all saved"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              id="close-favorites-drawer-btn"
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition cursor-pointer"
              aria-label="Close saved drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">No saved rentals yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the heart icon on any apartment or townhome card to save it for easy comparison and inquiry.
              </p>
            </div>
          ) : (
            savedProperties.map((property) => (
              <div
                key={property.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-red-300 transition flex gap-3 relative group"
              >
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-20 h-20 rounded-md object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onSelectProperty(property);
                    onClose();
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      {property.price}<span className="text-[11px] font-normal text-slate-500">/mo</span>
                    </span>
                    <button
                      onClick={() => onRemoveFavorite(property.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4
                    onClick={() => {
                      onSelectProperty(property);
                      onClose();
                    }}
                    className="font-bold text-slate-900 text-xs truncate mt-0.5 hover:text-red-600 cursor-pointer"
                  >
                    {property.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{property.address}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{property.beds} bed · {property.baths} bath · {property.sqft} sq ft</p>

                  <div className="mt-2 flex items-center gap-2">
                    <a
                      href="https://www.facebook.com/share/199hpDXEHZ/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 border border-red-200/60"
                    >
                      <Calendar className="w-3 h-3" /> Contact
                    </a>
                    <button
                      onClick={() => {
                        onSelectProperty(property);
                        onClose();
                      }}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 transition cursor-pointer flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> View
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedProperties.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-md transition text-xs cursor-pointer shadow-xs"
            >
              Continue Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
