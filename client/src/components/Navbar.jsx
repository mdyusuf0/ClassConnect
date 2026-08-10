import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="navbar glass-panel sticky top-0 z-50 px-6 border-b border-white/10">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span>Class<span className="text-indigo-400">Connect</span></span>
        </Link>
      </div>
      <div className="flex-none gap-4">
        <div className="badge badge-accent gap-1 font-medium px-3 py-3">
          <Sparkles className="w-3.5 h-3.5" /> Phase 0 Active
        </div>
      </div>
    </div>
  );
}
