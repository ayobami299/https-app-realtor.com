import React, { useState } from 'react';
import { Heart, Calculator, Menu, X, Building2, User, Sparkles, LogOut, ChevronDown, Share2, ShieldCheck, Users, MessageSquare } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeNav: string;
  setActiveNav: (tab: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenCalculator: () => void;
  onOpenSocialModal: () => void;
  onOpenManageRentals: () => void;
  profile: UserProfile | null;
  onOpenUserAccount: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  setActiveNav,
  savedCount,
  onOpenSaved,
  onOpenCalculator,
  onOpenSocialModal,
  onOpenManageRentals,
  profile,
  onOpenUserAccount,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'Rent', label: 'Rent' },
    { id: 'Buy', label: 'Buy' },
    { id: 'Sell', label: 'Sell' },
    { id: 'Mortgage', label: 'Mortgage' },
    { id: 'Find an Agent', label: 'Find an Agent' },
    { id: 'My Home', label: 'My Home' },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 shrink-0 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand & Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <button
            onClick={() => setActiveNav('Rent')}
            id="brand-logo-btn"
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-xs group-hover:bg-red-700 transition">
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
        <div className="hidden sm:flex items-center gap-3 lg:gap-4 text-sm">
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

          <a
            href="https://www.facebook.com/share/199hpDXEHZ/"
            target="_blank"
            rel="noopener noreferrer"
            id="header-contact-btn"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 transition cursor-pointer"
            title="Contact Us on Facebook"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Contact</span>
          </a>

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

          {/* Social Profile Connected State */}
          {profile ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                id="user-profile-menu-btn"
                className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-7 h-7 rounded-full object-cover border border-red-500"
                />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-tight max-w-[100px] truncate">
                    {profile.handle}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 text-xs animate-in fade-in"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <img src={profile.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{profile.displayName}</p>
                        <p className="text-slate-500 text-[11px] font-medium truncate">{profile.handle} • {profile.primarySocial}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={onOpenUserAccount}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Social Profile & Tours</span>
                  </button>
                  <button
                    onClick={onOpenSaved}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-slate-500" />
                    <span>Saved Homes ({savedCount})</span>
                  </button>
                  <button
                    onClick={onOpenSocialModal}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 font-medium text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Link Another Social Account</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-red-50 text-red-600 font-medium flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect Profile</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenSocialModal}
              id="header-create-profile-btn"
              className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Link Social Profile</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {profile ? (
            <button
              onClick={onOpenUserAccount}
              className="w-8 h-8 rounded-full border border-red-500 overflow-hidden"
            >
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            </button>
          ) : (
            <button
              onClick={onOpenSocialModal}
              className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Share2 className="w-3 h-3" />
              <span>Link Profile</span>
            </button>
          )}

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
          {profile ? (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <img src={profile.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-red-500" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{profile.displayName}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{profile.handle} • {profile.primarySocial}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onOpenUserAccount();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 font-bold px-2 py-1 bg-white border border-slate-200 rounded-md"
              >
                Profile
              </button>
            </div>
          ) : null}

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

            <a
              href="https://www.facebook.com/share/199hpDXEHZ/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600"
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
              Contact Us on Facebook
            </a>

            {profile ? (
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md border border-red-200 text-center cursor-pointer"
              >
                Disconnect Profile ({profile.handle})
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenSocialModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs text-center flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Link Social Media Account</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
