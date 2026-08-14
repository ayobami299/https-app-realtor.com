import React, { useState } from 'react';
import { Property } from '../types';
import { MapPin, Navigation, Eye, Calendar, Heart, ZoomIn, ZoomOut } from 'lucide-react';

interface MapViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onContactProperty: (property: Property) => void;
  savedIds: number[];
  onToggleSave: (property: Property) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  properties,
  onSelectProperty,
  onContactProperty,
  savedIds,
  onToggleSave
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    properties.length > 0 ? properties[0].id : null
  );
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0] || null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Interactive Map Explorer</h3>
            <p className="text-xs text-slate-500">Showing {properties.length} mapped apartments & townhomes</p>
          </div>
        </div>

        {/* Map View Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
            className="p-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Reset View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Visual Map Stage */}
        <div className="lg:col-span-8 bg-slate-100 relative overflow-hidden flex items-center justify-center p-4 select-none min-h-[380px]">
          {/* Simulated Map Canvas Texture with Roads & Water */}
          <div
            className="w-full h-full absolute inset-0 transition-transform duration-300 pointer-events-none"
            style={{
              transform: `scale(${zoomLevel})`,
              background: `
                radial-gradient(#cbd5e1 1.5px, transparent 1.5px),
                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px, 120px 120px, 120px 120px',
              backgroundColor: '#f8fafc'
            }}
          >
            {/* Waterway curves */}
            <svg className="w-full h-full absolute inset-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M-50,120 Q 200,60 450,220 T 900,180 T 1400,320"
                fill="none"
                stroke="#0284c7"
                strokeWidth="48"
              />
              <path
                d="M100,500 Q 350,320 700,450 T 1200,400"
                fill="none"
                stroke="#0284c7"
                strokeWidth="28"
              />
            </svg>
          </div>

          {/* Map Pins */}
          <div className="relative w-full h-full min-h-[360px]">
            {properties.map((p, idx) => {
              const isSelected = selectedProperty?.id === p.id;
              // Deterministic positions based on property index and lat/lng
              const topPos = 20 + ((idx * 23 + (p.id * 17)) % 62);
              const leftPos = 12 + ((idx * 29 + (p.id * 13)) % 76);

              return (
                <div
                  key={p.id}
                  style={{ top: `${topPos}%`, left: `${leftPos}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedPropertyId(p.id)}
                    className={`group/pin flex items-center gap-1 px-2.5 py-1 rounded-md font-bold text-xs shadow-md transition-transform cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white scale-110 ring-2 ring-red-500/30 z-30'
                        : 'bg-white text-slate-900 hover:bg-red-50 hover:text-red-600 hover:scale-105 border border-slate-200'
                    }`}
                  >
                    <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-red-600'}`} />
                    <span>${p.priceMin.toLocaleString()}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Floating Selected Pin Badge on Map */}
          {selectedProperty && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white rounded-xl p-3 shadow-lg border border-slate-200 z-20 animate-in fade-in slide-in-from-bottom-3 duration-200">
              <div className="flex gap-3 items-center">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.name}
                  className="w-16 h-16 rounded-md object-cover shrink-0 cursor-pointer"
                  onClick={() => onSelectProperty(selectedProperty)}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                    ${selectedProperty.priceMin}/mo
                  </span>
                  <h4
                    onClick={() => onSelectProperty(selectedProperty)}
                    className="font-bold text-slate-900 text-xs truncate mt-0.5 hover:text-red-600 cursor-pointer"
                  >
                    {selectedProperty.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{selectedProperty.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Property Preview Sidebar in Map */}
        <div className="lg:col-span-4 p-5 border-t lg:border-t-0 lg:border-l border-slate-200 bg-white flex flex-col justify-between">
          {selectedProperty ? (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden h-44 bg-slate-100">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.name}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => onSelectProperty(selectedProperty)}
                />
                <button
                  type="button"
                  onClick={() => onToggleSave(selectedProperty)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      savedIds.includes(selectedProperty.id) ? 'fill-red-600 text-red-600' : ''
                    }`}
                  />
                </button>
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">{selectedProperty.price}</h4>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {selectedProperty.beds} Beds · {selectedProperty.baths} Baths · {selectedProperty.sqft} sq ft
                </p>
                <h5 className="font-bold text-slate-900 text-base mt-2">{selectedProperty.name}</h5>
                <p className="text-xs text-slate-500 mt-0.5">{selectedProperty.address}</p>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <p><span className="font-semibold text-slate-900">Manager:</span> {selectedProperty.managed}</p>
                <p><span className="font-semibold text-slate-900">Pet Policy:</span> {selectedProperty.pet ? 'Pets Allowed' : 'No Pets'}</p>
                <p><span className="font-semibold text-slate-900">Walk Score:</span> {selectedProperty.walkScore}/100</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => onContactProperty(selectedProperty)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md transition text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Contact / Schedule Tour</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectProperty(selectedProperty)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-md transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Details & Floor Plans</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              Select a pin on the map to inspect property details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
