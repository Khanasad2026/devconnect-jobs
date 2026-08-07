import React, { useState } from 'react';
import { Bot, Sparkles, X, Send, FileText, CheckCircle2, HelpCircle, BookOpen } from 'lucide-react';
import { aiApi } from '../services/api';

export default function AiAgentWidget({ candidateId, jobs }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('ANALYZE_SKILLS');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState(false);

  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRunAgent = async (actionOverride, promptOverride) => {
    setLoading(true);
    const action = actionOverride || activeMode;
    const prompt = promptOverride || userPrompt;

    try {
      const res = await aiApi.interact(action, candidateId, selectedJobId || null, prompt, apiKey);
      setAiResponse(res);
    } catch (err) {
      setAiResponse({
        responseText: '🤖 AI Agent: ' + (err.message || 'Unable to connect to AI Agent service.'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating AI Agent Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!aiResponse && candidateId) {
            handleRunAgent('ANALYZE_SKILLS');
          }
        }}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-4 py-3 rounded-full shadow-2xl hover:shadow-indigo-500/40 flex items-center gap-2.5 transition-all duration-300 hover:scale-105 border border-white/20"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="text-sm">AI Career Agent 🤖</span>
      </button>

      {/* AI Agent Modal Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-modal flex flex-col max-h-[80vh]">
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-none">DevConnect AI Agent</h3>
                <span className="text-[10px] text-indigo-200 font-semibold">Live Google Gemini 1.5 LLM</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 text-xs font-semibold px-2 border border-white/20"
                title="Configure Live Gemini API Key"
              >
                🔑 Key
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showKeyInput && (
            <div className="p-3 bg-indigo-50 border-b border-indigo-200 text-xs space-y-1.5">
              <label className="font-bold text-indigo-900 block">Live Google Gemini API Key (Free):</label>
              <input
                type="password"
                placeholder="Paste Gemini API Key (AIStudio)..."
                className="form-input text-xs py-1"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  localStorage.setItem('gemini_api_key', e.target.value);
                }}
              />
              <p className="text-[10px] text-indigo-700">
                ✨ Free API keys available at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold">aistudio.google.com</a>
              </p>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 p-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveMode('ANALYZE_SKILLS');
                handleRunAgent('ANALYZE_SKILLS');
              }}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition-all ${
                activeMode === 'ANALYZE_SKILLS'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Skill Gap
            </button>

            <button
              onClick={() => {
                setActiveMode('COVER_LETTER');
              }}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition-all ${
                activeMode === 'COVER_LETTER'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Cover Note
            </button>

            <button
              onClick={() => {
                setActiveMode('INTERVIEW_PREP');
                handleRunAgent('INTERVIEW_PREP');
              }}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1 transition-all ${
                activeMode === 'INTERVIEW_PREP'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Interview Prep
            </button>
          </div>

          {/* Agent Output Box */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[220px]">
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-xs font-semibold space-y-2">
                <Bot className="w-8 h-8 text-indigo-600 animate-bounce mx-auto" />
                <p>AI Agent is analyzing profile & data...</p>
              </div>
            ) : aiResponse ? (
              <div className="space-y-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {aiResponse.responseText}
                </div>

                {aiResponse.suggestedSkillsToLearn && aiResponse.suggestedSkillsToLearn.length > 0 && (
                  <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-100 text-xs">
                    <span className="font-bold text-indigo-900 block mb-1">Recommended Tech Stack to Learn:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiResponse.suggestedSkillsToLearn.map((skill, idx) => (
                        <span key={idx} className="bg-white text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-200">
                          + {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Mode Controls / Action Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
            {activeMode === 'COVER_LETTER' && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 block">Select target job to generate letter:</label>
                <select
                  className="form-select text-xs py-1.5"
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                >
                  <option value="">-- Choose Job Listing --</option>
                  {jobs && jobs.map((j) => (
                    <option key={j.id} value={j.id}>{j.title} ({j.location})</option>
                  ))}
                </select>
                <button
                  onClick={() => handleRunAgent('GENERATE_COVER_LETTER')}
                  className="btn btn-primary w-full text-xs py-2"
                >
                  Generate AI Cover Letter
                </button>
              </div>
            )}

            {activeMode === 'CHAT' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunAgent('CHAT');
                  setUserPrompt('');
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask AI Career Agent anything..."
                  className="form-input text-xs py-2 flex-1"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                />
                <button type="submit" className="btn btn-primary text-xs py-2 px-3">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
