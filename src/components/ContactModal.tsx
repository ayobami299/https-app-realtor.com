import React, { useState, useEffect } from 'react';
import { Property, InquiryFormData, UserProfile } from '../types';
import { X, Calendar, Send, CheckCircle2, Phone, Mail, Clock, ShieldCheck, UserCheck } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onSubmitInquiry: (data: InquiryFormData, property: Property) => void;
  initialType?: 'general' | 'tour' | 'pricing' | 'application';
  profile?: UserProfile | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  property,
  onSubmitInquiry,
  initialType = 'general',
  profile
}) => {
  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    email: '',
    phone: '',
    moveInDate: '',
    message: 'I am interested in this property and would like more information on lease terms and current specials.',
    inquiryType: initialType,
    tourDate: '',
    tourTime: '11:00 AM',
    preferredBeds: '1'
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialType) {
      setFormData((prev) => ({
        ...prev,
        inquiryType: initialType,
        fullName: profile?.displayName || prev.fullName,
        email: profile?.email || prev.email,
        phone: profile?.phone || prev.phone
      }));
    }
    setSubmitted(false);
  }, [initialType, property, isOpen, profile]);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitInquiry(formData, property);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        id="contactModal"
        className="bg-white rounded-xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Property Summary */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            id="close-contact-modal-btn"
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-md flex items-center justify-center transition cursor-pointer border border-slate-700"
            aria-label="Close contact modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <img
              src={property.image}
              alt={property.name}
              className="w-14 h-14 rounded-lg object-cover border border-slate-700 shadow-xs shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {property.managed}
              </span>
              <h3 className="text-xl font-bold text-white mt-1 leading-tight">{property.name}</h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">{property.address}</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Inquiry Sent Successfully!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              The leasing office at <span className="font-semibold text-slate-900">{property.name}</span> will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
            {profile && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2">
                  <img src={profile.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover border border-emerald-400" />
                  <span className="font-semibold">Submitting with verified profile: <strong>{profile.handle}</strong> ({profile.primarySocial})</span>
                </div>
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
            )}

            {/* Inquiry Type Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-md text-xs font-semibold border border-slate-200">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, inquiryType: 'general' })}
                className={`flex-1 py-1.5 rounded transition cursor-pointer ${
                  formData.inquiryType === 'general' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inquire Info
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, inquiryType: 'tour' })}
                className={`flex-1 py-1.5 rounded transition cursor-pointer flex items-center justify-center gap-1 ${
                  formData.inquiryType === 'tour' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Tour Unit</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, inquiryType: 'application' })}
                className={`flex-1 py-1.5 rounded transition cursor-pointer ${
                  formData.inquiryType === 'application' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Apply Online
              </button>
            </div>

            {/* Tour scheduling fields if tour selected */}
            {formData.inquiryType === 'tour' && (
              <div className="bg-red-50/60 border border-red-200 p-3.5 rounded-lg space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-800">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Choose Tour Appointment Date & Time</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    required
                    value={formData.tourDate}
                    onChange={(e) => setFormData({ ...formData, tourDate: e.target.value })}
                    className="border border-slate-300 bg-white rounded-md px-3 py-1.5 text-xs font-medium outline-hidden"
                  />
                  <select
                    value={formData.tourTime}
                    onChange={(e) => setFormData({ ...formData, tourTime: e.target.value })}
                    className="border border-slate-300 bg-white rounded-md px-3 py-1.5 text-xs font-medium outline-hidden"
                  >
                    <option value="9:30 AM">9:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="1:30 PM">1:30 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contact inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Mitchell"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-slate-300 rounded-md pl-9 pr-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-slate-300 rounded-md pl-9 pr-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Move-in</label>
                  <input
                    type="date"
                    value={formData.moveInDate}
                    onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs font-medium outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bedroom Size</label>
                  <select
                    value={formData.preferredBeds}
                    onChange={(e) => setFormData({ ...formData, preferredBeds: e.target.value })}
                    className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs font-medium outline-hidden"
                  >
                    <option value="studio">Studio</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3+ Bedrooms</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={2}
                  placeholder="I am interested in this property..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="submit-contact-btn"
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-2.5 rounded-md transition shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to Property</span>
              </button>
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Your information is encrypted and securely sent to verified leasing staff.</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
