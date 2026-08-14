import React, { useState } from 'react';
import { Home, Heart, Calculator, Menu, X, Building2, User, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeNav: string;
  setActiveNav: (tab: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenCalculator: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenManageRentals: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  setActiveNav,
  savedCount,
  onOpenSaved,
  onOpenCalculator,
  onOpenAuth,
  onOpenManageRentals
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'Rent', label: 'Rent' },
    { id: 'Buy', label: 'Buy' },
    { id: 'Sell', label: 'Sell' },
    { id: 'Mortgage', label: 'Mortgage' },
    { id: 'Find an Agent', label: 'Find an Agent' },
    { id: 'My Home', label: 'My Home' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand & Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <button
            onClick={() => setActiveNav('Rent')}
            id="brand-logo-btn"
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white shadow-xs">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">RentHub</span>
          </button>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-600 uppercase tracking-wide h-16">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    setActiveNav(item.id);
                    if (item.id === 'Mortgage') {
                      onOpenCalculator();
                    }
                  }}
                  className={`h-full flex items-center transition cursor-pointer ${
                    isActive
                      ? 'text-red-600 border-b-2 border-red-600 -mb-[1px]'
                      : 'hover:text-red-600'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6 text-sm">
          <button
            onClick={onOpenCalculator}
            id="header-affordability-calc-btn"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Rent Affordability Calculator"
          >
            <Calculator className="w-4 h-4 text-slate-400" />
            <span className="hidden md:inline">Rent Calculator</span>
          </button>

          <button
            onClick={onOpenManageRentals}
            id="header-manage-rentals-btn"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Manage rentals</span>
          </button>

          <button
            onClick={onOpenSaved}
            id="header-saved-btn"
            className="relative flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition cursor-pointer"
            title="Saved Apartments"
          >
            <Heart className={`w-4 h-4 ${savedCount > 0 ? 'text-red-600 fill-red-600' : 'text-slate-400'}`} />
            <span className="hidden lg:inline">Saved Homes</span>
            {savedCount > 0 && (
              <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {savedCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth('login')}
              id="header-login-btn"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md transition cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => onOpenAuth('signup')}
              id="header-signup-btn"
              className="bg-slate-900 text-white px-4 lg:px-5 py-2 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenSaved}
            id="mobile-saved-trigger"
            className="p-2 text-slate-600 hover:text-red-600 relative"
            aria-label="View saved listings"
          >
            <Heart className={`w-5 h-5 ${savedCount > 0 ? 'text-red-600 fill-red-600' : ''}`} />
            {savedCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-btn"
            className="p-2 text-slate-700 hover:text-red-600 rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setMobileMenuOpen(false);
                  if (item.id === 'Mortgage') onOpenCalculator();
                }}
                className={`text-left px-3 py-2 rounded-md font-semibold uppercase tracking-wide text-xs transition ${
                  activeNav === item.id
                    ? 'bg-red-50 text-red-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onOpenCalculator();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600"
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-slate-500" />
                Rent Affordability Calculator
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </button>

            <button
              onClick={() => {
                onOpenManageRentals();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              Manage & Advertise Rentals
            </button>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-sm font-semibold border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  onOpenAuth('signup');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md shadow-xs"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
