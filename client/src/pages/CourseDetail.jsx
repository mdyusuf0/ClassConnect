import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDetailApi, getPublicReviewsApi, submitReviewApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Shield,
  Star,
  PlayCircle,
  Eye,
  ArrowRight,
  X,
  MessageSquare,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function CourseDetail() {
  const { slugOrId } = useParams();
  const { isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewVideo, setPreviewVideo] = useState(null);

  // Reviews State
  const [reviewsData, setReviewsData] = useState({ averageRating: 0, totalReviews: 0, reviews: [] });
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  const fetchCourseData = async () => {
    setLoading(true);
    try {
      const res = await getCourseDetailApi(slugOrId);
      if (res.success && res.course) {
        setCourse(res.course);
        const revRes = await getPublicReviewsApi(res.course._id || res.course.id);
        if (revRes.success) {
          setReviewsData(revRes);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [slugOrId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userComment.trim() || !course) return;
    setSubmittingReview(true);
    setReviewMsg('');

    try {
      const courseId = course._id || course.id;
      const res = await submitReviewApi(courseId, {
        rating: userRating,
        comment: userComment,
      });

      if (res.success) {
        setReviewMsg('Your review has been submitted and is pending admin moderation!');
        setUserComment('');
      }
    } catch (err) {
      setReviewMsg(err.response?.data?.error || err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-6 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Course Not Found</h2>
        <Link to="/" className="btn btn-primary">Back to Course Catalog</Link>
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
              <span className="flex items-center gap-1.5 text-yellow-400 font-bold">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {reviewsData.averageRating || 4.8} ({reviewsData.totalReviews || 0} reviews)
              </span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Certificate Included</span>
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
              to={`/checkout/${course._id || course.id || course.slug}`}
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
      <div className="container mx-auto px-6 max-w-6xl space-y-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-400" /> Course Curriculum & Units
        </h2>

        {course.units?.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-2xl border border-white/10 text-slate-400 text-sm">
            Curriculum content is being updated by course instructors. Check back shortly.
          </div>
        ) : (
          <div className="space-y-4">
            {course.units?.map((unit, uIdx) => (
              <div key={unit.id || uIdx} className="card glass-panel rounded-2xl border border-white/10 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">{unit.title}</h3>
                  <span className="badge badge-sm badge-outline text-slate-400">{unit.lessons?.length || 0} Lessons</span>
                </div>
                {unit.description && <p className="text-xs text-slate-400">{unit.description}</p>}

                <div className="space-y-2 pt-2 border-t border-white/5">
                  {unit.lessons?.map((lesson, lIdx) => (
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

      {/* Ratings & Reviews Section */}
      <div className="container mx-auto px-6 max-w-6xl space-y-6 pt-6">
        <h2 className="text-2xl font-black text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" /> Student Ratings & Reviews
        </h2>

        {/* Submit Review Box */}
        {isAuthenticated && (
          <form onSubmit={handleReviewSubmit} className="card glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-white">Leave a Course Review</h3>
            {reviewMsg && (
              <div className="alert alert-info bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-xs">
                <span>{reviewMsg}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-semibold">Select Rating:</span>
              <div className="rating rating-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    type="radio"
                    name="rating-star"
                    checked={userRating === star}
                    onChange={() => setUserRating(star)}
                    className="mask mask-star-2 bg-yellow-400"
                  />
                ))}
              </div>
            </div>

            <textarea
              required
              rows={3}
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Share your learning experience and feedback on this course..."
              className="textarea textarea-bordered bg-slate-900/60 text-white text-xs border-white/10 w-full"
            ></textarea>

            <button
              type="submit"
              disabled={submittingReview}
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-0 font-bold gap-2 self-start"
            >
              {submittingReview ? <span className="loading loading-spinner loading-xs"></span> : <Send className="w-3.5 h-3.5" />}
              Submit Review
            </button>
          </form>
        )}

        {/* Approved Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewsData.reviews?.map((r) => (
            <div key={r.reviewId} className="card glass-panel p-5 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{r.userName}</span>
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
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
              <Link to={`/checkout/${course._id || course.id || course.slug}`} className="btn btn-sm btn-primary">Enroll Now</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
