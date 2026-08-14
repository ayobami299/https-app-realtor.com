import React, { useState } from 'react';
import { Home, Mail, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

interface FooterProps {
  onOpenCalculator: () => void;
  onSelectCity: (city: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCalculator, onSelectCity }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmailInput('');
    }, 4000);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Newsletter Strip */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-white font-bold text-lg">Get rental price drops & new unit alerts</h4>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Subscribe to weekly verified apartment listings and exclusive move-in concessions.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            {subscribed ? (
              <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 px-4 py-2 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you! You are subscribed to price drop alerts.</span>
              </div>
            ) : (
              <div className="flex gap-2 w-full max-w-md">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md pl-10 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-hidden focus:border-red-500 font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-4 py-2 rounded-md text-xs sm:text-sm transition shrink-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        {/* Brand Col */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-2xl font-black text-white mb-3">
            <div className="w-7 h-7 bg-red-600 rounded-md flex items-center justify-center text-white">
              <Home className="w-4 h-4" />
            </div>
            <span>RentHub</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Find your next apartment with total confidence. Verified listings, transparent fees, and direct leasing office connections.
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Equal Housing Opportunity</span>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h5 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">Explore</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#listingsGrid" className="hover:text-white transition">Apartments for Rent</a></li>
            <li><a href="#listingsGrid" className="hover:text-white transition">Houses for Rent</a></li>
            <li><a href="#listingsGrid" className="hover:text-white transition">Condos & Townhomes</a></li>
            <li><a href="#listingsGrid" className="hover:text-white transition">Pet-Friendly Rentals</a></li>
            <li><a href="#listingsGrid" className="hover:text-white transition">Move-In Specials</a></li>
          </ul>
        </div>

        {/* Popular Cities */}
        <div>
          <h5 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">Popular Metro</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><button onClick={() => onSelectCity('Austin')} className="hover:text-white transition cursor-pointer">Austin, TX</button></li>
            <li><button onClick={() => onSelectCity('Atlanta')} className="hover:text-white transition cursor-pointer">Atlanta, GA</button></li>
            <li><button onClick={() => onSelectCity('Dallas')} className="hover:text-white transition cursor-pointer">Dallas, TX</button></li>
            <li><button onClick={() => onSelectCity('Orlando')} className="hover:text-white transition cursor-pointer">Orlando, FL</button></li>
            <li><button onClick={() => onSelectCity('Ann Arbor')} className="hover:text-white transition cursor-pointer">Ann Arbor, MI</button></li>
          </ul>
        </div>

        {/* Tools & Resources */}
        <div>
          <h5 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">Renter Tools</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><button onClick={onOpenCalculator} className="hover:text-white transition cursor-pointer">Rent Calculator</button></li>
            <li><a href="#adviceSection" className="hover:text-white transition">First-Time Renter Tips</a></li>
            <li><a href="#adviceSection" className="hover:text-white transition">Moving Day Checklist</a></li>
            <li><a href="#adviceSection" className="hover:text-white transition">Budgeting Hacks</a></li>
            <li><a href="#heroSearchInput" className="hover:text-white transition">Rental Search Map</a></li>
          </ul>
        </div>

        {/* Legal & Company */}
        <div>
          <h5 className="text-white font-bold text-xs mb-3 uppercase tracking-wider">Company</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="https://www.facebook.com/share/199hpDXEHZ/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-1"><span>Contact Us</span></a></li>
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Careers</a></li>
            <li><a href="#" className="hover:text-white transition">Advertise with RentHub</a></li>
            <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-slate-800 text-center py-5 text-xs text-slate-500">
        © 2026 RentHub Inc. All rights reserved. Demo replication for educational & commercial rental search interface.
      </div>
    </footer>
  );
};
