import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Info, Video, Megaphone, Users, GraduationCap, MapPin } from 'lucide-react';
import AboutPortal from './AboutPortal';
import PublicNewsFeed from './PublicNewsFeed';
import { User } from '../types';

interface HomePortalProps {
  onNavClick: (view: string) => void;
  currentUser: User | null;
}

const HomePortal: React.FC<HomePortalProps> = ({ onNavClick, currentUser }) => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-24 animate-fadeIn">
      {/* Sovereign Hero Section Reversion */}
      <section className="relative bg-white border-[6px] border-black rounded-[4rem] overflow-hidden shadow-[25px_25px_0px_0px_rgba(0,0,0,1)] group">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-green-50 opacity-40"></div>
        <div className="grid grid-cols-1 lg:grid-cols-1 items-center p-12 md:p-24 relative z-10 text-center space-y-12">
          <div className="space-y-10 max-w-4xl mx-auto">
             <div className="flex justify-center">
               <div className="relative">
                 <h1 className="text-6xl md:text-[9rem] font-black uppercase italic tracking-tighter leading-[0.8] text-black">
                   IFTU <span className="text-amber-500">LMS</span><br/>
                   <span className="text-green-500">SOVEREIGN</span><br/>
                   <span className="text-[#ff4d4d]">LEARNING</span><br/>
                   <span className="text-[#ff4d4d]">PLATFORM</span>
                 </h1>
                 <motion.div 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 10 }}
                    className="absolute -top-10 -right-20 hidden md:block"
                 >
                    <div className="text-[120px] filter drop-shadow-[5px_5px_0px_rgba(0,0,0,1)]">⚡</div>
                 </motion.div>
               </div>
             </div>

             <div className="flex justify-center">
                <button 
                  onClick={() => onNavClick('news')}
                  className="inline-flex items-center gap-3 bg-[#ff4d4d] border-4 border-black px-6 py-3 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                  <span className="text-white font-black uppercase text-[10px] tracking-widest">Latest Bulletin: IFTU National Server Cluster Upgraded →</span>
                </button>
             </div>

             <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-blue-900 leading-none">
               Empowering Ethiopia's <br/>Digital Generation.
             </h2>

             {/* Founder Badge */}
             <div className="flex justify-center pt-4">
                <div className="bg-white border-4 border-black rounded-3xl p-4 flex items-center gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full">
                  <div className="w-16 h-16 bg-yellow-400 border-4 border-black rounded-2xl flex items-center justify-center text-2xl font-black relative overflow-hidden">
                    JFH
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-600 border-t-2 border-l-2 border-black"></div>
                  </div>
                  <div className="text-left">
                    <p className="bg-black text-white text-[8px] font-black uppercase px-2 py-0.5 rounded inline-block mb-1">Lead Developer & Founder</p>
                    <p className="text-xl font-black uppercase italic leading-none">Jemal Fano Haji</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">jemalfano030@gmail.com • Sovereign System Architect</p>
                  </div>
                </div>
             </div>

             <div className="flex justify-center pt-8">
                <button 
                  onClick={() => onNavClick('login')}
                  className="px-16 py-7 bg-black text-white border-4 border-black rounded-[2.5rem] font-black uppercase text-2xl shadow-[10px_10px_0px_0px_rgba(59,130,246,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-6 group"
                >
                  Access Portal <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
          </div>
        </div>
      </section>

      {/* Secondary Headline */}
      <section className="space-y-6 pt-12">
        <div className="flex flex-wrap gap-3">
          <span className="px-4 py-1.5 bg-green-500 text-white border-4 border-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Aduu Ganama Academy</span>
          <span className="px-4 py-1.5 bg-yellow-400 text-black border-4 border-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Digital Sovereign Campus</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-black">
          School & Faculty <br/>Ecosystem.
        </h2>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-900/40">
          Empowering Ethiopian students, educators, and curriculum materials under one sovereign digital center.
        </p>
      </section>

      {/* System Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Enrolled Citizens', value: '12.4K+', color: 'bg-blue-100', icon: <Users size={32} /> },
           { label: 'Active Modules', value: '450+', color: 'bg-green-100', icon: <GraduationCap size={32} /> },
           { label: 'Knowledge Hubs', value: '32', color: 'bg-yellow-100', icon: <MapPin size={32} /> }
         ].map((stat, i) => (
           <div key={i} className={`${stat.color} border-8 border-black p-10 rounded-[3.5rem] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-4`}>
             <div className="w-16 h-16 bg-white border-4 border-black rounded-2xl flex items-center justify-center">
               {stat.icon}
             </div>
             <div>
                <p className="text-5xl font-black uppercase tracking-tighter">{stat.value}</p>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest italic">{stat.label}</p>
             </div>
           </div>
         ))}
      </section>

      {/* About Us Teaser Section */}
      <section className="bg-white border-[10px] border-black rounded-[5rem] p-12 md:p-24 shadow-[30px_30px_0px_0px_rgba(59,130,246,0.3)] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
         <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <span className="bg-black text-yellow-400 px-6 py-2 rounded-xl font-black uppercase text-xs tracking-widest border-4 border-black">Institutional Profile</span>
              <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-blue-900">
                Waa'ee <br/><span className="text-black">Keenya.</span>
              </h2>
            </div>
            <p className="text-2xl font-bold text-gray-600 italic leading-relaxed">
              IFTU LMS is Ethiopia's sovereign digital education gateway, designed to provide high-quality learning materials for secondary schools and TVET institutes.
            </p>
            <button 
              onClick={() => onNavClick('about')}
              className="group inline-flex items-center gap-6 text-3xl font-black uppercase italic tracking-tighter hover:text-blue-600 transition-all"
            >
              Discover our vision <ChevronRight size={40} className="group-hover:translate-x-3 transition-transform" />
            </button>
         </div>
         <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
            <div className="bg-slate-100 border-8 border-black rounded-[4rem] p-10 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] relative z-10 space-y-6 text-center">
               <div className="text-7xl">🤝</div>
               <p className="text-2xl font-black italic">"Education is the most powerful weapon which you can use to change the world."</p>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Digital Sovereignty // Secondary & TVET</p>
            </div>
         </div>
      </section>

      {/* News & Tutorial Highlights */}
      <section className="space-y-16">
        <div className="flex items-center gap-6">
           <Megaphone size={48} className="text-red-600" />
           <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">Bulletin Hub.</h2>
           <div className="h-4 grow bg-black/5 rounded-full"></div>
        </div>
        
        <PublicNewsFeed onLogin={() => onNavClick('login')} />
      </section>

      {/* Quick Action Footer */}
      <section className="bg-blue-900 border-[10px] border-black rounded-[5rem] p-12 md:p-24 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] text-white text-center space-y-12 overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none relative z-10">
           Ready to <br/><span className="text-yellow-400">Join the Registry?</span>
         </h2>
         <div className="flex flex-wrap justify-center gap-8 relative z-10">
            <button 
              onClick={() => onNavClick('login')}
              className="px-12 py-6 bg-white text-black border-4 border-black rounded-3xl font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] hover:translate-y-2 hover:shadow-none transition-all flex items-center gap-4"
            >
              Sign In Portal
            </button>
            <button 
              onClick={() => onNavClick('locator')}
              className="px-12 py-6 bg-black text-white border-4 border-black rounded-3xl font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(59,130,246,1)] hover:translate-y-2 hover:shadow-none transition-all flex items-center gap-4"
            >
              Find Nearby Campus
            </button>
         </div>
      </section>
    </div>
  );
};

export default HomePortal;
