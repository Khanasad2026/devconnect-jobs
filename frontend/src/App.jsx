import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import ApplyModal from './components/ApplyModal';
import PostJobModal from './components/PostJobModal';
import ApplicantsModal from './components/ApplicantsModal';
import CandidateDashboard from './components/CandidateDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';

import { getUserInfo, clearAuthData } from './services/api';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [selectedApplyJob, setSelectedApplyJob] = useState(null);
  const [selectedApplicantsJob, setSelectedApplicantsJob] = useState(null);

  useEffect(() => {
    const savedUser = getUserInfo();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogout = () => {
    clearAuthData();
    setUser(null);
  };

  const handleSwitchRole = () => {
    if (!user) return;
    const newRole = user.role === 'CANDIDATE' ? 'RECRUITER' : 'CANDIDATE';
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onSwitchRole={handleSwitchRole}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {!user ? (
          /* Clean Light Mode Landing Screen */
          <div className="py-12 text-center space-y-8 animate-fade-in max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" /> AI-Powered Tech Recruitment Platform
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Connect Skills to <span className="text-indigo-600">Great Tech Careers</span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              DevConnect Jobs uses a real-time Skill Matchmaking Algorithm to pair candidate tech stacks with recruiter requirements instantly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsAuthOpen(true)}
                className="btn btn-primary py-3.5 px-8 text-base flex items-center gap-2"
              >
                Get Started Now <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
              <div className="glass-panel p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Skill Matchmaking</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Calculates instant % compatibility scores between candidate skills and job listings.
                </p>
              </div>

              <div className="glass-panel p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Recruiter Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Post tech jobs, review applicants, inspect cover notes, and manage hiring pipeline stages.
                </p>
              </div>

              <div className="glass-panel p-6 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Candidate Tracking</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Track real-time status updates (Shortlisted, Interviewing, Offered) for applied jobs.
                </p>
              </div>
            </div>
          </div>
        ) : user.role === 'CANDIDATE' ? (
          <CandidateDashboard
            user={user}
            onApplyClick={(job) => setSelectedApplyJob(job)}
          />
        ) : (
          <RecruiterDashboard
            user={user}
            onOpenPostJob={() => setIsPostJobOpen(true)}
            onOpenApplicants={(job) => setSelectedApplicantsJob(job)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        DevConnect Jobs Platform • Built with Java 17, Spring Boot 3.3, PostgreSQL (Neon Cloud) & React Vite
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(data) => {
          setUser({
            userId: data.userId,
            email: data.email,
            role: data.role,
            fullName: data.email.split('@')[0],
          });
        }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userId={user?.userId}
        onProfileUpdated={(updated) => {
          setUser((prev) => ({ ...prev, fullName: updated.fullName }));
        }}
      />

      <ApplyModal
        isOpen={!!selectedApplyJob}
        onClose={() => setSelectedApplyJob(null)}
        job={selectedApplyJob}
        candidateId={user?.userId}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        recruiterId={user?.userId}
        onJobCreated={() => {}}
      />

      <ApplicantsModal
        isOpen={!!selectedApplicantsJob}
        onClose={() => setSelectedApplicantsJob(null)}
        job={selectedApplicantsJob}
        recruiterId={user?.userId}
      />
    </div>
  );
}
