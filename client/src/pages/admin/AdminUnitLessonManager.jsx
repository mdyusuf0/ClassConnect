import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getAdminCourseByIdApi,
  addUnitApi,
  reorderUnitsApi,
  deleteUnitApi,
  addLessonApi,
  deleteLessonApi,
  uploadBunnyAssetApi,
} from '../../api/client';
import {
  Layers,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Video,
  PlayCircle,
  Eye,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Upload,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function AdminUnitLessonManager() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Unit Form State
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitDesc, setNewUnitDesc] = useState('');
  const [addingUnit, setAddingUnit] = useState(false);

  // Lesson Form Modal State
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [lessonData, setLessonData] = useState({
    title: '',
    description: '',
    duration: 600,
    videoUrl: '',
    isFreePreview: false,
  });
  const [addingLesson, setAddingLesson] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await getAdminCourseByIdApi(courseId);
      if (res.success && res.course) {
        setCourse(res.course);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!newUnitTitle) return;
    setAddingUnit(true);
    setError('');
    try {
      const res = await addUnitApi(courseId, { title: newUnitTitle, description: newUnitDesc });
      if (res.success) {
        setNewUnitTitle('');
        setNewUnitDesc('');
        setSuccessMsg('Unit added successfully.');
        fetchCourse();
      }
    } catch (err) {
      setError(err.message || 'Failed to add unit');
    } finally {
      setAddingUnit(false);
    }
  };

  const handleMoveUnit = async (unitId, direction) => {
    if (!course || !course.units) return;
    const units = [...course.units];
    const index = units.findIndex((u) => u.id === unitId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= units.length) return;

    // Swap elements
    const temp = units[index];
    units[index] = units[targetIndex];
    units[targetIndex] = temp;

    const unitOrders = units.map((u, i) => ({ id: u.id, order: i + 1 }));

    try {
      const res = await reorderUnitsApi(courseId, unitOrders);
      if (res.success) {
        setCourse((prev) => ({ ...prev, units: res.units }));
      }
    } catch (err) {
      setError('Reorder failed: ' + err.message);
    }
  };

  const handleDeleteUnit = async (unitId, title) => {
    if (!window.confirm(`Delete unit "${title}" and all its lessons?`)) return;
    try {
      const res = await deleteUnitApi(courseId, unitId);
      if (res.success) {
        setSuccessMsg(`Unit "${title}" deleted.`);
        fetchCourse();
      }
    } catch (err) {
      setError(err.message || 'Delete unit failed');
    }
  };

  const handleBunnyVideoUpload = async () => {
    setUploadingVideo(true);
    try {
      const res = await uploadBunnyAssetApi({
        filename: `${lessonData.title ? lessonData.title.toLowerCase().replace(/ /g, '_') : 'lesson'}.mp4`,
        folder: 'videos',
      });
      if (res.success && res.result?.cdnUrl) {
        setLessonData((prev) => ({ ...prev, videoUrl: res.result.cdnUrl }));
      }
    } catch (err) {
      setError('Bunny upload error: ' + err.message);
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAddLessonSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUnitId || !lessonData.title) return;
    setAddingLesson(true);
    setError('');
    try {
      const res = await addLessonApi(courseId, selectedUnitId, lessonData);
      if (res.success) {
        setSelectedUnitId(null);
        setLessonData({ title: '', description: '', duration: 600, videoUrl: '', isFreePreview: false });
        setSuccessMsg('Lesson added successfully.');
        fetchCourse();
      }
    } catch (err) {
      setError(err.message || 'Failed to add lesson');
    } finally {
      setAddingLesson(false);
    }
  };

  const handleDeleteLesson = async (unitId, lessonId, title) => {
    if (!window.confirm(`Delete lesson "${title}"?`)) return;
    try {
      const res = await deleteLessonApi(courseId, unitId, lessonId);
      if (res.success) {
        setSuccessMsg(`Lesson "${title}" deleted.`);
        fetchCourse();
      }
    } catch (err) {
      setError(err.message || 'Delete lesson failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/courses" className="btn btn-circle btn-ghost btn-sm text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="badge badge-sm badge-outline text-indigo-400 border-indigo-500/40 mb-1">
              {course?.category}
            </div>
            <h1 className="text-2xl font-black text-white">{course?.title}</h1>
            <p className="text-xs text-slate-400">Curriculum Units & Lessons Manager</p>
          </div>
        </div>
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

      {/* Add New Unit Bar */}
      <form onSubmit={handleAddUnit} className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" /> Create New Course Unit / Module
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            required
            value={newUnitTitle}
            onChange={(e) => setNewUnitTitle(e.target.value)}
            placeholder="Unit Title (e.g. Unit 1: Fundamentals)"
            className="input input-bordered w-full bg-slate-900/60 text-white border-white/10 text-xs"
          />
          <input
            type="text"
            value={newUnitDesc}
            onChange={(e) => setNewUnitDesc(e.target.value)}
            placeholder="Unit Description (optional)"
            className="input input-bordered w-full bg-slate-900/60 text-white border-white/10 text-xs"
          />
          <button
            type="submit"
            disabled={addingUnit}
            className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-500/20 text-xs gap-2"
          >
            {addingUnit ? <span className="loading loading-spinner loading-xs"></span> : <Plus className="w-4 h-4" />}
            Add Unit
          </button>
        </div>
      </form>

      {/* Units & Lessons List */}
      <div className="space-y-4">
        {course?.units?.length === 0 ? (
          <div className="card glass-panel p-12 text-center text-slate-400 space-y-2 rounded-2xl">
            <Layers className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No units created for this course yet.</p>
            <p className="text-xs text-slate-500">Use the form above to add your first curriculum unit.</p>
          </div>
        ) : (
          course?.units?.sort((a, b) => a.order - b.order).map((unit, unitIdx) => (
            <div key={unit.id} className="card glass-panel rounded-2xl border border-white/10 overflow-hidden">
              {/* Unit Header Bar */}
              <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                    {unitIdx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-sm">{unit.title}</h4>
                    {unit.description && <p className="text-xs text-slate-400">{unit.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveUnit(unit.id, 'up')}
                    disabled={unitIdx === 0}
                    className="btn btn-xs btn-square btn-ghost text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveUnit(unit.id, 'down')}
                    disabled={unitIdx === (course?.units?.length || 1) - 1}
                    className="btn btn-xs btn-square btn-ghost text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setSelectedUnitId(unit.id)}
                    className="btn btn-xs bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 gap-1 ml-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Lesson
                  </button>
                  <button
                    onClick={() => handleDeleteUnit(unit.id, unit.title)}
                    className="btn btn-xs btn-ghost text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Lessons inside Unit */}
              <div className="p-4 space-y-2">
                {unit.lessons?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3">No video lessons inside this unit yet.</p>
                ) : (
                  unit.lessons?.sort((a, b) => a.order - b.order).map((lesson, lessonIdx) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2">
                            <span>{lessonIdx + 1}. {lesson.title}</span>
                            {lesson.isFreePreview && (
                              <span className="badge badge-xs badge-success gap-1 text-[9px]">
                                <Eye className="w-2.5 h-2.5" /> Free Preview
                              </span>
                            )}
                          </div>
                          {lesson.description && <p className="text-[11px] text-slate-400">{lesson.description}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {Math.round(lesson.duration / 60)} mins
                        </span>
                        <button
                          onClick={() => handleDeleteLesson(unit.id, lesson.id, lesson.title)}
                          className="btn btn-xs btn-ghost text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Lesson Modal */}
      {selectedUnitId && (
        <div className="modal modal-open">
          <div className="modal-box glass-panel bg-slate-950 border border-white/10 max-w-lg p-6 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-400" /> Add Video Lesson to Unit
            </h3>

            <form onSubmit={handleAddLessonSubmit} className="space-y-4 text-xs">
              <div className="form-control">
                <label className="label text-slate-300 font-semibold">Lesson Title</label>
                <input
                  type="text"
                  required
                  value={lessonData.title}
                  onChange={(e) => setLessonData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Lesson 1.1: Environment Setup"
                  className="input input-bordered bg-slate-900/60 text-white border-white/10"
                />
              </div>

              <div className="form-control">
                <label className="label text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={lessonData.description}
                  onChange={(e) => setLessonData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Lesson objectives..."
                  className="textarea textarea-bordered bg-slate-900/60 text-white border-white/10"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label text-slate-300 font-semibold">Duration (seconds)</label>
                  <input
                    type="number"
                    value={lessonData.duration}
                    onChange={(e) => setLessonData((p) => ({ ...p, duration: Number(e.target.value) }))}
                    className="input input-bordered bg-slate-900/60 text-white border-white/10"
                  />
                </div>

                <div className="form-control">
                  <label className="label text-slate-300 font-semibold">Free Preview</label>
                  <label className="label cursor-pointer p-2.5 rounded-lg bg-slate-900/60 border border-white/10 justify-between">
                    <span className="text-[11px] text-slate-300">Allow free preview</span>
                    <input
                      type="checkbox"
                      checked={lessonData.isFreePreview}
                      onChange={(e) => setLessonData((p) => ({ ...p, isFreePreview: e.target.checked }))}
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                  </label>
                </div>
              </div>

              {/* Video URL & Bunny Upload */}
              <div className="form-control space-y-2">
                <label className="label text-slate-300 font-semibold">Video Streaming URL (Bunny Storage)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={lessonData.videoUrl}
                    onChange={(e) => setLessonData((p) => ({ ...p, videoUrl: e.target.value }))}
                    placeholder="https://classconnect.b-cdn.net/videos/..."
                    className="input input-bordered flex-1 bg-slate-900/60 text-white border-white/10 font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={handleBunnyVideoUpload}
                    disabled={uploadingVideo}
                    className="btn btn-outline border-white/10 text-indigo-400 hover:bg-indigo-600/20 gap-1 shrink-0"
                  >
                    {uploadingVideo ? <span className="loading loading-spinner loading-xs"></span> : <Upload className="w-3.5 h-3.5" />}
                    Upload Bunny
                  </button>
                </div>
              </div>

              <div className="modal-action pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUnitId(null)}
                  className="btn btn-ghost text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingLesson}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white border-0"
                >
                  {addingLesson ? <span className="loading loading-spinner loading-xs"></span> : 'Save Lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
