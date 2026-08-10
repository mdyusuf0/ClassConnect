import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, User, Shield, LogIn, LayoutDashboard, Share2, Radio, Star } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

      <div className="flex-none gap-3">
        <Link to="/" className="btn btn-ghost btn-sm text-slate-300 hover:text-white">
          Catalog
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {user?.role === 'admin' ? (
              <Link to="/admin" className="btn btn-sm bg-purple-600/20 border-purple-500/40 text-purple-300 hover:bg-purple-600/30 gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Admin Panel
              </Link>
            ) : (
              <Link to="/dashboard" className="btn btn-sm bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" /> My Learning
              </Link>
            )}

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-white/10">
                <div className="w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow-2xl menu menu-sm dropdown-content bg-slate-900 border border-white/10 rounded-xl w-52 text-slate-300"
              >
                <li className="menu-title px-4 py-2 border-b border-white/10 text-white">
                  <div className="font-bold truncate">{user?.name}</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate">{user?.email}</div>
                  <div className="badge badge-xs badge-outline mt-1 text-indigo-400 border-indigo-500/40 capitalize">
                    {user?.role}
                  </div>
                </li>
                {user?.role === 'admin' ? (
                  <>
                    <li>
                      <Link to="/admin"><Shield className="w-4 h-4 text-purple-400" /> Admin Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/admin/live"><Radio className="w-4 h-4 text-red-400" /> Live Classes Scheduler</Link>
                    </li>
                    <li>
                      <Link to="/admin/reviews"><Star className="w-4 h-4 text-yellow-400" /> Review Moderation Queue</Link>
                    </li>
                    <li>
                      <Link to="/admin/referrals"><Share2 className="w-4 h-4 text-emerald-400" /> Referral CMS & Payouts</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/dashboard"><User className="w-4 h-4 text-indigo-400" /> Student Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/referrals"><Share2 className="w-4 h-4 text-emerald-400" /> My Referral Hub</Link>
                    </li>
                  </>
                )}
                <li>
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost btn-sm text-slate-300 hover:text-white">
              Log In
            </Link>
            <Link to="/register" className="btn btn-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20">
              Register & Enroll
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
