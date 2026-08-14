import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, User, Globe, MapPin, Plus, ShieldCheck, ArrowRight, Share2, Layers } from 'lucide-react';
import { SocialPlatform, SocialLink, UserProfile } from '../types';
import { createSocialProfile, formatSocialUrl } from '../services/authService';

interface SocialProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: UserProfile) => void;
  initialRole?: 'renter' | 'buyer' | 'landlord' | 'agent';
}

const PLATFORMS: Array<{
  id: SocialPlatform;
  name: string;
  badgeColor: string;
  iconSvg: React.ReactNode;
  placeholder: string;
  avatarSeed: string;
}> = [
  {
    id: 'instagram',
    name: 'Instagram',
    badgeColor: 'from-purple-600 via-pink-600 to-amber-500 text-white',
    placeholder: '@your_instagram',
    avatarSeed: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    iconSvg: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    id: 'x',
    name: 'X / Twitter',
    badgeColor: 'bg-black text-white',
    placeholder: '@your_handle',
    avatarSeed: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    iconSvg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    badgeColor: 'bg-[#0A66C2] text-white',
    placeholder: 'in/yourname',
    avatarSeed: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    iconSvg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    badgeColor: 'bg-slate-900 text-white',
    placeholder: '@tiktok_user',
    avatarSeed: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    iconSvg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-4.52z"/>
      </svg>
    )
  },
  {
    id: 'facebook',
    name: 'Facebook',
    badgeColor: 'bg-[#1877F2] text-white',
    placeholder: 'fb.com/yourprofile',
    avatarSeed: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    iconSvg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    id: 'github',
    name: 'GitHub',
    badgeColor: 'bg-[#24292e] text-white',
    placeholder: 'github.com/username',
    avatarSeed: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    iconSvg: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    )
  }
];

const PRESETS = [
  {
    displayName: 'Sarah Miller',
    handle: '@sarah_realtor',
    platform: 'instagram' as SocialPlatform,
    role: 'renter' as const,
    location: 'Austin, TX',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
  },
  {
    displayName: 'Marcus Chen',
    handle: '@marcus_chen',
    platform: 'linkedin' as SocialPlatform,
    role: 'buyer' as const,
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  },
  {
    displayName: 'Elena Rostova',
    handle: '@elena_rentals',
    platform: 'x' as SocialPlatform,
    role: 'landlord' as const,
    location: 'Miami, FL',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80'
  }
];

export const SocialProfileModal: React.FC<SocialProfileModalProps> = ({
  isOpen,
  onClose,
  onProfileCreated,
  initialRole = 'renter'
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'renter' | 'buyer' | 'landlord' | 'agent'>(initialRole);
  const [location, setLocation] = useState('New York, NY');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [secondaryPlatform, setSecondaryPlatform] = useState<SocialPlatform | ''>('');
  const [secondaryHandle, setSecondaryHandle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentPlatformConfig = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0];
  const effectiveAvatar = avatarUrl || currentPlatformConfig.avatarSeed;
  const effectiveHandle = handle.trim() ? (handle.startsWith('@') ? handle : `@${handle.trim()}`) : '@your_handle';
  const effectiveName = displayName.trim() || (handle ? handle.replace('@', '') : 'Social Home Hunter');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setSubmitting(true);
    try {
      const additionalSocials: SocialLink[] = [];
      if (secondaryPlatform && secondaryHandle.trim()) {
        const secHandleFormatted = secondaryHandle.startsWith('@') ? secondaryHandle : `@${secondaryHandle.trim()}`;
        additionalSocials.push({
          platform: secondaryPlatform,
          handle: secHandleFormatted,
          url: formatSocialUrl(secondaryPlatform, secHandleFormatted),
          verified: true
        });
      }

      const profile = await createSocialProfile({
        displayName: displayName.trim() || handle.replace('@', ''),
        handle: handle.trim(),
        primarySocial: selectedPlatform,
        role,
        location,
        bio: bio.trim() || `Verified ${role} linked with ${currentPlatformConfig.name}`,
        email: email.trim() || undefined,
        avatarUrl: effectiveAvatar,
        additionalSocials
      });

      onProfileCreated(profile);
      onClose();
    } catch (err) {
      console.error('Failed to create social profile:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setSelectedPlatform(preset.platform);
    setHandle(preset.handle);
    setDisplayName(preset.displayName);
    setRole(preset.role);
    setLocation(preset.location);
    setAvatarUrl(preset.avatar);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        id="social-profile-modal"
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-4"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer border border-slate-700"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-red-400" /> No Password Required
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Instant Social Profile
            </span>
          </div>

          <h3 className="text-xl font-bold text-white">Create Your Social Account</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-md">
            Link your social media profile to instantly save listings, book apartment tours, and contact landlords across RentHub.
          </p>
        </div>

        {/* Quick Demo Presets Bar */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-semibold shrink-0 text-[11px]">Quick 1-Click Connect:</span>
          <div className="flex items-center gap-1.5">
            {PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-full text-slate-700 font-medium transition cursor-pointer shrink-0 shadow-2xs hover:border-slate-300"
              >
                <img src={preset.avatar} alt={preset.displayName} className="w-3.5 h-3.5 rounded-full object-cover" />
                <span>{preset.displayName.split(' ')[0]} ({preset.platform})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          {/* Step 1: Select Primary Social Network */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              1. Choose Primary Social Media Network
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PLATFORMS.map((platform) => {
                const isSelected = selectedPlatform === platform.id;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      if (!avatarUrl) setAvatarUrl(platform.avatarSeed);
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer relative ${
                      isSelected
                        ? 'border-red-600 bg-red-50/50 shadow-xs ring-2 ring-red-500/20 text-slate-900 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-slate-800">
                      {platform.iconSvg}
                    </div>
                    <span className="text-[11px] leading-none text-center truncate w-full">{platform.name}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-600 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Handle & Name Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your {currentPlatformConfig.name} Handle <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">@</span>
                <input
                  type="text"
                  required
                  placeholder="e.g. sarah_miller"
                  value={handle.replace(/^@/, '')}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-sm font-medium text-slate-900 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Sarah Miller"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm font-medium text-slate-900 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Role and Preferred Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">I am using RentHub as</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 bg-white outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 cursor-pointer"
              >
                <option value="renter">Renter (Looking to rent)</option>
                <option value="buyer">Home Buyer</option>
                <option value="landlord">Landlord / Property Owner</option>
                <option value="agent">Real Estate Agent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Austin, TX or New York, NY"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm font-medium text-slate-900 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Profile Card Preview
            </span>
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
              <img
                src={effectiveAvatar}
                alt="Profile Preview"
                className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{effectiveName}</h4>
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                    {role}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="font-medium text-slate-700">{effectiveHandle}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedPlatform}</span>
                  <span>•</span>
                  <span>{location}</span>
                </div>
              </div>
              <div className="shrink-0 text-red-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Optional: Add Secondary Social Link */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Link Second Social Network (Optional)</label>
              <span className="text-[11px] text-slate-400">Boosts profile credibility</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={secondaryPlatform}
                onChange={(e) => setSecondaryPlatform(e.target.value as any)}
                className="border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-900 bg-white outline-hidden"
              >
                <option value="">None</option>
                {PLATFORMS.filter((p) => p.id !== selectedPlatform).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                disabled={!secondaryPlatform}
                placeholder={secondaryPlatform ? `@handle for ${secondaryPlatform}` : 'Select a network first'}
                value={secondaryHandle}
                onChange={(e) => setSecondaryHandle(e.target.value)}
                className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-900 outline-hidden disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !handle.trim()}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 rounded-xl transition text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>Connect & Create Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
