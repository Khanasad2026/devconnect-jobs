import React from 'react';
import { Briefcase, User, LogOut, Sparkles, PlusCircle, Repeat } from 'lucide-react';

export default function Navbar({ user, onLogout, onOpenAuth, onOpenProfile, onOpenPostJob, onSwitchRole }) {
  return (
    <header className="glass-nav sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/20">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xl tracking-tight text-slate-900">
            DevConnect
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-600" /> Jobs AI
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-full pl-1.5 pr-3.5 py-1">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-slate-800 leading-none block">{user.fullName || user.email}</span>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                  user.role === 'RECRUITER' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {user.role}
                </span>
              </div>
            </div>

            {user.role === 'CANDIDATE' && (
              <button 
                onClick={onOpenProfile} 
                className="btn btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                title="Edit Candidate Profile"
              >
                <User className="w-3.5 h-3.5 text-indigo-600" /> Profile & Skills
              </button>
            )}

            {user.role === 'RECRUITER' && (
              <button 
                onClick={onOpenPostJob} 
                className="btn btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Post Job
              </button>
            )}

            <button 
              onClick={onSwitchRole} 
              className="btn btn-secondary text-xs py-2 px-3 text-slate-600 hover:text-slate-900"
              title="Demo: Switch Role"
            >
              <Repeat className="w-3.5 h-3.5" /> Switch Role
            </button>

            <button 
              onClick={onLogout} 
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button onClick={onOpenAuth} className="btn btn-primary text-xs py-2 px-4">
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
}
