import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, Briefcase, MapPin, DollarSign, RefreshCw, Eye } from 'lucide-react';
import { jobApi, applicationApi } from '../services/api';

export default function RecruiterDashboard({ user, onOpenPostJob, onOpenApplicants }) {
  const [jobs, setJobs] = useState([]);
  const [applicantCounts, setApplicantCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadRecruiterJobs();
    }
  }, [user]);

  const loadRecruiterJobs = async () => {
    setLoading(true);
    try {
      const allJobs = await jobApi.getAllJobs();
      // Filter jobs posted by this recruiter
      const myJobs = allJobs.filter((job) => job.recruiterId === user.userId);
      setJobs(myJobs);

      // Fetch applicant counts for each job
      const counts = {};
      await Promise.all(
        myJobs.map(async (job) => {
          try {
            const apps = await applicationApi.getJobApplicants(job.id, user.userId);
            counts[job.id] = apps.length;
          } catch {
            counts[job.id] = 0;
          }
        })
      );
      setApplicantCounts(counts);
    } catch (err) {
      console.error('Failed to load recruiter jobs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Recruiter Header Banner */}
      <div className="bg-purple-50/80 border border-purple-100 p-8 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold mb-3">
              <Briefcase className="w-3.5 h-3.5 text-purple-600" /> Recruiter Control Center
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Job Listings & Applicants
            </h1>
            <p className="text-slate-600 text-sm mt-1 font-medium">
              Review incoming applications, view match profiles, and update hiring stages.
            </p>
          </div>

          <button
            onClick={onOpenPostJob}
            className="btn btn-primary py-3 px-5 flex items-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-5 h-5" /> Post New Job
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Your Posted Listings ({jobs.length})
        </h2>
        <button
          onClick={loadRecruiterJobs}
          className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400">Loading listings...</div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-12 text-center text-slate-400 space-y-4">
          <Briefcase className="w-12 h-12 text-purple-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Jobs Published Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Click "Post New Job" to list your tech opportunity and start receiving applications.
          </p>
          <button onClick={onOpenPostJob} className="btn btn-primary py-2.5 px-5">
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel p-6 flex flex-col justify-between hover:border-purple-500/40 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded border border-purple-500/20">
                    {job.jobRole}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                    {job.jobType}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white">{job.title}</h3>
                <p className="text-slate-400 text-sm line-clamp-2 mt-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-medium text-slate-300 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    <span>{job.experienceRequired}+ Yrs</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>{applicantCounts[job.id] || 0} Applicant(s)</span>
                </div>

                <button
                  onClick={() => onOpenApplicants(job)}
                  className="btn btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-purple-400" /> Review Applicants
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
