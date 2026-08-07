import React, { useState } from 'react';
import { X, Send, Link2, FileText, CheckCircle2 } from 'lucide-react';
import { applicationApi } from '../services/api';

export default function ApplyModal({ isOpen, onClose, job, candidateId, onApplicationSubmitted }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await applicationApi.applyToJob(candidateId, {
        jobId: job.id,
        coverLetter,
        resumeUrl,
      });

      setSuccess(true);
      if (onApplicationSubmitted) onApplicationSubmitted(job.id);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-content relative max-w-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
            Applying to Role
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1">{job.title}</h2>
          <p className="text-sm text-slate-400 mt-1">{job.location} • {job.salary}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        {success ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
            <p className="text-sm text-slate-400">The recruiter has been notified of your application.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" /> Cover Letter / Intro Note
              </label>
              <textarea
                rows={4}
                required
                className="form-textarea"
                placeholder="Explain why you are a strong candidate for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-indigo-400" /> Resume Link (Leave empty to use profile resume)
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://drive.google.com/your_resume.pdf"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
              />
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-slate-800">
              <button type="button" onClick={onClose} className="btn btn-secondary text-sm">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary text-sm flex items-center gap-2">
                <Send className="w-4 h-4" /> {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
