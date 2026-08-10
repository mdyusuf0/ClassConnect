import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAdminLiveClassesApi,
  scheduleLiveClassApi,
  updateLiveStatusApi,
  getAdminCoursesApi,
} from '../../api/client';
import { Radio, Plus, Play, Square, XCircle, CheckCircle2, AlertCircle, Calendar, RefreshCw, Eye } from 'lucide-react';

export default function AdminLiveClasses() {
  const [sessions, setSessions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Schedule Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    unitId: '',
    title: '',
    description: '',
    scheduledAt: new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 16),
    duration: 60,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sessRes, courseRes] = await Promise.all([
        getAdminLiveClassesApi(),
        getAdminCoursesApi(),
      ]);

      if (sessRes.success) setSessions(sessRes.sessions);
      if (courseRes.success && courseRes.courses?.length > 0) {
        setCourses(courseRes.courses);
        const firstCourse = courseRes.courses[0];
        setFormData((p) => ({
          ...p,
          courseId: firstCourse._id || firstCourse.id,
          unitId: firstCourse.units?.[0]?.id || 'unit_1',
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch live classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCourseChange = (cId) => {
    const selectedCourse = courses.find((c) => (c._id || c.id) === cId);
    setFormData((p) => ({
      ...p,
      courseId: cId,
      unitId: selectedCourse?.units?.[0]?.id || 'unit_1',
    }));
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.courseId) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await scheduleLiveClassApi(formData);
      if (res.success) {
        setSuccessMsg('Live session scheduled successfully.');
        setModalOpen(false);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Scheduling failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (sessionId, newStatus, title) => {
    const confirmMsg =
      newStatus === 'ended'
        ? `End session "${title}"? This will automatically convert the recording into a new course lesson!`
        : `Change status of "${title}" to ${newStatus}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await updateLiveStatusApi(sessionId, { status: newStatus });
      if (res.success) {
        setSuccessMsg(res.message);
        fetchData();
      }
    } catch (err) {
      setError(err.message || 'Status update failed');
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Room Management
          </div>
          <h1 className="text-2xl font-black text-white">Live Class Scheduler & Auto-Recording</h1>
          <p className="text-xs text-slate-400">Schedule interactive live sessions with real-time chat and auto-convert recordings into course lessons.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0 shadow-lg shadow-red-500/20 gap-2 text-xs font-bold shrink-0"
        >
          <Plus className="w-4 h-4" /> Schedule Live Class
        </button>
      </div>

      {successMsg && (
        <div className="alert alert-success bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex justify-between">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="text-xs text-emerald-400 hover:underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Sessions Table */}
      <div className="card glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <span className="loading loading-spinner loading-md text-red-500"></span>
            <p className="text-xs">Fetching live session schedule...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs italic">No live classes scheduled. Click above to schedule one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10">
                <tr>
                  <th className="py-4 px-6">Live Session Title</th>
                  <th>Scheduled Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th className="text-right px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {sessions.map((s) => (
                  <tr key={s.sessionId} className="hover:bg-white/5 transition-all">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white text-sm">{s.title}</div>
                      <div className="text-[11px] text-slate-400">{s.description || 'Interactive Q&A Session'}</div>
                    </td>
                    <td className="font-mono text-indigo-300">{new Date(s.scheduledAt).toLocaleString()}</td>
                    <td>{s.duration} mins</td>
                    <td>
                      <span className={`badge badge-sm font-bold uppercase text-[10px] gap-1 ${
                        s.status === 'live'
                          ? 'badge-error text-white animate-pulse'
                          : s.status === 'ended'
                          ? 'badge-success'
                          : 'badge-primary'
                      }`}>
                        {s.status === 'live' ? <Radio className="w-3 h-3" /> : null}
                        {s.status === 'live' ? 'LIVE NOW' : s.status}
                      </span>
                    </td>
                    <td className="text-right px-6 space-x-2">
                      {s.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusUpdate(s.sessionId, 'live', s.title)}
                          className="btn btn-xs bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 gap-1"
                        >
                          <Play className="w-3 h-3" /> Start Room
                        </button>
                      )}
                      {s.status === 'live' && (
                        <>
                          <Link
                            to={`/live-room/${s.sessionId}`}
                            className="btn btn-xs bg-red-600 border-0 text-white gap-1"
                          >
                            <Eye className="w-3 h-3" /> Join Room
                          </Link>
                          <button
                            onClick={() => handleStatusUpdate(s.sessionId, 'ended', s.title)}
                            className="btn btn-xs bg-amber-600/20 border-amber-500/40 text-amber-300 hover:bg-amber-600/30 gap-1"
                          >
                            <Square className="w-3 h-3" /> End & Convert
                          </button>
                        </>
                      )}
                      {s.status === 'ended' && (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Converted to Lesson
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Live Class Modal */}
      {modalOpen && (
        <div className="modal modal-open">
          <div className="modal-box glass-panel bg-slate-950 border border-white/10 max-w-lg p-6 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-red-400" /> Schedule Live Class Session
            </h3>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div className="form-control">
                <label className="label text-slate-300 font-semibold">Select Course</label>
                <select
                  value={formData.courseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="select select-bordered bg-slate-900/60 text-white border-white/10"
                >
                  {courses.map((c) => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label text-slate-300 font-semibold">Target Unit / Module</label>
                <select
                  value={formData.unitId}
                  onChange={(e) => setFormData((p) => ({ ...p, unitId: e.target.value }))}
                  className="select select-bordered bg-slate-900/60 text-white border-white/10"
                >
                  {courses.find((c) => (c._id || c.id) === formData.courseId)?.units?.map((u) => (
                    <option key={u.id} value={u.id}>{u.title}</option>
                  )) || <option value="unit_1">Unit 1: Fundamentals</option>}
                </select>
              </div>

              <div className="form-control">
                <label className="label text-slate-300 font-semibold">Session Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Live Q&A: System Architecture & Scaling"
                  className="input input-bordered bg-slate-900/60 text-white border-white/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label text-slate-300 font-semibold">Scheduled Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData((p) => ({ ...p, scheduledAt: e.target.value }))}
                    className="input input-bordered bg-slate-900/60 text-white border-white/10 font-mono"
                  />
                </div>

                <div className="form-control">
                  <label className="label text-slate-300 font-semibold">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData((p) => ({ ...p, duration: Number(e.target.value) }))}
                    className="input input-bordered bg-slate-900/60 text-white border-white/10 font-bold"
                  />
                </div>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-ghost text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn bg-red-600 hover:bg-red-700 text-white border-0"
                >
                  {submitting ? <span className="loading loading-spinner loading-xs"></span> : 'Schedule Live Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
