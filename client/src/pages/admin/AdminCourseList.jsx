import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminCoursesApi, deleteCourseApi, updateCourseApi } from '../../api/client';
import { BookOpen, Plus, Edit, Trash2, Layers, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminCourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getAdminCoursesApi();
      if (res.success) {
        setCourses(res.courses);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch admin courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await deleteCourseApi(id);
      if (res.success) {
        setSuccessMsg(`Course "${title}" deleted successfully.`);
        fetchCourses();
      }
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      const courseId = course._id || course.id;
      const res = await updateCourseApi(courseId, { isPublished: !course.isPublished });
      if (res.success) {
        setSuccessMsg(`Publication status updated for "${course.title}".`);
        fetchCourses();
      }
    } catch (err) {
      setError(err.message || 'Toggle publish failed');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> CMS Dashboard
          </div>
          <h1 className="text-2xl font-black text-white">Course Management</h1>
          <p className="text-xs text-slate-400">Create, publish, edit curriculum units, and manage video uploads.</p>
        </div>

        <Link
          to="/admin/courses/new"
          className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20 gap-2 text-xs"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </Link>
      </div>

      {successMsg && (
        <div className="alert alert-success bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {successMsg}
          </span>
          <button onClick={() => setSuccessMsg('')} className="text-xs text-emerald-400 hover:underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl text-xs">
          <span>{error}</span>
        </div>
      )}

      {/* Courses Table / List */}
      <div className="card glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <span className="loading loading-spinner loading-md text-indigo-500"></span>
            <p className="text-xs">Loading course management database...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Courses Created Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Get started by creating your first course, adding units, and uploading video lessons.
            </p>
            <Link to="/admin/courses/new" className="btn btn-sm btn-primary">
              Create First Course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="py-4 px-6">Course</th>
                  <th>Category / Level</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Units</th>
                  <th className="text-right px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {courses.map((course) => {
                  const courseId = course._id || course.id;
                  return (
                    <tr key={courseId} className="hover:bg-white/5 transition-all">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={course.thumbnail || 'https://via.placeholder.com/150'}
                            alt={course.title}
                            className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white text-sm leading-tight">{course.title}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{course.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="space-y-1">
                          <span className="badge badge-sm badge-outline text-indigo-400 border-indigo-500/40">
                            {course.category}
                          </span>
                          <div className="text-[10px] text-slate-400">{course.level}</div>
                        </div>
                      </td>

                      <td className="font-black text-indigo-400 text-sm">${course.price}</td>

                      <td>
                        <button
                          onClick={() => handleTogglePublish(course)}
                          className={`badge badge-sm cursor-pointer gap-1 py-2 px-3 font-semibold ${
                            course.isPublished ? 'badge-success text-slate-950' : 'badge-ghost text-slate-400 border-white/10'
                          }`}
                        >
                          {course.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {course.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      <td>
                        <span className="badge badge-sm badge-neutral font-mono">
                          {course.units?.length || 0} Units
                        </span>
                      </td>

                      <td className="text-right px-6 space-x-2">
                        <Link
                          to={`/admin/courses/${courseId}/units`}
                          className="btn btn-xs bg-indigo-600/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 gap-1"
                        >
                          <Layers className="w-3 h-3" /> Units & Lessons
                        </Link>
                        <Link
                          to={`/admin/courses/${courseId}/edit`}
                          className="btn btn-xs btn-ghost text-slate-300 hover:text-white"
                        >
                          <Edit className="w-3 h-3" />
                        </Link>
                        <button
                          onClick={() => handleDelete(courseId, course.title)}
                          className="btn btn-xs btn-ghost text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
