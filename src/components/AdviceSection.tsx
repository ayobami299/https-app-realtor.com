import React, { useState } from 'react';
import { AdviceArticle } from '../types';
import { BookOpen, Clock, ArrowRight, X, User, BookmarkCheck } from 'lucide-react';

interface AdviceSectionProps {
  articles: AdviceArticle[];
}

export const AdviceSection: React.FC<AdviceSectionProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<AdviceArticle | null>(null);

  return (
    <section className="bg-white border-t border-slate-200 py-12 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Renter Resource Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Renter advice & guides
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Expert advice on budgeting, security deposits, lease agreements, and stress-free moving
            </p>
          </div>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              id={`advice-card-${article.id}`}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer flex flex-col bg-white hover:bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition duration-200"
            >
              <div className="bg-slate-100 rounded-lg h-44 mb-4 overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                  {article.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-xs border border-slate-100">
                  <Clock className="w-3 h-3 text-red-600" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-red-600 transition leading-snug line-clamp-2">
                {article.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed flex-1">
                {article.summary}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-red-600">
                <span className="text-slate-400 font-normal">By {article.author}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header image */}
            <div className="relative h-60 bg-slate-900">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover opacity-90"
              />
              <button
                onClick={() => setSelectedArticle(null)}
                id="close-article-btn"
                className="absolute top-4 right-4 bg-slate-900/70 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-xs transition cursor-pointer"
                aria-label="Close article"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                  {selectedArticle.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold mt-2 leading-tight">
                  {selectedArticle.title}
                </h3>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed flex-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Written by <strong className="text-slate-900">{selectedArticle.author}</strong></span>
                </div>
                <span>Published on {selectedArticle.date}</span>
              </div>

              {selectedArticle.content.map((paragraph, idx) => (
                <p key={idx} className="text-sm leading-relaxed text-slate-700">
                  {paragraph}
                </p>
              ))}

              <div className="bg-red-50 p-4 rounded-lg border border-red-100 mt-6">
                <h4 className="font-bold text-red-900 text-sm mb-1">Key Takeaway</h4>
                <p className="text-xs text-red-800">
                  Always inspect lease clauses regarding auto-renewal periods, utility billing, and maintenance turnaround guarantees before submitting your deposit.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <BookmarkCheck className="w-4 h-4 text-emerald-600" /> RentHub Renter Series
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-md transition cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
