import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCoursesApi } from '../api/client';
import logger from '../utils/logger';
import { Search, Filter, BookOpen, Award, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['All', 'Web Development', 'Artificial Intelligence', 'Data Science', 'Mobile App Development', 'Cybersecurity'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getCoursesApi({
        search,
        category: selectedCategory,
        level: selectedLevel,
      });
      if (res.success) {
        setCourses(res.courses);
      }
    } catch (err) {
      logger.error('Failed to fetch public catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="container mx-auto px-6 py-10 space-y-10 max-w-7xl">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Explore Premier Courses
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Master Modern Tech Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">ClassConnect</span>
        </h1>
        <p className="text-base text-slate-400">
          Structured units, sequential progress tracking, free previews, and live interactive class sessions.
        </p>

        {/* Live Search Form */}
        <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto pt-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by keyword, topic, or technology..."
              className="input input-bordered w-full pl-12 pr-24 py-3 bg-slate-900/80 text-white placeholder-slate-500 border-white/10 focus:border-indigo-500 rounded-2xl shadow-xl text-sm"
            />
            <button
              type="submit"
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-0 absolute right-2 top-2 rounded-xl"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Category Pills & Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-y border-white/5 py-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 overflow-x-auto max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Level:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="select select-sm select-bordered bg-slate-900/80 text-white border-white/10 text-xs rounded-xl"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 space-y-3">
          <span className="loading loading-spinner loading-lg text-indigo-500"></span>
          <p className="text-sm">Filtering course catalog...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="card glass-panel p-16 text-center space-y-3 max-w-md mx-auto rounded-2xl border border-white/10">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Courses Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search terms or category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const courseId = course._id || course.id || course.slug;
            return (
              <div
                key={courseId}
                className="card glass-panel rounded-2xl border border-white/10 overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col group shadow-xl"
              >
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="badge badge-sm bg-slate-950/80 backdrop-blur-md text-indigo-400 border border-indigo-500/30 font-semibold text-[11px]">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="badge badge-sm bg-slate-950/80 backdrop-blur-md text-slate-300 border border-white/10 text-[10px]">
                      {course.level}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Tuition Fee</span>
                      <span className="text-2xl font-black text-white">${course.price}</span>
                    </div>

                    <Link
                      to={`/courses/${course.slug || courseId}`}
                      className="btn btn-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20 gap-1.5"
                    >
                      View Course <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
