import React, { useState } from 'react';
import { X, PlusCircle, Briefcase, DollarSign, MapPin, Code } from 'lucide-react';
import { jobApi } from '../services/api';

export default function PostJobModal({ isOpen, onClose, recruiterId, onJobCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [experienceRequired, setExperienceRequired] = useState(1);
  const [jobRole, setJobRole] = useState('SDE');
  const [jobType, setJobType] = useState('FULL_TIME');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newJob = await jobApi.createJob(recruiterId, {
        title,
        description,
        location,
        salary,
        experienceRequired: parseInt(experienceRequired, 10),
        jobRole,
        jobType,
      });

      if (onJobCreated) onJobCreated(newJob);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in">
      <div className="modal-content relative max-w-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white p-1">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Post a New Job Opportunity</h2>
            <p className="text-xs text-slate-400">Specify skills in description to trigger candidate matchmaking</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Job Title</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Senior Java Backend Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Domain Role</label>
              <select
                className="form-select"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
              >
                <option value="SDE">Software Engineer (SDE)</option>
                <option value="DATA_ANALYST">Data Analyst / Scientist</option>
                <option value="PRODUCT_MANAGER">Product Manager</option>
                <option value="DEVOPS">DevOps / Cloud</option>
                <option value="UI_UX">UI / UX Designer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select
                className="form-select"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description & Required Skills</label>
            <textarea
              rows={4}
              required
              className="form-textarea"
              placeholder="Detail responsibilities and required tech stack (e.g. Java, Spring Boot, PostgreSQL, Docker)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Bangalore / Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Salary Package</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="15-25 LPA"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Experience (Yrs)</label>
              <input
                type="number"
                min="0"
                required
                className="form-input"
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="btn btn-secondary text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary text-sm flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> {loading ? 'Posting...' : 'Publish Job Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
