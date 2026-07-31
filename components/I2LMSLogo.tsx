import React from 'react';
import { Sun } from 'lucide-react';

interface I2LMSLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const I2LMSLogo: React.FC<I2LMSLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { box: 'w-10 h-10', text: 'text-xl', sub: 'text-[7px]' },
    md: { box: 'w-14 h-14', text: 'text-3xl', sub: 'text-[9px]' },
    lg: { box: 'w-20 h-20', text: 'text-5xl', sub: 'text-[11px]' },
    xl: { box: 'w-28 h-28', text: 'text-6xl', sub: 'text-[13px]' },
  };

  const dim = sizeMap[size];

  return (
    <div 
      onClick={onClick} 
      className={`flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      <div className={`${dim.box} bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 rounded-2xl border-4 border-black flex items-center justify-center overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:scale-105 group-active:translate-y-1 transition-all shrink-0 relative`}>
        <img 
          src="/iftu_lms_logo.jpg" 
          alt="IFTU LMS Rising Sun Logo" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover z-10 relative"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-400 to-yellow-500 text-black z-0">
          <Sun className="w-2/3 h-2/3 text-amber-950 animate-spin-slow" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col shrink-0">
          <div className="flex items-center gap-2">
            <h1 className={`${dim.text} font-black uppercase tracking-tighter italic leading-none text-black dark:text-white flex items-center gap-1`}>
              IFTU <span className="text-amber-500">LMS</span>
            </h1>
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-2 border-black rounded-md text-[8px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
              <Sun size={10} className="text-black fill-yellow-300 animate-pulse" />
              ADUU GANAMA
            </span>
          </div>
          <span className={`${dim.sub} font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300 mt-1 flex items-center gap-1`}>
            <span>Rising Sun Education</span> • <span>National Sovereign Hub</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default I2LMSLogo;
