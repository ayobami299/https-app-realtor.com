import React, { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { Property, UserInquiryRecord } from '../types';
import { logOut, fetchUserInquiries } from '../services/authService';
import { X, User, Heart, Mail, Calendar, LogOut, ExternalLink, Clock, ShieldCheck, CheckCircle2, Phone } from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: FirebaseUser | null;
  savedProperties: Property[];
  onSelectProperty: (property: Property) => void;
  onRemoveFavorite: (propertyId: number) => void;
  onLogout: () => void;
  onOpenSavedDrawer: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  user,
  savedProperties,
  onSelectProperty,
  onRemoveFavorite,
  onLogout,
  onOpenSavedDrawer
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'inquiries'>('overview');
  const [inquiries, setInquiries] = useState<UserInquiryRecord[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  useEffect(() => {
    if (isOpen && user?.uid) {
      setLoadingInquiries(true);
      fetchUserInquiries(user.uid)
        .then((data) => setInquiries(data))
        .finally(() => setLoadingInquiries(false));
    }
  }, [isOpen, user?.uid]);

  if (!isOpen || !user) return null;

  const displayName = user.displayName || user.email?.split('@')[0] || 'Member';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        id="user-account-modal"
        className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Account Avatar */}
        <div className="bg-slate-900 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-md flex items-center justify-center transition cursor-pointer border border-slate-700"
            aria-label="Close account modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-14 h-14 rounded-full border-2 border-red-500 object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-red-600 border-2 border-white/20 text-white font-bold text-xl flex items-center justify-center shadow-inner">
                {initial}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{displayName}</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Member
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer ${
              activeTab === 'overview'
                ? 'border-red-600 text-red-600 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Account Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
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
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'inquiries'
                ? 'border-red-600 text-red-600 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Tours & Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-sm space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Saved Properties</span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{savedProperties.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">Tours & Contacts</span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{inquiries.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-500 font-medium">Account Status</span>
                  <p className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Active
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Account Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400">User ID:</span> {user.uid.slice(0, 12)}...
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span> {user.email}
                  </div>
                  <div>
                    <span className="text-slate-400">Sign-in Provider:</span> {user.providerData[0]?.providerId || 'email/password'}
                  </div>
                  <div>
                    <span className="text-slate-400">Database Sync:</span> Firestore Cloud Enabled
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
                    Click the heart icon on any apartment listing to save it to your account.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-3 hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={prop.image}
                          alt={prop.name}
                          className="w-14 h-14 rounded-md object-cover shrink-0 cursor-pointer"
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
                    <div key={inq.id || idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
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
                        <div className="text-xs font-semibold text-slate-700 bg-white p-2 rounded border border-slate-200 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-red-600" />
                          <span>Tour Date: {inq.tourDate} at {inq.tourTime || 'Flexible'}</span>
                        </div>
                      )}

                      {inq.message && (
                        <p className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200 italic">
                          &quot;{inq.message}&quot;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Sign Out */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={async () => {
              await logOut();
              onLogout();
              onClose();
            }}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-md transition cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-md text-xs transition cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
