import React from 'react';
import { MapPin, DollarSign, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';

export default function JobCard({ item, matchScore, matchedSkills, onApply, isApplied, userRole }) {
  const job = item.job || item;
  const matchPct = matchScore ?? item.matchPercentage;
  const skillsList = matchedSkills || item.matchedSkills || [];

  return (
    <div className="glass-panel p-6 flex flex-col justify-between relative overflow-hidden group">
      {matchPct !== undefined && matchPct > 0 && (
        <div className="absolute top-0 right-0 bg-indigo-50 border-b border-l border-indigo-200 px-3 py-1 rounded-bl-xl flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-700">{matchPct}% Match</span>
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
              {job.jobRole}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors">
              {job.title}
            </h3>
          </div>
        </div>

        <p className="text-slate-600 text-sm line-clamp-2 mt-2 leading-relaxed font-normal">
          {job.description}
        </p>

        {skillsList.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Matched Skills:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skillsList.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md font-medium"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="truncate">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Briefcase className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
            <span className="truncate">{job.experienceRequired}+ Yrs Exp</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>

        {userRole === 'CANDIDATE' && (
          isApplied ? (
            <span className="badge badge-status-applied flex items-center gap-1 py-1.5 px-3 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Applied
            </span>
          ) : (
            <button
              onClick={() => onApply(job)}
              className="btn btn-primary text-xs py-2 px-4"
            >
              Apply Now
            </button>
          )
        )}
      </div>
    </div>
  );
}
