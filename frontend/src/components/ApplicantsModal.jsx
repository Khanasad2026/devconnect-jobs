import React, { useState, useEffect } from 'react';
import { X, UserCheck, ExternalLink, FileText, CheckCircle2, Clock, XCircle, Award } from 'lucide-react';
import { applicationApi } from '../services/api';

export default function ApplicantsModal({ isOpen, onClose, job, recruiterId }) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (isOpen && job && recruiterId) {
      fetchApplicants();
    }
  }, [isOpen, job, recruiterId]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const data = await applicationApi.getJobApplicants(job.id, recruiterId);
      setApplicants(data);
    } catch (err) {
      console.error('Failed to fetch applicants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      const updated = await applicationApi.updateStatus(applicationId, newStatus, recruiterId);
      setApplicants((prev) =>
        prev.map((app) => (app.id === applicationId ? updated : app))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-content relative max-w-3xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Applicants for {job.title}</h2>
            <p className="text-xs text-slate-400">{applicants.length} Candidate(s) Applied</p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading applicants...</div>
        ) : applicants.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            <p className="font-semibold">No applications received yet for this listing.</p>
            <p className="text-xs mt-1 text-slate-500">Applications will appear here as candidates submit.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {applicants.map((app) => (
              <div
                key={app.id}
                className="glass-panel p-5 bg-slate-900/60 hover:border-purple-500/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white leading-tight">
                      {app.candidateName}
                    </h4>
                    <span className="text-xs text-slate-400">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      disabled={updatingId === app.id}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none transition-all cursor-pointer ${
                        app.status === 'OFFERED'
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : app.status === 'SHORTLISTED'
                          ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                          : app.status === 'INTERVIEWING'
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                          : 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                      }`}
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    >
                      <option value="APPLIED" className="bg-slate-900 text-white">APPLIED</option>
                      <option value="SHORTLISTED" className="bg-slate-900 text-white">SHORTLISTED</option>
                      <option value="INTERVIEWING" className="bg-slate-900 text-white">INTERVIEWING</option>
                      <option value="OFFERED" className="bg-slate-900 text-white">OFFERED</option>
                      <option value="REJECTED" className="bg-slate-900 text-white">REJECTED</option>
                    </select>
                  </div>
                </div>

                {app.coverLetter && (
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-slate-400 block mb-1">Cover Note:</span>
                    "{app.coverLetter}"
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 text-xs">
                  {app.resumeUrl ? (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> View Candidate Resume
                    </a>
                  ) : (
                    <span className="text-slate-500">No resume attached</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
