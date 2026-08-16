import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import store from '../data/mockStore';
import { 
  Clock, BookOpen, BarChart, User, CheckCircle, ArrowLeft, PlayCircle, 
  Video, Layers, Lock, Unlock, Play, Sparkles, Zap, ShieldCheck, Flame, ChevronRight, Award, AlertCircle, X
} from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [videoSrc, setVideoSrc] = useState('');
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [lockedLessonAttempt, setLockedLessonAttempt] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        let courseData = await api.getCourseDetailApi(id).catch(() => null);
        if (!courseData) {
          courseData = store.getCourseById(id);
        }
        setCourse(courseData);

        let pkgs = await api.getPackagesApi().catch(() => null);
        if (!pkgs || pkgs.length === 0) {
          pkgs = store.getPackages();
        }
        const courseIdToMatch = courseData ? (courseData.id || courseData._id || id) : id;
        const associatedPkgs = (pkgs || []).filter(p => p.courses && (p.courses.includes(id) || p.courses.includes(courseIdToMatch)));
        setPackages(associatedPkgs.length > 0 ? associatedPkgs : (pkgs || []).slice(0, 3));

        const units = courseData?.units || [];
        if (units.length > 0 && units[0].lessons?.length > 0) {
          const firstLesson = units[0].lessons[0];
          setActiveLesson(firstLesson);
          setVideoSrc(firstLesson.videoUrl || '');
        }
      } catch (err) {
        console.warn('Failed to load course details:', err.message);
        const fallbackCourse = store.getCourseById(id);
        setCourse(fallbackCourse);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleSelectLesson = (unitIndex, lessonIndex, lesson) => {
    const isUnlocked = (unitIndex === 0 && lessonIndex === 0) || lesson.isFreePreview;
    
    if (isUnlocked) {
      setActiveLesson(lesson);
      setVideoSrc(lesson.videoUrl || '');
    } else {
      setLockedLessonAttempt(lesson);
      setShowLockedModal(true);
    }
  };

  const handleVideoError = () => {
    setVideoSrc('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F9FA] flex items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600 font-extrabold text-sm">Loading course roadmap & modules...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F5F9FA] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading font-extrabold text-3xl text-gray-900 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-6">The course you are looking for does not exist or has been moved.</p>
        <Link to="/courses" className="px-6 py-3 bg-[#001845] text-white font-bold rounded-xl shadow">
          Back to Courses Catalog
        </Link>
      </div>
    );
  }

  const skillsGained = [
    course.title + ' Architecture',
    'Practical Hands-on Projects',
    'AI Tools & Automation',
    'Performance Optimization',
    'Live Mentorship Q&A',
    'Verifiable Skill Certification'
  ];

  const learningOutcomes = [
    "Master core production principles & algorithms of " + course.title + ".",
    "Execute live hands-on practical project workflows in Telugu & English.",
    "Utilize modern industry tools and Generative AI prompt frameworks.",
    "Build a professional, client-ready portfolio demonstrating real skills.",
    "Gain 1-on-1 mentorship & code reviews from senior PRO faculty.",
    "Earn a cryptographically verifiable skill certificate upon course completion."
  ];

  return (
    <div className="bg-[#F5F9FA] min-h-screen pb-20 font-sans">
      <div className="bg-gradient-to-br from-[#001845] via-[#002B70] to-[#001845] text-white py-12 md:py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
          <Link to="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider mb-4 transition-colors">
            <ArrowLeft size={16} /> Back to Courses Catalog
          </Link>
          
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl max-w-4xl text-white mb-4 leading-tight">
            {course.title}
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed mb-6 font-normal">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-4 text-xs md:text-sm text-gray-300">
            <span className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
              <User size={16} className="text-amber-400" /> Instructor: ClassConnect PRO Mentors
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
              <Clock size={16} className="text-amber-400" /> {course.duration || '4 Weeks'}
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
              <BookOpen size={16} className="text-amber-400" /> {course.lessons || 24} Recorded & Live Units
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
              <BarChart size={16} className="text-amber-400" /> {course.level || 'Beginner to Advanced'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-gray-950 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <video 
                  key={videoSrc}
                  controls 
                  autoPlay={false}
                  onError={handleVideoError}
                  poster={course.thumbnail}
                  className="w-full h-full object-cover"
                >
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video player.
                </video>
              </div>

              <div className="p-5 bg-gray-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-gray-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Video size={13} /> Active Stream: Lesson Preview
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-white">
                    {activeLesson?.title || 'Lesson 1.1: Course Introduction & Orientation'}
                  </h3>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase rounded-lg flex items-center gap-1">
                  <Unlock size={12} /> Free Preview Unlocked
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-4">
              <span className="pre-title">Target Skills</span>
              <h2 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
                <Zap className="text-amber-500" size={24} /> Skills You Will Gain
              </h2>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {skillsGained.map((skill, sIdx) => (
                  <span key={sIdx} className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                    <Sparkles size={13} className="text-amber-500" /> {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-4">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900">About This Course</h2>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed font-normal">{course.description}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Designed specifically for Indian learners, this course features dual-language Telugu and English explanations. Master {course.title} from basic foundations to advanced production-level applications alongside senior industry mentors.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                <div>
                  <span className="pre-title">Structured Learning Pathway</span>
                  <h2 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
                    <Layers className="text-amber-500" size={24} /> Course Playlist & Roadmap
                  </h2>
                </div>
                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                  {course.units?.length || 4} Units • 1 Preview Unlocked
                </span>
              </div>

              <div className="space-y-6">
                {(course.units || []).map((unit, uIdx) => (
                  <div key={unit.id || uIdx} className="bg-[#F5F9FA] border border-gray-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest block mb-0.5">
                          UNIT {'0' + (uIdx + 1)}
                        </span>
                        <h4 className="font-heading font-extrabold text-base text-gray-900">
                          {unit.title || `Unit ${uIdx + 1}`}
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-lg border border-gray-200">
                        {unit.lessons?.length || 0} Lessons
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {unit.lessons?.map((les, lIdx) => {
                        const isUnlocked = (uIdx === 0 && lIdx === 0) || les.isFreePreview;
                        const isCurrentActive = activeLesson?.id === les.id;

                        return (
                          <div 
                            key={les.id || lIdx}
                            onClick={() => handleSelectLesson(uIdx, lIdx, les)}
                            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                              isCurrentActive
                                ? 'bg-amber-500/10 border-amber-500 text-amber-950 font-bold shadow-sm'
                                : isUnlocked
                                ? 'bg-white border-emerald-200 hover:bg-emerald-50/50 text-gray-900'
                                : 'bg-white/70 border-gray-200 hover:bg-amber-50/30 text-gray-500'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                isUnlocked ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                              }`}>
                                {isUnlocked ? <Play size={14} className="fill-current" /> : <Lock size={14} />}
                              </div>
                              <div>
                                <span className={`text-xs font-bold block ${isUnlocked ? 'text-gray-900' : 'text-gray-600'}`}>
                                  {les.title}
                                </span>
                                {les.description && (
                                  <span className="text-[11px] text-gray-400 font-normal line-clamp-1">
                                    {les.description}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-mono text-gray-400">
                                {les.duration ? `${Math.round(les.duration / 60)} mins` : '15 mins'}
                              </span>
                              {isUnlocked ? (
                                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-md uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                                  <Unlock size={10} /> FREE PREVIEW
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-extrabold rounded-md uppercase tracking-wider border border-gray-200 flex items-center gap-1">
                                  <Lock size={10} /> ENROLL TO UNLOCK
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200/80 space-y-4">
              <span className="pre-title">Course Mastery</span>
              <h2 className="font-heading font-extrabold text-2xl text-gray-900">What You Will Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-[#F5F9FA] border border-gray-200/70">
                    <CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm font-semibold text-gray-800 leading-snug">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 md:p-7 border border-gray-200 shadow-xl space-y-5 sticky top-6">
              
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-3.5 rounded-2xl shadow-md space-y-1">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider">
                  <Flame size={16} className="animate-bounce text-amber-200" /> HURRY UP! LIMITED COHORT SEATS
                </div>
                <p className="text-[11px] font-semibold text-amber-50 leading-tight">
                  ⚡ Special 70% Launch Discount ends soon. 142 students enrolled today!
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Course Tuition</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold uppercase tracking-widest border border-red-200">
                    SAVE 70%
                  </span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-heading font-extrabold text-3xl md:text-4xl text-gray-900">
                    ₹{(course.price || 1499).toLocaleString('en-IN')}
                  </span>
                  {course.originalPrice && (
                    <span className="text-sm font-semibold text-gray-400 line-through decoration-red-500 decoration-2">
                      ₹{(course.originalPrice || 4999).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <Link 
                to={`/register?course=${course.id || course._id}`}
                className="w-full py-3.5 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Enroll In This Course (₹{(course.price || 1499).toLocaleString('en-IN')}) <ChevronRight size={16} />
              </Link>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-extrabold text-sm text-gray-900">
                    Included In Package Bundles:
                  </h3>
                  <span className="text-[10px] font-bold text-amber-600 uppercase">Save Up To 70%</span>
                </div>

                <div className="space-y-3">
                  {packages.map(pkg => (
                    <div key={pkg.id || pkg._id} className="p-4 rounded-2xl bg-[#F5F9FA] border border-gray-200/90 space-y-2 hover:border-amber-400 transition-all">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-heading font-extrabold text-sm text-gray-900">{pkg.name}</h4>
                          <span className="text-[11px] font-bold text-gray-500">{pkg.courses?.length || 14} Courses Included</span>
                        </div>
                        <div className="text-right">
                          {pkg.originalPrice && (
                            <span className="block text-[10px] text-gray-400 line-through decoration-red-500 leading-none">
                              ₹{pkg.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="font-heading font-extrabold text-base text-gray-900 leading-tight">
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                        <span>⚡ Direct Referral Payout:</span>
                        <span>₹{pkg.commission || 0} / Sale</span>
                      </div>

                      <Link 
                        to={`/register?package=${pkg.id || pkg._id}`} 
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        Unlock via {pkg.name} 🚀
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-1">
                  <Link to="/packages" className="text-xs font-bold text-[#001845] hover:text-amber-600 underline">
                    View All 5 Package Bundles ➔
                  </Link>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-600 border-t border-gray-100 pt-4 font-medium">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>100% Bilingual OS (Telugu & English)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Award size={16} className="text-amber-500 flex-shrink-0" />
                  <span>Cryptographically Verifiable Skill Certificate</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap size={16} className="text-blue-600 flex-shrink-0" />
                  <span>Direct Daily Referral Earnings Eligible</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>Lifetime Access & 1-on-1 Mentor Support</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {showLockedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-gray-200 relative space-y-4">
            <button 
              onClick={() => setShowLockedModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full bg-gray-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock size={28} />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-2">
                LOCKED MASTERCLASS LESSON
              </span>
              <h3 className="font-heading font-extrabold text-xl text-gray-900 mb-1">
                {lockedLessonAttempt?.title || 'Enroll to Unlock Lesson'}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">
                This lesson is locked. Enroll in this masterclass or unlock all 30+ courses via our Package Bundles to get unlimited recorded units & live masterclass access!
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link 
                to={`/register?course=${course.id || course._id}`}
                onClick={() => setShowLockedModal(false)}
                className="w-full py-3 bg-[#001845] hover:bg-[#002B70] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow block text-center cursor-pointer"
              >
                Enroll In Course (₹{(course.price || 1499).toLocaleString('en-IN')})
              </Link>
              
              <Link 
                to="/packages"
                onClick={() => setShowLockedModal(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow block text-center cursor-pointer"
              >
                Unlock All Courses via Package Bundles 🚀
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
