import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetailApi } from '../api/client';
import { BookOpen, PlayCircle, Eye, Shield, CheckCircle2, Clock, Layers, ArrowRight, X, Sparkles } from 'lucide-react';

export default function CourseDetail() {
  const { slugOrId } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewVideo, setPreviewVideo] = useState(null); // { title: string, videoUrl: string }

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getCourseDetailApi(slugOrId);
        if (res.success && res.course) {
          setCourse(res.course);
        }
      } catch (err) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slugOrId]);

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <BookOpen className="w-12 h-12 text-slate-600" />
        <h2 className="text-xl font-bold text-white">Course Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm">{error || 'The requested course does not exist.'}</p>
        <Link to="/" className="btn btn-sm btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-10 pb-16">
      {/* Course Hero Banner */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-b border-white/10 py-12 px-6">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary font-bold text-xs">{course.category}</span>
              <span className="badge badge-outline text-slate-300 border-white/20 text-xs">{course.level}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">{course.title}</h1>
            <p className="text-slate-300 text-sm leading-relaxed">{course.description}</p>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-indigo-400" /> {course.units?.length || 0} Curriculum Units</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Certificate of Completion</span>
            </div>
          </div>

          {/* Pricing & Enrollment Card */}
          <div className="card glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl space-y-6 text-center">
            <img
              src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
              alt={course.title}
              className="w-full h-44 object-cover rounded-xl border border-white/10"
            />
            <div className="space-y-1">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Course Enrollment Fee</span>
              <div className="text-4xl font-black text-white">${course.price}</div>
            </div>

            <Link
              to="/register"
              className="btn bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white border-0 w-full shadow-lg shadow-indigo-500/25 text-sm font-bold gap-2"
            >
              Enroll Now & Start Learning <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> 30-Day Money-Back Guarantee
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Outline */}
      <div className="container mx-auto px-6 max-w-4xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" /> Course Curriculum Outline
          </h2>
          <span className="text-xs text-slate-400">
            {course.units?.reduce((sum, u) => sum + (u.lessons?.length || 0), 0) || 0} Total Video Lessons
          </span>
        </div>

        {course.units?.length === 0 ? (
          <div className="card glass-panel p-8 text-center text-slate-400 text-xs rounded-2xl">
            Curriculum schedule is currently being finalized by the instructor.
          </div>
        ) : (
          <div className="space-y-4">
            {course.units?.sort((a, b) => a.order - b.order).map((unit, uIdx) => (
              <div key={unit.id || uIdx} className="card glass-panel rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-4 bg-slate-900/80 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                      {uIdx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-white text-sm">{unit.title}</h3>
                      {unit.description && <p className="text-xs text-slate-400">{unit.description}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{unit.lessons?.length || 0} Lessons</span>
                </div>

                <div className="p-4 space-y-2">
                  {unit.lessons?.sort((a, b) => a.order - b.order).map((lesson, lIdx) => (
                    <div
                      key={lesson.id || lIdx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <div className="font-semibold text-white">
                            {lIdx + 1}. {lesson.title}
                          </div>
                          {lesson.description && <p className="text-[11px] text-slate-400">{lesson.description}</p>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {lesson.isFreePreview ? (
                          <button
                            onClick={() =>
                              setPreviewVideo({
                                title: lesson.title,
                                videoUrl: lesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                              })
                            }
                            className="btn btn-xs bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 gap-1"
                          >
                            <Eye className="w-3 h-3" /> Watch Free Preview
                          </button>
                        ) : (
                          <span className="badge badge-xs badge-ghost text-slate-500 border-white/5">Enrolled Only</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Free Video Preview Modal */}
      {previewVideo && (
        <div className="modal modal-open">
          <div className="modal-box glass-panel bg-slate-950 border border-white/10 max-w-3xl p-6 space-y-4 relative">
            <button
              onClick={() => setPreviewVideo(null)}
              className="btn btn-circle btn-sm btn-ghost absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="badge badge-success text-[10px] uppercase font-bold">Free Preview</span>
              <h3 className="font-bold text-lg text-white">{previewVideo.title}</h3>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <video src={previewVideo.videoUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>

            <div className="flex justify-between items-center text-xs pt-2">
              <span className="text-slate-400">Enjoying this free preview? Enroll to unlock the complete course.</span>
              <Link to="/register" className="btn btn-sm btn-primary">Enroll Now</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
