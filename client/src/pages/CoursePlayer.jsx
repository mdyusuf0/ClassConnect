import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetailApi, getCourseProgressApi, updateLessonProgressApi, downloadCertificateApi } from '../api/client';
import {
  PlayCircle,
  Lock,
  Unlock,
  CheckCircle2,
  Award,
  Download,
  BookOpen,
  Clock,
  Sparkles,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

export default function CoursePlayer() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeUnit, setActiveUnit] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [certUnlockedNotification, setCertUnlockedNotification] = useState(false);

  const videoRef = useRef(null);
  const lastPingTimeRef = useRef(0);

  const fetchData = async () => {
    try {
      const [courseRes, progRes] = await Promise.all([
        getCourseDetailApi(courseId),
        getCourseProgressApi(courseId),
      ]);

      if (courseRes.success && courseRes.course) {
        setCourse(courseRes.course);
        const units = courseRes.course.units || [];
        if (units.length > 0) {
          setActiveUnit(units[0]);
          if (units[0].lessons?.length > 0) {
            setActiveLesson(units[0].lessons[0]);
          }
        }
      }

      if (progRes.success && progRes.progress) {
        setProgress(progRes.progress);
      }
    } catch (err) {
      setError(err.message || 'Failed to load course player');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  // Handle Video Time Update to send periodic progress updates to backend
  const handleTimeUpdate = async () => {
    if (!videoRef.current || !activeUnit || !activeLesson) return;

    const currentTime = Math.floor(videoRef.current.currentTime);
    const duration = Math.floor(videoRef.current.duration) || activeLesson.duration || 600;

    // Ping backend every 5 seconds or when lesson finishes
    if (currentTime - lastPingTimeRef.current >= 5 || currentTime >= duration - 1) {
      lastPingTimeRef.current = currentTime;
      try {
        const res = await updateLessonProgressApi({
          courseId: course._id || course.id || courseId,
          unitId: activeUnit.id,
          lessonId: activeLesson.id,
          watchedSeconds: currentTime,
          totalDuration: duration,
        });

        if (res.success && res.progress) {
          if (res.progress.newlyUnlockedCertId) {
            setCertUnlockedNotification(true);
          }
          // Refresh progress state
          const progRes = await getCourseProgressApi(course._id || course.id || courseId);
          if (progRes.success) {
            setProgress(progRes.progress);
          }
        }
      } catch (err) {
        console.warn('Progress update warning:', err);
      }
    }
  };

  const handleDownloadCertificate = async () => {
    if (!progress?.certificateId) return;
    setDownloadingCert(true);
    try {
      const blob = await downloadCertificateApi(progress.certificateId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ClassConnect_Certificate_${progress.certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Certificate download failed: ' + err.message);
    } finally {
      setDownloadingCert(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  const isCertUnlocked = (progress?.overallCoursePercentage || 0) >= 90;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Course Navigation & Overall Progress Bar */}
      <div className="bg-slate-900/80 border-b border-white/10 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="btn btn-circle btn-ghost btn-sm text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">{course?.title}</h1>
            <p className="text-xs text-slate-400">Classroom & Sequential Progress Tracker</p>
          </div>
        </div>

        {/* Overall Course Progress Widget */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-48 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Course Completion</span>
              <span className="text-indigo-400 font-bold">{progress?.overallCoursePercentage || 0}%</span>
            </div>
            <progress
              className="progress progress-primary w-full bg-slate-800"
              value={progress?.overallCoursePercentage || 0}
              max="100"
            ></progress>
          </div>

          {isCertUnlocked && (
            <button
              onClick={handleDownloadCertificate}
              disabled={downloadingCert}
              className="btn btn-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/25 gap-1.5 shrink-0"
            >
              {downloadingCert ? <span className="loading loading-spinner loading-xs"></span> : <Award className="w-4 h-4 text-yellow-300" />}
              Download Certificate PDF
            </button>
          )}
        </div>
      </div>

      {certUnlockedNotification && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/30 p-4 px-6 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Congratulations! You reached 90% course completion and unlocked your Certificate of Completion!</span>
          </div>
          <button onClick={() => setCertUnlockedNotification(false)} className="text-emerald-400 underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 rounded-none text-xs p-3 px-6">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Classroom Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3">
        {/* Left/Main Video Player Panel */}
        <div className="lg:col-span-2 p-6 space-y-6 bg-slate-950 border-r border-white/10">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            {activeLesson ? (
              <video
                ref={videoRef}
                key={activeLesson.id}
                src={activeLesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                controls
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                Select an unlocked lesson to start watching
              </div>
            )}
          </div>

          {activeLesson && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary font-bold text-xs">{activeUnit?.title}</span>
                <span className="badge badge-outline text-slate-400 border-white/10 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {Math.round((activeLesson.duration || 600) / 60)} mins
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white">{activeLesson.title}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{activeLesson.description}</p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Units & Lessons with Sequential Lock Status */}
        <div className="p-6 space-y-4 bg-slate-900/40 overflow-y-auto max-h-[85vh]">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" /> Course Outline & Units
            </h3>
            <span className="text-[11px] text-slate-400">Sequential 90% Unlock</span>
          </div>

          <div className="space-y-4">
            {course?.units?.sort((a, b) => a.order - b.order).map((unit, uIdx) => {
              const unitLockInfo = progress?.unitLockStatusMap?.[unit.id] || {
                isUnlocked: uIdx === 0,
                percentageWatched: 0,
              };

              const isUnlocked = unitLockInfo.isUnlocked;

              return (
                <div
                  key={unit.id}
                  className={`card glass-panel rounded-xl border transition-all ${
                    isUnlocked
                      ? 'border-white/10 bg-slate-900/60'
                      : 'border-white/5 bg-slate-950/60 opacity-60'
                  }`}
                >
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center border ${
                          isUnlocked
                            ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        {isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-slate-500" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white flex items-center gap-2">
                          {unit.title}
                          {!isUnlocked && (
                            <span className="badge badge-xs badge-error text-[9px]">Locked</span>
                          )}
                        </h4>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {isUnlocked
                            ? `${unitLockInfo.percentageWatched}% watched`
                            : 'Watch 90% of Unit ' + uIdx + ' to unlock'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lessons list inside unit */}
                  {isUnlocked && (
                    <div className="p-3 space-y-1.5">
                      {unit.lessons?.sort((a, b) => a.order - b.order).map((lesson, lIdx) => {
                        const isActive = activeLesson?.id === lesson.id;
                        const lessonProg = progress?.lessonProgress?.find((l) => l.lessonId === lesson.id);
                        const isDone = lessonProg?.isCompleted || (lessonProg?.percentage || 0) >= 90;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              setActiveUnit(unit);
                              setActiveLesson(lesson);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                              isActive
                                ? 'bg-indigo-600/30 text-white font-bold border border-indigo-500/50'
                                : 'bg-slate-900/40 text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <PlayCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              )}
                              <span className="truncate">{lIdx + 1}. {lesson.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                              {lessonProg ? `${lessonProg.percentage}%` : '0%'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
