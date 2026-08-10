import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createCourseApi, updateCourseApi, getAdminCourseByIdApi, uploadBunnyAssetApi } from '../../api/client';
import { BookOpen, Upload, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

const CATEGORIES = ['Web Development', 'Artificial Intelligence', 'Data Science', 'Mobile App Development', 'Cybersecurity', 'Cloud & DevOps'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

export default function AdminCourseForm() {
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    price: 99,
    category: 'Web Development',
    level: 'All Levels',
    isPublished: false,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const res = await getAdminCourseByIdApi(id);
          if (res.success && res.course) {
            setFormData({
              title: res.course.title || '',
              description: res.course.description || '',
              thumbnail: res.course.thumbnail || '',
              price: res.course.price || 0,
              category: res.course.category || 'Web Development',
              level: res.course.level || 'All Levels',
              isPublished: !!res.course.isPublished,
            });
          }
        } catch (err) {
          setError(err.message || 'Failed to load course details');
        } finally {
          setFetching(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditMode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBunnyUpload = async () => {
    setUploading(true);
    try {
      const res = await uploadBunnyAssetApi({
        filename: `${formData.title ? formData.title.toLowerCase().replace(/ /g, '_') : 'course'}_thumb.jpg`,
        folder: 'thumbnails',
      });
      if (res.success && res.result?.cdnUrl) {
        setFormData((prev) => ({ ...prev, thumbnail: res.result.cdnUrl }));
      }
    } catch (err) {
      setError('Bunny upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditMode) {
        const res = await updateCourseApi(id, formData);
        if (res.success) {
          navigate('/admin/courses');
        }
      } else {
        const res = await createCourseApi(formData);
        if (res.success) {
          const newId = res.course._id || res.course.id;
          navigate(`/admin/courses/${newId}/units`);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Saving course failed.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-indigo-500"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/courses" className="btn btn-circle btn-ghost btn-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">{isEditMode ? 'Edit Course Details' : 'Create New Course'}</h1>
          <p className="text-xs text-slate-400">Configure title, pricing, thumbnail CDN, and category settings.</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error bg-red-950/40 border border-red-500/30 text-red-300 rounded-xl text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="form-control">
          <label className="label text-xs font-semibold text-slate-300">Course Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Full Stack Web Development Masterclass"
            className="input input-bordered w-full bg-slate-900/60 text-white border-white/10 focus:border-indigo-500"
          />
        </div>

        <div className="form-control">
          <label className="label text-xs font-semibold text-slate-300">Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detailed course overview, learning goals, prerequisites..."
            className="textarea textarea-bordered w-full bg-slate-900/60 text-white border-white/10 focus:border-indigo-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label text-xs font-semibold text-slate-300">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="select select-bordered w-full bg-slate-900/60 text-white border-white/10"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label text-xs font-semibold text-slate-300">Skill Level</label>
            <select
              value={formData.level}
              onChange={(e) => handleChange('level', e.target.value)}
              className="select select-bordered w-full bg-slate-900/60 text-white border-white/10"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label text-xs font-semibold text-slate-300">Price ($ USD)</label>
            <input
              type="number"
              min={0}
              required
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              className="input input-bordered w-full bg-slate-900/60 text-white border-white/10 focus:border-indigo-500"
            />
          </div>

          <div className="form-control">
            <label className="label text-xs font-semibold text-slate-300">Publication Status</label>
            <label className="label cursor-pointer p-3 rounded-xl bg-slate-900/60 border border-white/10 justify-between">
              <span className="text-xs text-slate-300">Publish immediately to public catalog</span>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => handleChange('isPublished', e.target.checked)}
                className="toggle toggle-primary"
              />
            </label>
          </div>
        </div>

        {/* Thumbnail & Bunny CDN Upload */}
        <div className="form-control space-y-2">
          <label className="label text-xs font-semibold text-slate-300">Thumbnail Asset URL (Bunny CDN)</label>
          <div className="flex gap-3">
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => handleChange('thumbnail', e.target.value)}
              placeholder="https://classconnect.b-cdn.net/thumbnails/..."
              className="input input-bordered flex-1 bg-slate-900/60 text-white border-white/10 text-xs font-mono"
            />
            <button
              type="button"
              onClick={handleBunnyUpload}
              disabled={uploading}
              className="btn btn-outline border-white/10 text-indigo-400 hover:bg-indigo-600/20 gap-2 text-xs shrink-0"
            >
              {uploading ? <span className="loading loading-spinner loading-xs"></span> : <Upload className="w-4 h-4" />}
              Upload to Bunny.net
            </button>
          </div>
          {formData.thumbnail && (
            <div className="mt-2 p-2 bg-slate-900/60 rounded-xl border border-white/10 w-48">
              <span className="text-[10px] text-slate-400 block mb-1">Thumbnail Preview:</span>
              <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-28 object-cover rounded-lg" />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Link to="/admin/courses" className="btn btn-ghost text-slate-400">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-500/20"
          >
            {loading ? <span className="loading loading-spinner loading-sm"></span> : (
              <span className="flex items-center gap-2">
                {isEditMode ? 'Save Changes' : 'Create & Proceed to Units'} <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
