import React, { useState, useEffect } from 'react';
import { Property, UserProfile } from '../types';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Calendar,
  ExternalLink,
  DollarSign,
  FileCheck,
  Building,
  User,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  Smartphone,
  Check
} from 'lucide-react';

interface ApplicationFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  profile?: UserProfile | null;
  onSuccess?: (paymentDetails: { txnId: string; property: Property; applicantName: string }) => void;
}

export const ApplicationFeeModal: React.FC<ApplicationFeeModalProps> = ({
  isOpen,
  onClose,
  property,
  profile,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_google' | 'zelle_cashapp'>('card');
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [countdown, setCountdown] = useState(5);

  const FACEBOOK_LINK = 'https://www.facebook.com/share/199hpDXEHZ/';

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsPaid(false);
      setCountdown(5);
      if (profile) {
        setApplicantName(profile.displayName || '');
        setApplicantEmail(profile.email || '');
        setApplicantPhone(profile.phone || '');
      } else {
        setApplicantName('');
        setApplicantEmail('');
        setApplicantPhone('');
      }
      setCardNumber('•••• •••• •••• 4242');
      setCardExp('12/28');
      setCardCvc('884');
      setCardZip('37873');
      const now = new Date();
      now.setDate(now.getDate() + 7);
      setMoveInDate(now.toISOString().split('T')[0]);
    }
  }, [isOpen, profile, property]);

  // Countdown timer once payment is successful
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPaid && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isPaid, countdown]);

  if (!isOpen || !property) return null;

  const handlePayFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) return;

    setIsProcessing(true);
    const txn = 'RH75-' + Math.floor(100000 + Math.random() * 900000);
    setTransactionId(txn);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      if (onSuccess) {
        onSuccess({
          txnId: txn,
          property,
          applicantName: applicantName || 'Verified Applicant'
        });
      }
    }, 1200);
  };

  const handleRedirectToFacebook = () => {
    window.open(FACEBOOK_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div
        id="application-fee-modal"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200 my-auto"
      >
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-5 relative border-b border-slate-800">
          <button
            onClick={onClose}
            id="close-app-fee-modal-btn"
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer border border-slate-700"
            aria-label="Close application fee modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/90 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60">
                Official Application Step
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5 leading-tight">
                $75 Rental Application Fee
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        {isPaid ? (
          /* Payment Success & Facebook Forwarding Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Payment Authorized • Receipt #{transactionId}
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                $75 Application Fee Paid!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your application for <span className="font-semibold text-slate-900">{property.name}</span> has been confirmed and reserved.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left space-y-2">
              <div className="flex justify-between items-center text-slate-600">
                <span>Property:</span>
                <span className="font-semibold text-slate-900 truncate max-w-[200px]">{property.name}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Monthly Rent:</span>
                <span className="font-semibold text-slate-900">{property.price}/mo</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Applicant:</span>
                <span className="font-semibold text-slate-900">{applicantName || 'Applicant'}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-800">Total Application Fee:</span>
                <span className="font-black text-emerald-600 text-sm">$75.00 USD</span>
              </div>
            </div>

            {/* Facebook Action Callout */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 space-y-2 text-left">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Next Step: Direct Landlord Facebook Chat</span>
              </div>
              <p className="text-blue-800 text-[11px] leading-relaxed">
                Connect directly with the listing manager on Facebook to provide your receipt ID and schedule your move-in date or live tour.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleRedirectToFacebook}
                id="modal-continue-facebook-btn"
                className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 px-4 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Continue to Facebook Page</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-slate-500 hover:text-slate-800 text-xs font-semibold py-2 transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form Screen */
          <form onSubmit={handlePayFee} className="p-5 sm:p-6 space-y-4 text-sm">
            {/* Property preview snippet */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <img
                src={property.image}
                alt={property.name}
                className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                    {property.propertyType}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{property.price}/mo</span>
                </div>
                <h4 className="font-bold text-slate-900 text-xs truncate mt-0.5">{property.name}</h4>
                <p className="text-[11px] text-slate-500 truncate">{property.address}</p>
              </div>
            </div>

            {/* Fee Itemization Badge */}
            <div className="bg-red-50/70 border border-red-200 rounded-xl p-3.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-red-950 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-red-600" />
                  Application & Tenant Background Check
                </span>
                <p className="text-[11px] text-red-800/80">
                  Includes credit check, document review & hold reservation
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xl font-black text-red-600">$75.00</span>
                <span className="block text-[10px] text-slate-500 font-semibold">One-time fee</span>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Applicant Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="jane@example.com"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={applicantPhone}
                      onChange={(e) => setApplicantPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Move-in</label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-red-600 bg-red-50/50 text-red-700 ring-1 ring-red-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_google')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'apple_google'
                      ? 'border-red-600 bg-red-50/50 text-red-700 ring-1 ring-red-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Apple / Google Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('zelle_cashapp')}
                  className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition cursor-pointer ${
                    paymentMethod === 'zelle_cashapp'
                      ? 'border-red-600 bg-red-50/50 text-red-700 ring-1 ring-red-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Zelle / Cash App</span>
                </button>
              </div>
            </div>

            {/* Payment Fields according to choice */}
            {paymentMethod === 'card' ? (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                  <div className="relative">
                    <CreditCard className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="4242 •••• •••• 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Exp Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 text-center focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      required
                      placeholder="CVC"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 text-center focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Zip Code</label>
                    <input
                      type="text"
                      required
                      placeholder="37873"
                      value={cardZip}
                      onChange={(e) => setCardZip(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 text-center focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            ) : paymentMethod === 'apple_google' ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1.5">
                <Sparkles className="w-5 h-5 text-indigo-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">Fast Express Wallet Checkout</p>
                <p className="text-[11px] text-slate-500">
                  Your default wallet payment method will authorize the $75.00 application charge securely with biometric confirmation.
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-1.5">
                <Smartphone className="w-5 h-5 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-800">Mobile Transfer / Instant Hold</p>
                <p className="text-[11px] text-slate-500">
                  Authorize your $75 reservation fee via Zelle or Cash App. A direct payment verification link will be shared during your Facebook chat.
                </p>
              </div>
            )}

            {/* Terms checkbox */}
            <label className="flex items-start gap-2 cursor-pointer pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded text-red-600 focus:ring-red-500 border-slate-300"
              />
              <span className="text-[11px] leading-tight">
                I understand this $75 application fee authorizes tenant background screening and guarantees immediate referral to the property manager's Facebook page for lease finalization.
              </span>
            </label>

            {/* Submit Button */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isProcessing || !agreedTerms}
                id="pay-application-fee-btn"
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing $75 Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay $75.00 Application Fee & Connect</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  256-Bit SSL Encrypted
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  100% Refundable Guarantee
                </span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
