import React, { useState, useEffect } from 'react';
import { X, Sparkles, Save, User, GraduationCap, Link2, Code } from 'lucide-react';
import { profileApi } from '../services/api';

export default function ProfileModal({ isOpen, onClose, userId, onProfileUpdated }) {
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [college, setCollege] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile();
    }
  }, [isOpen, userId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await profileApi.getProfile(userId);
      setFullName(data.fullName || '');
      setTitle(data.title || '');
      setBio(data.bio || '');
      setSkills(data.skills || '');
      setCollege(data.college || '');
      setBranch(data.branch || '');
      setCgpa(data.cgpa || '');
      setResumeUrl(data.resumeUrl || '');
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const updated = await profileApi.updateProfile(userId, {
        fullName,
        title,
        bio,
        skills,
        college,
        branch,
        cgpa: cgpa ? parseFloat(cgpa) : null,
        resumeUrl,
      });

      setMessage('Profile & Skills updated! Recommendations re-calculated.');
      if (onProfileUpdated) onProfileUpdated(updated);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-content relative max-w-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Edit Professional Profile</h2>
            <p className="text-xs text-slate-400">Skills added here power your Job Matchmaking algorithm</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" /> {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center text-slate-400">Loading profile data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Khan Asad"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Job Title / Headline</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Software Developer"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-1.5 text-indigo-300 font-bold">
                <Code className="w-4 h-4 text-indigo-400" /> Technical Skills (Comma Separated)
              </label>
              <textarea
                rows={2}
                className="form-textarea border-indigo-500/40 focus:border-indigo-400"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Java, Spring Boot, PostgreSQL, React, REST APIs, Docker"
              />
              <span className="text-[11px] text-indigo-400/80">
                ✨ Matches with job postings containing these keywords.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">About / Bio</label>
              <textarea
                rows={2}
                className="form-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief summary of your expertise and career goals..."
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="form-group">
                <label className="form-label">College / Univ</label>
                <input
                  type="text"
                  className="form-input"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="IIT / Mumbai Univ"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Branch</label>
                <input
                  type="text"
                  className="form-input"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Computer Science"
                />
              </div>

              <div className="form-group">
                <label className="form-label">CGPA / Grade</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  placeholder="8.5"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Resume Link (PDF / Google Drive)</label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  className="form-input pl-9"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your_resume.pdf"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
              <button type="button" onClick={onClose} className="btn btn-secondary text-sm">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn btn-primary text-sm flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save & Sync Skills'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
