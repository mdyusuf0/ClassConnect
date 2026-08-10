import { Link } from 'react-router-dom';
import { translations } from '../data/translations';

export default function Footer({ currentLang = 'EN' }) {
  const currentYear = new Date().getFullYear();
  const t = translations[currentLang]?.footer || translations.EN.footer;
  const tn = translations[currentLang]?.nav || translations.EN.nav;

  return (
    <footer className="bg-gray-900 text-gray-300 mb-16 lg:mb-0">
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="font-heading font-extrabold text-2xl inline-flex mb-4">
                <span className="text-white">Class</span>
                <span className="text-amber-500">Connect</span>
              </Link>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-md">
                {t.desc}
              </p>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold text-white text-base mb-5">{t.quickLinks}</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">{tn.home}</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">{tn.about}</Link></li>
                <li><Link to="/courses" className="hover:text-white transition-colors">{tn.courses}</Link></li>
                <li><Link to="/packages" className="hover:text-white transition-colors">{tn.packages}</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">{tn.contact}</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-heading font-semibold text-white text-base mb-5">{t.legal}</h4>
              <ul className="flex flex-col gap-2.5 text-sm text-gray-400">
                <li><Link to="/contact" className="hover:text-white transition-colors">FAQ's</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Cancellation & Refund</Link></li>
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="font-heading font-semibold text-white text-base mb-5">{t.contacts}</h4>
              <ul className="flex flex-col gap-2 text-sm text-gray-400">
                <li>
                  <span className="text-gray-500 mr-2">WhatsApp:</span>
                  <a href="https://wa.me/+918885490091" target="_blank" rel="noopener noreferrer" className="hover:text-white">+91 8885490091</a>
                </li>
                <li>
                  <a href="https://wa.me/+919014887314" target="_blank" rel="noopener noreferrer" className="hover:text-white block">+91 9014887314</a>
                </li>
                <li className="mt-2">
                  <span className="text-gray-500 mr-2">Email:</span>
                  <a href="mailto:info@classconnect.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">info@classconnect.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© Copyright {currentYear} {t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
