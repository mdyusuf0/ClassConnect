import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Award, Clock, PlayCircle, User, Sparkles, CheckCircle2 } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-8 space-y-8 max-w-6xl">
      {/* Student Welcome Header */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
            <User className="w-3.5 h-3.5" /> Enrolled Student
          </div>
          <h1 className="text-3xl font-black text-white">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-slate-400 mt-1">Track your course progression, resume video lessons, and view certificates.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-white/10 text-center">
            <div className="text-2xl font-black text-indigo-400">{user?.enrolledCourses?.length || 1}</div>
            <div className="text-xs text-slate-400">Enrolled Courses</div>
          </div>
          <div className="p-4 bg-slate-900/60 rounded-xl border border-white/10 text-center">
            <div className="text-2xl font-black text-emerald-400">0%</div>
            <div className="text-xs text-slate-400">Avg Progress</div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> My Learning Plan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card glass-panel rounded-2xl border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all">
            <div className="h-40 bg-gradient-to-br from-indigo-900 to-slate-900 p-6 flex flex-col justify-between relative">
              <span className="badge badge-primary font-bold text-xs self-start">Active Enrollment</span>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Full Stack Web Development</h3>
                <p className="text-xs text-slate-400 mt-1">Unit 1: Fundamentals & Setup</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Course Progress</span>
                  <span className="text-indigo-400 font-bold">0%</span>
                </div>
                <progress className="progress progress-primary w-full bg-slate-800" value="0" max="100"></progress>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 12 Modules</span>
                <span className="flex items-center gap-1 text-slate-400"><Award className="w-3.5 h-3.5" /> Locked Certificate</span>
              </div>

              <Link to="/learn/course_web_dev_101" className="btn bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 w-full shadow-lg shadow-indigo-500/20">
                <PlayCircle className="w-4 h-4" /> Start Learning / Resume Player
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
