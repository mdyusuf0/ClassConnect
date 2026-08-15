import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ExternalLink, Megaphone, ArrowRight } from 'lucide-react';

export default function BrandBanner({ banners = [], position, siteSettings = {} }) {
  const [dismissed, setDismissed] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);

  useEffect(() => {
    if (position === 'popup_modal') {
      const wasDismissed = sessionStorage.getItem('cc_popup_ad_dismissed');
      if (wasDismissed === 'true') setPopupDismissed(true);
    }
  }, [position]);

  // Filter active banners for this position, sorted by priority
  const activeBanners = banners
    .filter(b => b.isActive && b.position === position)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  if (activeBanners.length === 0) return null;
  const banner = activeBanners[0];

  const isExternal = (url) => url && (url.startsWith('http://') || url.startsWith('https://'));

  const CtaButton = ({ className, children }) => {
    if (isExternal(banner.redirectUrl)) {
      return (
        <a
          href={banner.redirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      );
    }
    return (
      <Link to={banner.redirectUrl || '/courses'} className={className}>
        {children}
      </Link>
    );
  };

  // ---- TOP BAR ANNOUNCEMENT STRIP ----
  if (position === 'top_bar') {
    if (!siteSettings.enableTopBarAd || dismissed) return null;
    return (
      <div className="w-full bg-gradient-to-r from-[#001845] via-[#002B70] to-[#001845] text-white py-2.5 px-4 relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <Megaphone size={14} className="text-amber-400 flex-shrink-0" />
          <span className="text-xs font-bold truncate">{banner.title}</span>
          {banner.redirectUrl && (
            <CtaButton className="text-amber-400 hover:text-amber-300 font-extrabold text-xs uppercase underline underline-offset-2 flex items-center gap-1 flex-shrink-0">
              {banner.ctaText || 'Learn More'} <ExternalLink size={11} />
            </CtaButton>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-1 cursor-pointer"
            aria-label="Close banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // ---- POPUP MODAL AD ----
  if (position === 'popup_modal') {
    if (!siteSettings.enablePopupAd || popupDismissed) return null;

    const handleClosePopup = () => {
      sessionStorage.setItem('cc_popup_ad_dismissed', 'true');
      setPopupDismissed(true);
    };

    return (
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 relative">
          <button
            onClick={handleClosePopup}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close ad"
          >
            <X size={16} />
          </button>

          {banner.imageUrl && (
            <img src={banner.imageUrl} alt={banner.title} className="w-full h-48 object-cover" />
          )}

          <div className="p-6 space-y-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase tracking-widest border border-amber-200">
              <Megaphone size={10} /> SPONSORED
            </span>
            <h3 className="font-heading font-extrabold text-xl text-gray-900">{banner.title}</h3>
            {banner.description && (
              <p className="text-gray-600 text-sm leading-relaxed">{banner.description}</p>
            )}
            {banner.redirectUrl && (
              <CtaButton className="w-full py-3 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl text-center inline-flex items-center justify-center gap-2 shadow-md transition-all">
                {banner.ctaText || 'Check It Out'} <ArrowRight size={14} />
              </CtaButton>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---- BETWEEN SECTIONS WIDE BANNER ----
  if (position === 'between_sections') {
    if (!siteSettings.enableBetweenSectionAd) return null;
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-[#001845] to-[#002B70] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-white shadow-xl overflow-hidden relative">
          <div className="flex-1 space-y-3 z-10">
            <span className="inline-block bg-amber-500 text-gray-950 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              SPONSORED
            </span>
            <h3 className="font-heading font-extrabold text-2xl leading-tight">{banner.title}</h3>
            {banner.description && (
              <p className="text-slate-200 text-sm leading-relaxed max-w-lg">{banner.description}</p>
            )}
            {banner.redirectUrl && (
              <CtaButton className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-heading font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl inline-flex items-center gap-2 shadow-md transition-all">
                {banner.ctaText || 'Learn More'} <ArrowRight size={14} />
              </CtaButton>
            )}
          </div>
          {banner.imageUrl && (
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="rounded-2xl w-full md:w-64 h-48 object-cover flex-shrink-0 shadow-lg"
            />
          )}
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-amber-500/10" />
        </div>
      </div>
    );
  }

  return null;
}
