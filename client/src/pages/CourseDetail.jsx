import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import store from '../data/mockStore';
import { Clock, BookOpen, BarChart, User, CheckCircle, ArrowLeft, PlayCircle, Video, Layers, Lock, Play } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const course = store.getCourseById(Number(id) || id);
  const packages = store.getPackages().filter(p => p.courses && p.courses.includes(course?.id));

  // Determine units / lessons
  const defaultUnits = course?.units && course.units.length > 0 ? course.units : [
    {
      unitNumber: 1,
      title: 'Unit 1: Fundamentals & Environment Setup',
      lessons: [
        { id: 'l1', title: 'Lesson 1.1: Masterclass Overview & Roadmap', duration: '12:45', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', isFreePreview: true },
        { id: 'l2', title: 'Lesson 1.2: Essential Tools & Dashboard Walkthrough', duration: '18:20', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', isFreePreview: true },
      ]
    },
    {
      unitNumber: 2,
      title: 'Unit 2: Hands-On Execution & Optimization',
      lessons: [
        { id: 'l3', title: 'Lesson 2.1: Practical Campaign Setup & Ad Copy', duration: '24:10', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', isFreePreview: false },
        { id: 'l4', title: 'Lesson 2.2: Retargeting, Analytics & Scaling ROI', duration: '30:15', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', isFreePreview: false },
      ]
    }
  ];

  const [activeLesson, setActiveLesson] = useState(defaultUnits[0]?.lessons[0]);
  const [videoSrc, setVideoSrc] = useState(
    activeLesson?.videoUrl ? store.formatBunnyStreamUrl(activeLesson.videoUrl) : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  );

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    const formatted = store.formatBunnyStreamUrl(lesson.videoUrl);
    setVideoSrc(formatted);
  };

  const handleVideoError = () => {
    // Fallback to sample video if Bunny Stream key is unreachable
    setVideoSrc('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F5F9FA] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-heading font-extrabold text-3xl text-gray-900 mb-2">Course Not Found</h2>
        <p className="text-gray-600 mb-6">The course you are looking for does not exist or has been moved.</p>
        <Link to="/courses" className="px-6 py-3 bg-primary-container text-white font-bold rounded-xl shadow">
          Back to Courses Catalog
        </Link>
      </div>
    );
  }

  const learningOutcomes = [
    "Understand core principles & modern algorithms of " + course.title + ".",
    "Execute live practical ad campaigns and marketing workflows.",
    "Master essential software tools and Generative AI frameworks.",
    "Develop real-world client lead generation systems.",
    "Build portfolio-ready projects demonstrating your expertise.",
    "Earn official digital certificate of completion upon finishing."
  ];

  const coverImg = store.formatBunnyStorageUrl(course.thumbnail, 'courses');

  return (
    <div className="bg-[#F5F9FA] min-h-screen pb-16">
      {/* Course Hero Banner */}
      <div className="bg-gradient-to-br from-[#001845] via-[#002B70] to-[#001845] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <Link to="/courses" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline uppercase tracking-wider mb-4">
            <ArrowLeft size={16} /> Back to Courses
          </Link>
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-400/30 text-xs font-bold uppercase rounded-md mb-3">
            {course.category}
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl max-w-4xl text-white mb-6">
            {course.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-xs md:text-sm text-gray-300">
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <User size={16} className="text-amber-400" /> Instructor: ClassConnect PRO Mentors
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Clock size={16} className="text-amber-400" /> {course.duration || '4 Weeks'}
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <BookOpen size={16} className="text-amber-400" /> {course.lessons || 16} Lessons
            </span>
            <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <BarChart size={16} className="text-amber-400" /> {course.level || 'Beginner to Advanced'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Left Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Interactive Unit Lecture Video Player */}
            <div className="bg-black rounded-3xl overflow-hidden shadow-xl border border-gray-800">
              <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                <video 
                  key={videoSrc}
                  controls 
                  autoPlay={false}
                  onError={handleVideoError}
                  poster={coverImg}
                  className="w-full h-full object-cover"
                >
                  <source src={videoSrc} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="p-5 bg-gray-900 text-white flex items-center justify-between border-t border-gray-800">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Video size={13} /> Active Lecture Stream
                  </span>
                  <h3 className="font-heading font-extrabold text-base text-white">{activeLesson?.title}</h3>
                </div>
                <span className="text-xs font-mono text-gray-400 bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">
                  {activeLesson?.duration || '15:00'}
                </span>
              </div>
            </div>

            {/* Unit Curriculum List */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-200 space-y-4">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900 flex items-center gap-2">
                <Layers className="text-amber-500" size={24} /> Unit-Wise Course Curriculum
              </h2>

              <div className="space-y-4">
                {defaultUnits.map((unit, uIdx) => (
                  <div key={uIdx} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <h4 className="font-heading font-extrabold text-sm text-primary-container uppercase tracking-wider">
                        {unit.title || `Unit ${unit.unitNumber}`}
                      </h4>
                      <span className="text-xs font-bold text-gray-500">{unit.lessons?.length || 0} Lectures</span>
                    </div>

                    <div className="space-y-2">
                      {unit.lessons?.map((les, lIdx) => {
                        const isCurrent = activeLesson?.id === les.id;
                        return (
                          <div 
                            key={lIdx}
                            onClick={() => handleSelectLesson(les)}
                            className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                              isCurrent 
                                ? 'bg-amber-500/10 border-amber-500 text-amber-900 font-bold shadow-sm' 
                                : 'bg-white border-gray-200/80 hover:bg-amber-50/50 text-gray-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${isCurrent ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <Play size={14} />
                              </div>
                              <span className="text-xs font-semibold">{les.title}</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-mono text-gray-500">{les.duration}</span>
                              {les.isFreePreview ? (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded uppercase">Preview</span>
                              ) : (
                                <Lock size={12} className="text-gray-400" />
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

            {/* Course Overview */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-200">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900 mb-4">Course Overview</h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">{course.description}</p>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                This comprehensive masterclass provides a complete step-by-step roadmap to master {course.title}. You will gain both theoretical understanding and hands-on execution skills with 2026 industry standards.
              </p>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-200">
              <h2 className="font-heading font-extrabold text-2xl text-gray-900 mb-6">What You Will Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {learningOutcomes.map((outcome, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F5F9FA] border border-gray-200/70">
                    <CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm font-medium text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Right */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md">
              <span className="text-xs font-bold uppercase text-gray-400 tracking-wider block mb-1">Pricing & Packages</span>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-heading font-extrabold text-3xl text-gray-900">₹{(course.price || 1499).toLocaleString('en-IN')}</span>
                {course.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{(course.originalPrice || 2999).toLocaleString('en-IN')}</span>
                )}
              </div>

              <h3 className="font-heading font-extrabold text-base text-gray-900 mb-3">Included In Package Bundles:</h3>
              {packages.length > 0 ? (
                <div className="space-y-3">
                  {packages.map(pkg => (
                    <div key={pkg.id} className="p-4 rounded-2xl bg-[#F5F9FA] border border-gray-200 flex items-center justify-between">
                      <div>
                        <h4 className="font-heading font-bold text-sm text-gray-900">{pkg.name}</h4>
                        <p className="text-xs font-bold text-amber-600">₹{pkg.price.toLocaleString('en-IN')}</p>
                      </div>
                      <Link to={`/register?package=${pkg.id}`} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-xs uppercase rounded-xl shadow">
                        Enroll Now
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">Available in Platinum & Diamond bundles.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
