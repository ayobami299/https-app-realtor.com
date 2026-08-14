import React, { useState } from 'react';
import { X, Calculator, DollarSign, PieChart, CheckCircle2 } from 'lucide-react';

interface RentCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyMaxPrice: (price: string) => void;
}

export const RentCalculatorModal: React.FC<RentCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyMaxPrice
}) => {
  const [incomeType, setIncomeType] = useState<'annual' | 'monthly'>('annual');
  const [grossIncome, setGrossIncome] = useState<number>(75000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(400);

  if (!isOpen) return null;

  const monthlyGross = incomeType === 'annual' ? grossIncome / 12 : grossIncome;
  // 30% rule
  const maxRent30 = Math.round(monthlyGross * 0.3);
  // Conservative 25% rule
  const safeRent25 = Math.round(monthlyGross * 0.25);
  // Stretch 33% rule
  const stretchRent33 = Math.round(monthlyGross * 0.33);

  // Upfront moving cost breakdown based on maxRent30
  const securityDeposit = maxRent30;
  const firstMonth = maxRent30;
  const applicationFees = 100;
  const moversAndSetup = 450;
  const totalUpfront = securityDeposit + firstMonth + applicationFees + moversAndSetup;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div
        id="rent-calculator-modal"
        className="bg-white rounded-xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative border-b border-slate-800">
          <button
            onClick={onClose}
            id="close-calculator-modal-btn"
            className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-md flex items-center justify-center transition cursor-pointer border border-slate-700"
            aria-label="Close calculator"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>Financial Planning Tool</span>
          </div>
          <h3 className="text-xl font-bold text-white">Rent Affordability Calculator</h3>
          <p className="text-xs text-slate-400 mt-1">
            Calculate your recommended rent limit based on the standard 30% gross income guideline
          </p>
        </div>

        {/* Form Inputs & Result Output */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-sm">
          {/* Income toggle & inputs */}
          <div className="space-y-3.5">
            <div className="flex bg-slate-100 p-1 rounded-md text-xs font-semibold border border-slate-200">
              <button
                type="button"
                onClick={() => setIncomeType('annual')}
                className={`flex-1 py-1.5 rounded transition cursor-pointer ${
                  incomeType === 'annual' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annual Salary ($/year)
              </button>
              <button
                type="button"
                onClick={() => setIncomeType('monthly')}
                className={`flex-1 py-1.5 rounded transition cursor-pointer ${
                  incomeType === 'monthly' ? 'bg-white text-red-600 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Gross ($/month)
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {incomeType === 'annual' ? 'Gross Annual Income (Before Taxes)' : 'Gross Monthly Income'}
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={grossIncome || ''}
                  onChange={(e) => setGrossIncome(Number(e.target.value))}
                  placeholder="e.g. 75000"
                  className="w-full border border-slate-300 rounded-md pl-9 pr-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Debt Payments (Student Loans, Car, Credit Cards)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  value={monthlyDebts || ''}
                  onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                  placeholder="e.g. 400"
                  className="w-full border border-slate-300 rounded-md pl-9 pr-3 py-2 outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-red-50/70 border border-red-100 rounded-lg p-4 space-y-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">Recommended Maximum Rent</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-red-600">${maxRent30.toLocaleString()}</span>
                <span className="text-sm font-semibold text-slate-600">/ month</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Based on 30% of your gross monthly income (${Math.round(monthlyGross).toLocaleString()}/mo).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-red-200/60 text-xs">
              <div className="bg-white p-3 rounded-md border border-red-100">
                <span className="text-slate-500 font-medium">Conservative (25%)</span>
                <p className="font-bold text-base text-slate-900">${safeRent25.toLocaleString()}/mo</p>
              </div>
              <div className="bg-white p-3 rounded-md border border-red-100">
                <span className="text-slate-500 font-medium">Max Upper Cap (33%)</span>
                <p className="font-bold text-base text-slate-900">${stretchRent33.toLocaleString()}/mo</p>
              </div>
            </div>
          </div>

          {/* Estimated Move-in Cash Required */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-600" />
              Estimated Move-In Cash Needed: ${totalUpfront.toLocaleString()}
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-slate-600 pt-0.5">
              <div>• First Month Rent: ${firstMonth.toLocaleString()}</div>
              <div>• Security Deposit: ${securityDeposit.toLocaleString()}</div>
              <div>• Application & Admin: ${applicationFees}</div>
              <div>• Movers & Setup: ${moversAndSetup}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-200/60 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApplyMaxPrice(maxRent30.toString());
              onClose();
            }}
            id="apply-max-rent-filter-btn"
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-4 py-2 rounded-md transition text-xs sm:text-sm cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply ${maxRent30.toLocaleString()} as Max Price</span>
          </button>
        </div>
      </div>
    </div>
  );
};
