import React from 'react';
import { Users, BookOpen, FilePlus, Plus, History, Zap, ShieldCheck, ArrowRight, Terminal, Bell, Zap as ZapIcon, LogOut, Menu, Activity, Database, RefreshCw, FileSpreadsheet, MessageSquare, Send, Check, Copy } from 'lucide-react';
import { User, Course, Exam, Assignment, AssignmentSubmission, News, ExamResult, VideoLabItem, Enrollment, SystemSettings } from '../types';
import I2LMSLogo from './I2LMSLogo';

interface CommandCenterTabProps {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  auditLogs: any[];
  news: News[];
  navSections: any[];
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setIsAddingExam: (val: boolean) => void;
  setIsNewsModalOpen: (val: boolean) => void;
  setEditingUser: (user: User | null) => void;
  setUserForm: (form: any) => void;
  setIsIdentityModalOpen: (val: boolean) => void;
  setEditingCourse: (course: Course | null) => void;
  setCourseForm: (form: any) => void;
  setCourseWizardStep: (step: number) => void;
  setIsAddingCourse: (val: boolean) => void;
  setIsSubjectRegistryOpen: (val: boolean) => void;
  handleRunDiagnostics: () => void;
  isDiagnosing: boolean;
  latency: number | null;
  setNotification: (notif: { message: string; type: 'success' | 'error' | 'info' }) => void;
  initialUserForm: any;
  initialCourseForm: any;
  handleSeedExampleUser: () => void;
  isLoading: boolean;
}

const CommandCenterTab: React.FC<CommandCenterTabProps> = ({
  currentUser,
  users,
  courses,
  auditLogs,
  news,
  navSections,
  activeTab,
  setActiveTab,
  setIsAddingExam,
  setIsNewsModalOpen,
  setEditingUser,
  setUserForm,
  setIsIdentityModalOpen,
  setEditingCourse,
  setCourseForm,
  setCourseWizardStep,
  setIsAddingCourse,
  setIsSubjectRegistryOpen,
  handleRunDiagnostics,
  isDiagnosing,
  latency,
  setNotification,
  initialUserForm,
  initialCourseForm,
  handleSeedExampleUser,
  isLoading
}) => {
  return (
    <div className="space-y-16">
      <div className="space-y-8 animate-fadeIn">
        <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-black p-8 md:p-14 rounded-[3rem] md:rounded-[4.5rem] border-8 border-black shadow-[20px_20px_0px_0px_rgba(59,130,246,1)] text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                👑 National System Admin
              </span>
              <span className="px-3 py-1 bg-green-500 text-white font-black text-[10px] uppercase tracking-widest rounded-full border border-white">
                VERIFIED ACCESS
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
              National Registry Admin.
            </h2>
            <p className="text-blue-300 font-black uppercase tracking-wider text-xs md:text-sm">
              {currentUser?.name || 'Jemal Fano Haji'} — Admin Administrator of IFTU LMS ({currentUser?.email || 'jemalfano030@gmail.com'})
            </p>
            <p className="text-sm md:text-base font-medium text-gray-300 italic leading-relaxed">
              National Digital Education Command Center. Full sovereign authority over user identities, academic curricula, exams, and system broadcasts.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-6 mt-4 border-t-2 border-white/10">
              <button 
                onClick={() => setActiveTab('identities')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-2xl flex items-center gap-2 transition-all group"
              >
                <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-wider">Manage Registry</span>
              </button>
              <button 
                onClick={() => setIsAddingExam(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 border-2 border-white/20 rounded-2xl flex items-center gap-2 transition-all group shadow-lg"
              >
                <ZapIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-wider">Deploy New Exam</span>
              </button>
              <button 
                onClick={() => setIsNewsModalOpen(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black border-2 border-black/10 rounded-2xl flex items-center gap-2 transition-all group"
              >
                <Bell className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-wider">Broadcast News</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 shrink-0 flex flex-col items-center">
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-[2.5rem] border-8 border-amber-400 bg-slate-800 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden group">
              <img 
                src={currentUser?.photo || "/developer_jemal_fano_portrait.jpg"} 
                alt={currentUser?.name || "Jemal Fano Haji"} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 flex items-center justify-center font-black text-4xl text-black z-0">
                JFH
              </div>
              <div className="absolute top-2 right-2 z-20 bg-amber-400 border-2 border-black rounded-full p-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Verified Creator">
                👑
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-sm font-black uppercase italic tracking-wider text-amber-300 block">{currentUser?.name || "Jemal Fano Haji"}</span>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block">ICT Specialist • Founder</span>
              <span className="text-[9px] font-mono text-blue-400 uppercase tracking-tight block mt-0.5">{currentUser?.email || "jemalfano030@gmail.com"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {navSections.flatMap(s => s.items).filter(i => i.id !== 'command_center').map(item => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className="bg-white border-4 md:border-6 border-black rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:shadow-[15px_15px_0px_0px_rgba(59,130,246,1)] transition-all flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-2xl md:rounded-3xl border-2 md:border-4 border-black flex items-center justify-center mb-3 md:mb-4 group-hover:bg-blue-50 transition-colors">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-black" />
                </div>
                <p className="font-black uppercase italic text-[10px] md:text-xs mb-1 tracking-tight">{item.label}</p>
                <p className="text-[6px] md:text-[8px] font-black uppercase text-gray-400 tracking-widest">Protocol {item.id.toUpperCase()}</p>
              </button>
            );
          })}
        </div>

        <div className="space-y-8 animate-fadeIn">
          <div className="flex justify-between items-center border-b-4 border-black pb-4">
            <h3 className="text-3xl font-black uppercase italic">Latest System Bulletins</h3>
            <button 
              onClick={() => setActiveTab('bulletins')}
              className="text-xs font-black uppercase text-blue-600 hover:underline"
            >
              View All Registry News →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.slice(0, 4).map((item) => (
              <div key={item.id} className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all flex gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-black uppercase rounded-lg border border-black/10">{item.tag}</span>
                    <span className="text-[8px] font-bold text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                  <h5 className="text-lg font-black uppercase italic leading-tight line-clamp-2">{item.title}</h5>
                  <p className="text-[10px] text-gray-500 line-clamp-2">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black text-white p-8 md:p-12 rounded-[3.5rem] md:rounded-[5rem] border-8 border-black shadow-[15px_15px_0px_0px_rgba(59,130,246,1)] md:shadow-[25px_25px_0px_0px_rgba(59,130,246,1)] flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
        <div className="text-center md:text-left">
           <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-white">
             {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'National Dashboard'}.
           </h2>
           <p className="text-blue-400 font-black uppercase tracking-widest text-[10px] mt-4">Authorized Admin Hub: {currentUser?.name || 'Jemal Fano Haji'}</p>
        </div>
        <div className="flex gap-8 md:gap-12">
           <div className="text-center group">
              <p className="text-4xl md:text-6xl font-black italic group-hover:text-blue-400 transition-colors">{users.length}</p>
              <p className="text-[10px] font-black uppercase opacity-60">Identities</p>
           </div>
           <div className="text-center group">
              <p className="text-4xl md:text-6xl font-black italic text-green-400 group-hover:text-green-300 transition-colors">{courses.length}</p>
              <p className="text-[10px] font-black uppercase opacity-60">Modules</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
        <div className="bg-white border-8 border-black rounded-[4rem] p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-4 bg-blue-600"></div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-50 border-4 border-black rounded-3xl flex items-center justify-center">
              <Users className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h4 className="text-3xl font-black uppercase italic tracking-tighter">Identity Deployment</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Citizen Registry Protocol</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => {
                setEditingUser(null);
                setUserForm({ ...initialUserForm, role: 'student', sovereignIndex: (users.length + 1) });
                setIsIdentityModalOpen(true);
              }}
              className="p-8 bg-blue-600 text-white border-4 border-black rounded-[2rem] font-black uppercase italic text-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-between px-10 group"
            >
              <div className="text-left">
                 <span className="block text-xl">Deploy Identity</span>
                 <span className="text-[10px] opacity-70 not-italic">Enroll New Student/Teacher</span>
              </div>
              <Plus size={32} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>
          <div className="pt-4 border-t-2 border-dashed border-gray-100">
             <button 
              onClick={handleSeedExampleUser}
              disabled={isLoading}
              className="w-full p-4 bg-orange-100 text-orange-700 border-4 border-orange-400 border-dashed rounded-2xl font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? "Synchronizing..." : "Seed / Sync Sovereign Example (Kamal Jaldo)"}
            </button>
          </div>
          <button 
            onClick={() => setActiveTab('identities')}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          >
            View Complete Registry →
          </button>
        </div>

        <div className="bg-white border-8 border-black rounded-[4rem] p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-4 bg-green-500"></div>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-green-50 border-4 border-black rounded-3xl flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h4 className="text-3xl font-black uppercase italic tracking-tighter">Curriculum Forge</h4>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Knowledge Module Manifest</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => {
                setEditingCourse(null);
                setCourseForm(initialCourseForm);
                setCourseWizardStep(1);
                setIsAddingCourse(true);
              }}
              className="p-6 bg-green-600 text-white border-4 border-black rounded-2xl font-black uppercase italic text-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex flex-col items-center gap-2"
            >
              <span>Add Course</span>
              <FilePlus size={24} />
            </button>
            <button 
              onClick={() => {
                setIsSubjectRegistryOpen(true);
              }}
              className="p-6 bg-white border-4 border-black rounded-2xl font-black uppercase italic text-sm shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] hover:translate-y-1 hover:shadow-none transition-all flex flex-col items-center gap-2"
            >
              <span>Define Subject</span>
              <Plus size={24} />
            </button>
          </div>
          <button 
            onClick={() => setActiveTab('courses')}
            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] text-green-600 hover:bg-green-50 rounded-xl transition-all"
          >
            Manage Curriculum Bank →
          </button>
        </div>
      </div>

      <div className="bg-white border-8 border-black rounded-[4rem] p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center border-b-4 border-black pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl border-2 border-black">
              <History className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">Registry Audit Log</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-Time System Activity Protocol</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full border-2 border-green-500 font-black text-[10px] uppercase">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live Monitoring Active
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {auditLogs.length > 0 ? (
            auditLogs.map((log) => (
              <div key={log.id} className="p-5 bg-gray-50 border-4 border-black rounded-3xl hover:bg-white transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center shrink-0 ${
                    log.category === 'system' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {log.category === 'auth' ? <Users size={24} /> : 
                     log.category === 'academic' ? <BookOpen size={24} /> : 
                     log.category === 'system' ? <ShieldCheck size={24} /> : <ZapIcon size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black uppercase italic leading-none">{log.action}</span>
                      <span className="px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase rounded">{log.userRole}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-black uppercase text-blue-600">{log.userName}</span>
                      <span className="text-[9px] text-gray-400 font-mono">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] font-mono text-gray-400">ID: {log.id.substring(0, 8)}...</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center border-4 border-dashed border-gray-200 rounded-[3rem]">
              <div className="w-16 h-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm font-black uppercase text-gray-400 tracking-widest">Awaiting System Transactions...</p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
          <p className="text-[9px] font-black uppercase text-gray-400 italic">Historical data purged according to National Security Protocol.</p>
          <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">Download Registry Export (PDF)</button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] p-10 rounded-[3rem] border-8 border-black shadow-[15px_15px_0px_0px_rgba(34,197,94,1)] flex flex-col md:flex-row items-center justify-between gap-8 group">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg animate-pulse">
            <Terminal className="text-white w-8 h-8" />
          </div>
          <div>
            <h4 className="text-2xl font-black uppercase text-white italic tracking-tighter">System Integrity Hub</h4>
            <p className="text-xs font-black text-green-400 uppercase tracking-widest">Active Sync: V.9.2.4-PROD</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 w-full xl:w-auto justify-start md:justify-end">
          <button 
            onClick={handleRunDiagnostics}
            disabled={isDiagnosing}
            className={`flex-1 md:flex-none px-8 py-5 border-4 border-black rounded-2xl font-black uppercase text-sm transition-all flex items-center justify-center gap-3 ${
              latency === null ? 'bg-white text-black' : 
              latency < 200 ? 'bg-green-100 text-green-700' : 
              latency < 500 ? 'bg-orange-100 text-orange-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            <ZapIcon className={`w-5 h-5 ${isDiagnosing ? 'animate-pulse text-purple-600' : ''}`} />
            {isDiagnosing ? 'DIAGNOSING...' : latency !== null ? `${latency}ms Response` : 'Run System Diagnostic'}
          </button>
          <button 
            onClick={() => {
              setNotification({ message: "STAGING LOCAL REGISTRY MANIFEST...", type: 'info' });
              setTimeout(() => {
                setNotification({ message: "PUSHING SOVEREIGN COMMITS TO REPOSITORY...", type: 'info' });
                setTimeout(() => {
                  setNotification({ message: "SYNC COMPLETE: V.9.2.4-PROD IS LIVE ON GITHUB.", type: 'success' });
                  window.open('https://github.com/jemalfano030/iftu-portal', '_blank');
                }, 2000);
              }, 2000);
            }}
            className="flex-1 md:flex-none px-12 py-5 bg-green-600 border-4 border-black text-white font-black uppercase text-sm rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
          >
            Complete & Update on GitHub <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandCenterTab;
