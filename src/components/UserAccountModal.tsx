import React, { useState, useEffect } from 'react';
import { Property, UserInquiryRecord, UserProfile, SocialPlatform } from '../types';
import { logOutProfile, fetchUserInquiries, saveActiveProfile, getSavedProfilesList, switchProfile } from '../services/authService';
import {
  X,
  User,
  Heart,
  Calendar,
  LogOut,
  ExternalLink,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Share2,
  Edit3,
  Plus,
  Users,
  Building
} from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  savedProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onRemoveFavorite: (propertyId: number) => void;
  onLogout: () => void;
  onOpenCreateProfile: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  profile,
  savedProperties,
  onSelectProperty,
  onRemoveFavorite,
  onLogout,
  onOpenCreateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'inquiries' | 'profiles'>('overview');
  const [inquiries, setInquiries] = useState<UserInquiryRecord[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editBio, setEditBio] = useState('');
  const [savedProfiles, setSavedProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (isOpen && profile?.id) {
      setEditName(profile.displayName);
      setEditLocation(profile.location || '');
      setEditBio(profile.bio || '');
      setSavedProfiles(getSavedProfilesList());

      setLoadingInquiries(true);
      fetchUserInquiries(profile.id)
        .then((data) => setInquiries(data))
        .finally(() => setLoadingInquiries(false));
    }
  }, [isOpen, profile?.id]);

  if (!isOpen || !profile) return null;

  const handleSaveEdit = async () => {
    if (!profile) return;
    const updated: UserProfile = {
      ...profile,
      displayName: editName.trim() || profile.displayName,
      location: editLocation.trim() || profile.location,
      bio: editBio.trim() || profile.bio
    };
    await saveActiveProfile(updated);
    setIsEditing(false);
  };

  const handleSwitch = (profileId: string) => {
    switchProfile(profileId);
    setSavedProfiles(getSavedProfilesList());
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case 'instagram':
        return '📸 Instagram';
      case 'x':
        return '𝕏 Twitter/X';
      case 'linkedin':
        return '💼 LinkedIn';
      case 'tiktok':
        return '🎵 TikTok';
      case 'facebook':
        return '👥 Facebook';
      case 'github':
        return '💻 GitHub';
      case 'youtube':
        return '▶️ YouTube';
      default:
        return '🌐 Social';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        id="user-account-modal"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 my-4"
      >
        {/* Header with Connected Social Avatar */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer border border-slate-700"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-16 h-16 rounded-full border-2 border-red-500 object-cover shadow-md shrink-0"
              />

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-white">{profile.displayName}</h3>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Social Connected
                  </span>
                  <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {profile.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span className="font-semibold text-white">{profile.handle}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-red-400" />
                    {profile.location || 'United States'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="self-start sm:self-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Social Links Badges Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[11px] text-slate-400 font-semibold">Linked Socials:</span>
            {profile.socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url || '#'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-200 text-[11px] font-medium transition"
              >
                <span>{getPlatformIcon(link.platform)}</span>
                <span className="font-semibold">{link.handle}</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'border-red-600 text-red-600 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Social Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'favorites'
                ? 'border-red-600 text-red-600 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Saved Homes ({savedProperties.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'border-red-600 text-red-600 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tours & Inquiries ({inquiries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profiles')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
              activeTab === 'profiles'
                ? 'border-red-600 text-red-600 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch Accounts ({savedProfiles.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-sm space-y-4">
          {/* EDIT FORM MODE */}
          {isEditing && (
            <div className="p-4 bg-red-50/50 rounded-xl border border-red-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Edit Social Profile Info</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Bio / Search Notes</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Saved Properties</span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{savedProperties.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Tours & Contacts</span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{inquiries.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-500 font-medium">Connected Identity</span>
                  <p className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1 capitalize">
                    <CheckCircle2 className="w-4 h-4" /> {profile.primarySocial}
                  </p>
                </div>
              </div>

              {profile.bio && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">About Me</h4>
                  <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Social Account Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400">Profile ID:</span> {profile.id}
                  </div>
                  <div>
                    <span className="text-slate-400">Primary Network:</span> {profile.primarySocial.toUpperCase()}
                  </div>
                  <div>
                    <span className="text-slate-400">Contact Email:</span> {profile.email || 'None'}
                  </div>
                  <div>
                    <span className="text-slate-400">Cloud Sync:</span> Firestore Database Enabled
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              {savedProperties.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-800 text-sm">No saved listings yet</p>
                  <p className="text-xs text-slate-500">
                    Click the heart icon on any apartment listing to save it to your social account.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prop.image}
                          alt={prop.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 cursor-pointer"
                          onClick={() => {
                            onSelectProperty(prop);
                            onClose();
                          }}
                        />
                        <div className="min-w-0">
                          <h5
                            className="font-bold text-slate-900 text-xs truncate hover:text-red-600 cursor-pointer"
                            onClick={() => {
                              onSelectProperty(prop);
                              onClose();
                            }}
                          >
                            {prop.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 truncate">{prop.address}</p>
                          <p className="text-xs font-bold text-red-600 mt-0.5">{prop.price}/mo</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            onSelectProperty(prop);
                            onClose();
                          }}
                          className="text-xs font-medium text-slate-700 hover:text-red-600 px-2.5 py-1 bg-white border border-slate-200 rounded-md transition cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => onRemoveFavorite(prop.id)}
                          className="text-xs text-slate-400 hover:text-red-600 p-1.5 transition cursor-pointer"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div>
              {loadingInquiries ? (
                <div className="text-center py-10 text-xs text-slate-500">Loading your inquiries...</div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="font-bold text-slate-800 text-sm">No scheduled tours or inquiries yet</p>
                  <p className="text-xs text-slate-500">
                    When you contact a property or book a tour, your requests will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq, idx) => (
                    <div key={inq.id || idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] rounded uppercase">
                            {inq.inquiryType === 'tour' ? 'Scheduled Tour' : 'Property Inquiry'}
                          </span>
                          <h5 className="font-bold text-slate-900 text-sm mt-1">{inq.propertyName}</h5>
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {inq.tourDate && (
                        <div className="text-xs font-semibold text-slate-700 bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-red-600" />
                          <span>Tour Date: {inq.tourDate} at {inq.tourTime || 'Flexible'}</span>
                        </div>
                      )}

                      {inq.message && (
                        <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200 italic">
                          &quot;{inq.message}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profiles' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Your Connected Social Profiles</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreateProfile();
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Link Another Profile</span>
                </button>
              </div>

              {savedProfiles.map((p) => {
                const isCurrent = p.id === profile.id;
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                      isCurrent ? 'bg-red-50/50 border-red-500' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.avatarUrl} alt={p.displayName} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-bold text-slate-900 text-xs">{p.displayName}</h5>
                          {isCurrent && (
                            <span className="text-[10px] bg-red-600 text-white font-bold px-1.5 rounded">Active</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{p.handle} • {p.primarySocial}</p>
                      </div>
                    </div>

                    {!isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleSwitch(p.id)}
                        className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
                      >
                        Switch To
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              logOutProfile();
              onLogout();
              onClose();
            }}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Disconnect Profile</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2 rounded-lg text-xs transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
