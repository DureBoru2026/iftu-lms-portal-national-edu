import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, Info, ChevronRight, Video, Megaphone, HelpCircle } from 'lucide-react';
import { dbService } from '../services/dbService';
import { News } from '../types';

interface PublicNewsFeedProps {
  onLogin: () => void;
}

const PublicNewsFeed: React.FC<PublicNewsFeedProps> = ({ onLogin }) => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<News | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchPublicNews = async () => {
      try {
        const data = await dbService.fetchNews();
        // Filter for public/important news or just show all as user requested "everyone to see"
        setNews(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching public news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicNews();
  }, []);

  const featuredTutorial = news.find(n => n.category === 'guide' || n.tag === 'VIDEO');

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Attempt to find any uploaded audio artifacts if possible, or use a default path
  useEffect(() => {
    // Path to the tutorial audio
    setAudioUrl('https://ais-dev-zyaq3mnjmkd55f6qamhtvh-107893339879.europe-west2.run.app/assets/audio/system_introduction.mp3');
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current && audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      
      // Error handling for missing audio file
      audioRef.current.onerror = () => {
        console.warn("Audio asset missing, falling back to Speech Synthesis");
        const utterance = new SpeechSynthesisUtterance("Welcome to IFTU National Digital Sovereign Education Center. This system provides secondary and TVET education modules. You can access courses, exams, and bulletins from the portal.");
        utterance.lang = 'en-US';
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      };
    }

    if (audioRef.current) {
      if (isPlaying) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setIsPlaying(false);
        } else {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } else {
        audioRef.current.play().catch(e => {
          console.error("Audio Playback Error, using Speech Synthesis:", e);
          const utterance = new SpeechSynthesisUtterance("Welcome to IFTU LMS. Please sign in to access your courses and exams.");
          utterance.lang = 'en-US';
          utterance.onend = () => setIsPlaying(false);
          window.speechSynthesis.speak(utterance);
          setIsPlaying(true);
        });
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="w-full space-y-12 py-12 px-6 bg-white/50 backdrop-blur-sm rounded-[4rem] border-8 border-black/5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-blue-900 leading-none">
            Beeksisa & <br/><span className="text-black">Qajeelfama.</span>
          </h2>
          <p className="text-xl font-bold text-gray-500 italic">Official Announcements & Video Guides.</p>
        </div>
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-yellow-400 border-8 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            📢
          </div>
          <div className="w-16 h-16 bg-blue-600 border-8 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            🎬
          </div>
        </div>
      </div>

      {/* Featured Video Tutorial Card */}
      {featuredTutorial && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group bg-black border-[10px] border-black rounded-[4rem] overflow-hidden shadow-[30px_30px_0px_0px_rgba(59,130,246,0.3)]"
        >
          <div className="aspect-video w-full bg-slate-900 relative">
            {featuredTutorial.video ? (
              <video 
                src={featuredTutorial.video}
                className="w-full h-full object-contain"
                poster={featuredTutorial.image}
                controls
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                <img 
                  src={featuredTutorial.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200"} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm"
                  alt=""
                />
                <div className="relative z-10 flex flex-col items-center gap-6 p-12 text-center">
                  <div className="w-24 h-24 bg-white border-8 border-black rounded-full flex items-center justify-center text-4xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                    🎥
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    IFTU LMS: Akkaataa itti fayyadama <br/>(Video Guide)
                  </h3>
                  <button className="bg-green-600 text-white px-12 py-5 rounded-[2rem] border-8 border-black font-black uppercase text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-2 hover:shadow-none transition-all flex items-center gap-4">
                    <Play fill="currentColor" /> Watch Now
                  </button>
                </div>
              </div>
            )}
            
            {/* Live Indicator Overlay */}
            <div className="absolute top-8 left-8 flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <span className="bg-black/80 backdrop-blur-md text-white px-4 py-1 rounded-lg border-2 border-white/20 text-[10px] font-black uppercase tracking-widest">
                Official Tutorial
              </span>
            </div>
          </div>

          <div className="p-10 md:p-16 bg-white border-t-[10px] border-black space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="bg-blue-900 text-white px-4 py-1 rounded-full border-2 border-black text-[10px] font-black uppercase">Guide</span>
              <span className="bg-yellow-400 text-black px-4 py-1 rounded-full border-2 border-black text-[10px] font-black uppercase">Sovereign System</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-black uppercase italic tracking-tighter">
              {featuredTutorial.title}
            </h3>
            <p className="text-xl font-bold text-gray-600 leading-relaxed italic">
              {featuredTutorial.content}
            </p>

            {/* Dedicated Audio Tutorial for non-logged in users */}
            <div className="pt-8 mt-8 border-t-4 border-black/5 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 border-2 border-black rounded-lg">
                    <Megaphone className="text-red-600" size={24} />
                  </div>
                  <h4 className="text-2xl font-black uppercase italic">Voice Guide Protocol // Sagalee Dubbisaa</h4>
               </div>
               
               <div className="bg-slate-900 border-8 border-black p-8 rounded-[3rem] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center gap-8 group">
                  <div className="relative">
                    <div className="w-24 h-24 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center text-4xl shadow-[5px_5px_0px_0px_rgba(0,0,0,0.2)] animate-pulse">
                      🎙️
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 border-2 border-black px-2 py-1 rounded-md text-[8px] font-black uppercase">Official</div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-4">
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                          <p className="text-blue-400 text-xs font-black uppercase tracking-widest">Tutorial Voiceover</p>
                          <p className="text-white text-xl font-bold italic tracking-tight">Akkaataa itti fayyadama IFTU LMS</p>
                       </div>
                       <Volume2 className="text-white/40" size={20} />
                    </div>
                    
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden border-2 border-black relative">
                       <motion.div 
                        animate={{ width: isPlaying ? '100%' : '0%' }}
                        transition={{ duration: 105, ease: "linear" }}
                        className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                       />
                    </div>
                    
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-white/50">
                      <span>{isPlaying ? 'PLAYING TUTORIAL...' : 'READY TO PLAY'}</span>
                      <span>1:45</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={toggleAudio}
                      className="w-20 h-20 bg-white text-black border-4 border-black rounded-3xl flex items-center justify-center hover:bg-yellow-400 transition-all hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                    >
                      {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>
                    <a 
                      href={audioUrl || '#'} 
                      download="IFTU_LMS_Tutorial.mp3"
                      className="w-20 h-20 bg-green-600 text-white border-4 border-black rounded-3xl flex items-center justify-center hover:bg-green-500 transition-all hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]"
                    >
                      <Volume2 size={32} />
                    </a>
                  </div>
               </div>
               
               <p className="text-sm font-bold text-gray-500 italic text-center">
                 "Sagalee kana dhaggeeffachuun akkaataa itti fayyadama sirna kanaa barachuu dandeessu."
               </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Other News Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.filter(n => n.id !== featuredTutorial?.id).map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border-8 border-black rounded-[3rem] overflow-hidden shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] flex flex-col group hover:-translate-y-2 transition-all"
          >
            {item.image && (
              <div className="h-48 border-b-8 border-black overflow-hidden relative">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <span className="bg-yellow-400 text-black px-3 py-1 rounded-lg border-2 border-black text-[10px] font-black uppercase tracking-widest">
                    {item.tag || 'Update'}
                  </span>
                </div>
              </div>
            )}
            <div className="p-8 space-y-4 flex-1 flex flex-col">
              <h4 className="text-2xl font-black uppercase italic text-blue-900 leading-none">{item.title}</h4>
              <p className="text-base font-bold text-gray-600 italic line-clamp-3 leading-tight">
                {item.summary}
              </p>
              <div className="mt-auto pt-6 flex justify-between items-center border-t-4 border-black/5">
                <span className="text-[10px] font-black uppercase text-gray-400">{item.date}</span>
                <button 
                  onClick={onLogin}
                  className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={onLogin}
          className="group relative px-12 py-6 bg-black text-white rounded-[2rem] border-8 border-black font-black uppercase text-xl shadow-[10px_10px_0px_0px_rgba(34,197,94,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-6 overflow-hidden"
        >
          <div className="absolute inset-0 bg-green-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10 flex items-center gap-4">
             <Info /> Gara Dashboardii Seeni
          </span>
          <ChevronRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PublicNewsFeed;
