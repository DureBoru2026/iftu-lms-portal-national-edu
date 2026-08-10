import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck, Sparkles, Globe, Award, Share2 } from 'lucide-react';

export const BBOTimsLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dim = size === 'sm' ? 'w-14 h-14' : size === 'lg' ? 'w-28 h-28' : 'w-20 h-20';
  
  return (
    <div className={`${dim} relative shrink-0 flex items-center justify-center bg-blue-900 p-0.5 rounded-full border-4 border-yellow-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group hover:scale-105 transition-transform`}>
      <svg viewBox="0 0 200 200" className="w-full h-full rounded-full">
        {/* Outer Dark Blue Base */}
        <circle cx="100" cy="100" r="98" fill="#0c3a82" stroke="#facc15" strokeWidth="4" />
        
        {/* White Text Ring */}
        <circle cx="100" cy="100" r="82" fill="none" stroke="#ffffff" strokeWidth="24" />
        
        {/* Curved Path for Text */}
        <path id="textPathTop" d="M 28,100 A 72,72 0 1,1 172,100" fill="none" />
        
        <text className="text-[13px] font-black fill-[#0c3a82] tracking-widest uppercase">
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            BIIROO BARNOOTAA OROMIYAA
          </textPath>
        </text>

        {/* Inner Deep Blue Center */}
        <circle cx="100" cy="100" r="62" fill="#0d419d" stroke="#facc15" strokeWidth="3" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />

        {/* Open Book Emblem */}
        <g transform="translate(100, 100) scale(1.4)">
          {/* Book Outer Cover */}
          <path d="M-22,6 C-12,2 -4,5 0,10 C4,5 12,2 22,6 L22,-14 C12,-18 4,-15 0,-10 C-4,-15 -12,-18 -22,-14 Z" fill="#ffffff" stroke="#0c3a82" strokeWidth="2" strokeLinejoin="round" />
          {/* Spine */}
          <path d="M0,-10 L0,10" stroke="#0c3a82" strokeWidth="2.5" />
          {/* Left Page Lines */}
          <line x1="-16" y1="-6" x2="-6" y2="-4" stroke="#0c3a82" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-16" y1="-1" x2="-6" y2="1" stroke="#0c3a82" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="-16" y1="4" x2="-6" y2="6" stroke="#0c3a82" strokeWidth="1.5" strokeLinecap="round" />
          {/* Right Page Lines */}
          <line x1="6" y1="-4" x2="16" y2="-6" stroke="#0c3a82" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="1" x2="16" y2="-1" stroke="#0c3a82" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="6" y1="6" x2="16" y2="4" stroke="#0c3a82" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export const BBOTimsBanner: React.FC<{ variant?: 'full' | 'card' }> = ({ variant = 'full' }) => {
  const [copied, setCopied] = useState(false);
  const timsUrl = "https://tmis.oeb.gov.et/";
  const shareText = "📢 BIIROO BARNOOTAA OROMIYAA (BBO) - TMIS PORTAL\nBarsiisoonni dhimma jijjiirraa (Teacher Transfer), galmee fi eeyyama barsiisummaa guutuuf kallattiin moosaajii TMIS kanatti fayyadamaa:\n👉 https://tmis.oeb.gov.et/";

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(timsUrl)}&text=${encodeURIComponent(shareText)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(timsUrl)}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${shareText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(timsUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'card') {
    return (
      <div 
        onClick={handleOpenDirect}
        className="bg-gradient-to-br from-red-950 via-neutral-900 to-black text-white border-8 border-black rounded-[3.5rem] p-8 shadow-[20px_20px_0px_0px_rgba(220,38,38,0.4)] flex flex-col justify-between gap-6 hover:translate-y-[-4px] transition-all cursor-pointer relative overflow-hidden group"
      >
        {/* Subtle Oromia Flag Accent Line top border */}
        <div className="absolute top-0 left-0 right-0 h-3 flex">
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-black" />
        </div>

        <div className="space-y-4 relative z-10 mt-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BBOTimsLogo size="sm" />
              <div>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-xl font-black text-[9px] uppercase tracking-wider border border-black italic">
                  🌳 BBO Official TMIS Portal
                </span>
                <p className="text-[10px] font-black uppercase text-amber-300 mt-1">Biiroo Barnootaa Oromiyaa</p>
              </div>
            </div>
            <span className="bg-emerald-500 text-black font-black text-[9px] uppercase px-3 py-1 rounded-full border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Direct Access
            </span>
          </div>

          <h3 className="text-2xl font-black uppercase italic tracking-tight text-white leading-tight">
            Teacher Information Management System (TMIS)
          </h3>

          <div className="bg-amber-950/80 border-2 border-amber-400/60 p-3 rounded-2xl text-xs font-bold text-amber-100 leading-relaxed italic">
            📌 <strong className="text-yellow-300">Beeksisa Jijjiirraa Barsiisotaa:</strong> Barsiisoonni dhimma jijjiirraa guutuu fi galmee odeeffannoo BBO sakatta'uuf kallattiin seensa tokko malee fayyadamaa.
          </div>
        </div>

        <div className="pt-4 border-t-2 border-white/20 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2">
            <a 
              href={telegramShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-sky-500 hover:bg-sky-400 text-white p-2.5 rounded-xl border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
              title="Share to Telegram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.03 9.56c-.15.68-.56.84-1.13.53l-3.1-2.28-1.5 1.44c-.17.17-.31.31-.63.31l.22-3.16 5.75-5.19c.25-.22-.05-.35-.39-.13l-7.1 4.47-3.06-.96c-.67-.21-.68-.67.14-.99l11.97-4.62c.55-.2 1.04.13.86.83z"/>
              </svg>
            </a>

            <a 
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
              title="Share to Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          <a 
            href={timsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2.5 rounded-2xl border-2 border-black font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all flex items-center gap-2"
          >
            <Globe className="w-4 h-4" /> Bani TMIS Portal <span>→</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-black text-white border-[10px] border-black rounded-[4rem] md:rounded-[5rem] p-8 md:p-14 shadow-[30px_30px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden space-y-8 animate-fadeIn">
      {/* Flag accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-4 flex">
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-black" />
      </div>

      {/* Background Decorative Seals */}
      <div className="absolute -top-12 -right-12 text-[16rem] opacity-10 pointer-events-none select-none font-black text-amber-400">
        🌳
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10 pt-2">
        <div className="flex items-start md:items-center gap-6">
          <BBOTimsLogo size="lg" />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-yellow-400 text-black px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] italic">
                🌳 Biiroo Barnootaa Oromiyaa (BBO)
              </span>
              <span className="bg-emerald-400 text-black px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Aksesii Kallattii (Direct Public Access)
              </span>
              <span className="bg-red-600 text-white px-3 py-1 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-black">
                TMIS Official
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight text-white drop-shadow-md">
              Moosaajii Barsiisotaa (TMIS) Portal
            </h2>

            <p className="text-sm md:text-base font-bold text-amber-300 uppercase tracking-widest italic flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Teacher Information Management System • Oromia Education Bureau
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto shrink-0">
          <button
            onClick={handleCopy}
            className="flex-1 lg:flex-none bg-black/80 hover:bg-black text-amber-300 border-4 border-amber-400/50 px-6 py-4 rounded-3xl font-black uppercase text-xs shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center justify-center gap-2"
            title="Waraabbi Oduu & Link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Waraabbameera!' : 'Waraabi (Copy)'}
          </button>

          <a 
            href={timsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 lg:flex-none bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-5 rounded-3xl border-4 border-black font-black uppercase text-sm md:text-base shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 group"
          >
            <ExternalLink className="w-5 h-5 group-hover:scale-125 transition-transform" />
            <span>Bani TMIS Portal</span>
            <span className="text-xl">→</span>
          </a>
        </div>
      </div>

      {/* Teacher Transfer Special Bulletin Box */}
      <div className="bg-amber-950/90 border-4 border-amber-400/80 rounded-3xl p-6 md:p-8 space-y-4 backdrop-blur-md relative z-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-400/40 pb-4">
          <div className="flex items-center gap-3 text-yellow-300">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <h4 className="text-lg md:text-xl font-black uppercase italic text-yellow-300">
              📢 Beeksisa Haaromsaa: Dhimma Jijjiirraa Barsiisotaa (Teacher Transfer)
            </h4>
          </div>

          {/* Social Share Controls */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase text-amber-200 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" /> Qoodaa (Share):
            </span>
            <a 
              href={telegramShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2 rounded-xl border-2 border-black font-black text-xs flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.03 9.56c-.15.68-.56.84-1.13.53l-3.1-2.28-1.5 1.44c-.17.17-.31.31-.63.31l.22-3.16 5.75-5.19c.25-.22-.05-.35-.39-.13l-7.1 4.47-3.06-.96c-.67-.21-.68-.67.14-.99l11.97-4.62c.55-.2 1.04.13.86.83z"/>
              </svg>
              Telegram
            </a>

            <a 
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl border-2 border-black font-black text-xs flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:scale-105"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          </div>
        </div>

        <p className="text-sm md:text-base text-gray-100 font-medium leading-relaxed italic">
          Biiroo Barnootaa Oromiyaa (BBO) akka ibsetti, barsiisoonni dhimma jijjiirraa (Teacher Transfer) guutuuf, eeyyama barsiisummaa sakatta'uu fi odeeffannoo tajaajilaa isaanii haaromsuuf moosaajii TMIS kallattiin fayyadamuu danda'u. Linkii kana fayyadamuun ulaagaalee seensa tokko malee qaqqabaa:
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-black uppercase text-amber-300 bg-black/60 px-3 py-1 rounded-lg border border-amber-500/30">Official TMIS Link:</span>
            <a 
              href={timsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-yellow-300 font-mono font-black text-sm md:text-base underline hover:text-white transition-colors bg-black px-4 py-1.5 rounded-xl border border-yellow-400/40"
            >
              {timsUrl}
            </a>
          </div>

          <span className="text-xs font-bold text-amber-200 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-400/40">
            ✓ 2026 Sovereign Official Verified
          </span>
        </div>
      </div>
    </div>
  );
};

