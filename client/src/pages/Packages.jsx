import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import store from '../data/mockStore';
import { CheckCircle2, Zap, Sparkles } from 'lucide-react';
import { translations } from '../data/translations';

export default function Packages({ currentLang = 'EN' }) {
  const [packages, setPackages] = useState([]);
  const t = translations[currentLang]?.packagesPage || translations.EN.packagesPage;
  const tc = translations[currentLang]?.common || translations.EN.common;

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const storePkgs = store.getPackages();
        const data = await api.getPackagesApi().catch(() => null);
        setPackages(data && data.length >= 5 ? data : storePkgs);
      } catch (err) {
        console.warn('Failed to load packages:', err.message);
        setPackages(store.getPackages());
      }
    };
    fetchPackages();
  }, []);

  return (
    <div className="bg-[#F5F9FA] min-h-screen py-10 overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#001845] via-[#002B70] to-[#001845] text-white py-14 mb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3 border border-white/20">
            <Sparkles size={14} /> {t.tag}
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white">{t.title}</h1>
          <p className="text-gray-300 text-sm md:text-base mt-2 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Packages Grid Section with Background Ambient Glow */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-20 package-ambient-glow relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 items-stretch justify-center max-w-5xl mx-auto">
          {packages.map((pkg, idx) => (
            <div 
              key={pkg.id || pkg._id} 
              className="aceternity-package-card"
            >
              {/* Card Header */}
              <div className="mb-3">
                <span className="text-[11px] font-bold text-gray-400">#{'0' + (idx + 1)}</span>
                <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-1">{pkg.name}</h3>
                <p className="text-xs text-gray-500 font-medium">{pkg.selectedCourses?.length || 0} Masterclasses Included</p>
              </div>

              {/* Inner Inset Price & Action Box */}
              <div className="bg-gray-50/90 rounded-2xl p-3 border border-gray-200 mb-4 flex items-center justify-between gap-2 shadow-inner">
                <Link 
                  to={`/register?package=${pkg.id || pkg._id}`} 
                  className="px-3.5 py-2 rounded-full font-heading font-extrabold text-[10px] uppercase bg-primary-container text-white hover:bg-primary transition-all whitespace-nowrap"
                >
                  {tc.enrollNow}
                </Link>
                <div className="text-right flex-shrink-0">
                  {pkg.originalPrice && (
                    <span className="block text-[10px] text-gray-400 line-through decoration-red-500 leading-none mb-0.5">
                      ₹{pkg.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="font-heading font-extrabold text-base text-gray-900 leading-none">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Referral Earnings Badge */}
              <div className="bg-amber-50 rounded-lg p-2 mb-4 text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-600 flex-shrink-0" />
                <span>{tc.referralEarnings}: <strong>₹{pkg.commission}</strong></span>
              </div>

              {/* Features List */}
              <ul className="space-y-2 text-xs text-gray-600 mb-4 flex-grow border-t border-gray-100 pt-3">
                {pkg.features?.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Package Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-md">
          <h2 className="font-heading font-extrabold text-2xl text-gray-900 mb-6 text-center">{t.comparisonTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="p-3.5 font-semibold text-gray-700">Features</th>
                  {packages.map(p => (
                    <th key={p.id || p._id} className="p-3.5 font-bold text-primary-container">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3.5 font-medium text-gray-900">Included Masterclasses</td>
                  {packages.map(p => (
                    <td key={p.id || p._id} className="p-3.5 font-bold text-gray-700">{p.selectedCourses?.length || 0} Courses</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-gray-900">Discounted Bundle Price</td>
                  {packages.map(p => (
                    <td key={p.id || p._id} className="p-3.5 font-bold text-amber-600">₹{p.price.toLocaleString('en-IN')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-gray-900">Original Value</td>
                  {packages.map(p => (
                    <td key={p.id || p._id} className="p-3.5 text-gray-400 line-through decoration-red-500">₹{p.originalPrice?.toLocaleString('en-IN')}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3.5 font-medium text-gray-900">Direct Referral Earnings</td>
                  {packages.map(p => (
                    <td key={p.id || p._id} className="p-3.5 font-bold text-emerald-600">₹{p.commission}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
