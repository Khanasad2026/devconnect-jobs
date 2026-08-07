import React, { useState, useEffect } from 'react';
import { Sparkles, Briefcase, FileText, Search, Filter, RefreshCw, CheckCircle2 } from 'lucide-react';
import JobCard from './JobCard';
import AiAgentWidget from './AiAgentWidget';
import { jobApi, applicationApi } from '../services/api';

export default function CandidateDashboard({ user, onApplyClick }) {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recs, jobs, apps] = await Promise.all([
        jobApi.getRecommendations(user.userId).catch(() => []),
        jobApi.getAllJobs().catch(() => []),
        applicationApi.getCandidateApplications(user.userId).catch(() => []),
      ]);

      setRecommendedJobs(recs);
      setAllJobs(jobs);
      setMyApplications(apps);

      const appliedSet = new Set(apps.map((app) => app.jobId));
      setAppliedJobIds(appliedSet);
    } catch (err) {
      console.error('Failed to load candidate dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || job.jobRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-indigo-50/80 border border-indigo-100 p-8 rounded-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold mb-3 border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Job Matchmaking Active
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Roles Matching Your Skills
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium">
            Our recommendation engine matches your candidate skills against recruiter postings to calculate live match percentages.
          </p>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'recommendations'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" /> AI Recommended ({recommendedJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'explore'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-slate-500" /> Explore All ({allJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'applications'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-500" /> My Applications ({myApplications.length})
          </button>
        </div>

        <button
          onClick={loadData}
          className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 self-end sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Tab 1: AI Recommended Jobs */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Analyzing skills & jobs...</div>
          ) : recommendedJobs.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-500 space-y-3">
              <Sparkles className="w-10 h-10 text-indigo-600 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">No Matched Jobs Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Update your candidate skills in your profile (e.g. Java, Spring Boot, React) to get personalized job recommendations!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedJobs.map((rec) => (
                <JobCard
                  key={rec.job.id}
                  item={rec}
                  isApplied={appliedJobIds.has(rec.job.id)}
                  onApply={onApplyClick}
                  userRole="CANDIDATE"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Explore All Jobs */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search job title, location, keywords..."
                className="form-input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                className="form-select text-sm py-2"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="SDE">Software Engineer (SDE)</option>
                <option value="DATA_ANALYST">Data Analyst</option>
                <option value="PRODUCT_MANAGER">Product Manager</option>
                <option value="DEVOPS">DevOps</option>
                <option value="UI_UX">UI / UX</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-500">Loading open jobs...</div>
          ) : filteredJobs.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-500">
              No jobs found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  item={job}
                  isApplied={appliedJobIds.has(job.id)}
                  onApply={onApplyClick}
                  userRole="CANDIDATE"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Applications */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Loading your applications...</div>
          ) : myApplications.length === 0 ? (
            <div className="glass-panel p-12 text-center text-slate-500 space-y-2">
              <FileText className="w-10 h-10 text-indigo-600 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900">No Applications Submitted</h3>
              <p className="text-sm">Explore open jobs and apply with 1-click!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                    {app.coverLetter && (
                      <p className="text-xs text-slate-700 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-200 max-w-xl">
                        "{app.coverLetter}"
                      </p>
                    )}
                  </div>

                  <div>
                    <span
                      className={`badge py-1.5 px-3 text-xs font-bold ${
                        app.status === 'OFFERED'
                          ? 'badge-status-offered'
                          : app.status === 'SHORTLISTED'
                          ? 'badge-status-shortlisted'
                          : app.status === 'INTERVIEWING'
                          ? 'badge-status-interviewing'
                          : app.status === 'REJECTED'
                          ? 'badge-status-rejected'
                          : 'badge-status-applied'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating AI Career Assistant Agent */}
      <AiAgentWidget candidateId={user?.userId} jobs={allJobs} />
    </div>
  );
}
