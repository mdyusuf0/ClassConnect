import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetailApi, getCourseProgressApi, updateLessonProgressApi, downloadCertificateApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import logger from '../utils/logger';
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
  Shield,
} from 'lucide-react';

export default function CoursePlayer() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeUnit, setActiveUnit] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [certUnlockedNotification, setCertUnlockedNotification] = useState(false);

  // Dynamic Moving Watermark Position State (0 to 5)
  const [watermarkPosIndex, setWatermarkPosIndex] = useState(0);

  const videoRef = useRef(null);
  const lastPingTimeRef = useRef(0);

  // Watermark positions around the video player
  const watermarkPositions = [
    'top-4 left-4',
    'top-4 right-4',
    'bottom-14 left-4',
    'bottom-14 right-4',
    'top-1/2 left-6 -translate-y-1/2',
    'top-1/2 right-6 -translate-y-1/2',
  ];

  // Rotate anti-piracy watermark position every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPosIndex((prev) => (prev + 1) % watermarkPositions.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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
          const progRes = await getCourseProgressApi(course._id || course.id || courseId);
          if (progRes.success) {
            setProgress(progRes.progress);
          }
        }
      } catch (err) {
        logger.warn('Progress update warning:', err);
      }
    }
  };

  const handleDownloadCertificate = async () => {
    if (!progress?.certificateId) return;
    setDownloadingCert(true);
    try {
      const blobData = await downloadCertificateApi(progress.certificateId);
      const url = window.URL.createObjectURL(new Blob([blobData], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${progress.certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Certificate download failed');
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

  const isCertUnlocked = progress?.isCertificateUnlocked;

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
          <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative select-none">
            {activeLesson ? (
              <>
                <video
                  ref={videoRef}
                  key={activeLesson.id}
                  src={activeLesson.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                  controls
                  autoPlay
                  controlsList="nodownload"
                  onContextmenu={(e) => e.preventDefault()}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full object-contain"
                />

                {/* Anti-Piracy Dynamic Moving Watermark Overlay */}
                <div
                  className={`absolute transition-all duration-1000 pointer-events-none select-none text-[11px] font-mono font-bold tracking-widest text-white/25 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-xs z-30 shadow-lg ${watermarkPositions[watermarkPosIndex]}`}
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-red-400/50" />
                    {user?.email || 'student@classconnect.app'} (ID: {user?.id || user?._id || 'CC-ST-9821'})
                  </span>
                </div>
              </>
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
                <span className="badge badge-ghost text-[10px] text-emerald-400 border-emerald-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Signed Token Stream
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
            {course?.units?.map((unit, uIdx) => {
              const unitLockInfo = progress?.unitLockStatusMap?.[unit.id] || {
                isUnlocked: uIdx === 0,
                percentageWatched: 0,
              };
              const isUnitUnlocked = unitLockInfo.isUnlocked;

              return (
                <div
                  key={unit.id}
                  className={`card rounded-xl border transition-all ${
                    isUnitUnlocked
                      ? 'bg-slate-900/60 border-white/10'
                      : 'bg-slate-950/60 border-white/5 opacity-60'
                  }`}
                >
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-xs text-white leading-snug">{unit.title}</h4>
                      {isUnitUnlocked ? (
                        <span className="badge badge-xs badge-success gap-1 text-[9px]">
                          <Unlock className="w-2.5 h-2.5" /> Unlocked
                        </span>
                      ) : (
                        <span className="badge badge-xs badge-error gap-1 text-[9px]">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Unit Progress</span>
                        <span>{unitLockInfo.percentageWatched || 0}%</span>
                      </div>
                      <progress
                        className="progress progress-secondary w-full bg-slate-800 h-1.5"
                        value={unitLockInfo.percentageWatched || 0}
                        max="100"
                      ></progress>
                    </div>

                    {/* Lessons list */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      {unit.lessons?.map((lesson) => {
                        const isActive = activeLesson?.id === lesson.id;
                        return (
                          <button
                            key={lesson.id}
                            disabled={!isUnitUnlocked}
                            onClick={() => {
                              setActiveUnit(unit);
                              setActiveLesson(lesson);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between text-xs transition-all ${
                              isActive
                                ? 'bg-indigo-600/30 border border-indigo-500/50 text-white font-bold'
                                : isUnitUnlocked
                                ? 'hover:bg-white/5 text-slate-300'
                                : 'text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <span className="truncate flex items-center gap-2">
                              {isActive ? <PlayCircle className="w-4 h-4 text-indigo-400 shrink-0" /> : null}
                              {lesson.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {Math.round((lesson.duration || 600) / 60)}m
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
