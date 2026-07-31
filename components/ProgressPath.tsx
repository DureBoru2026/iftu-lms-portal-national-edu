import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, Award, CheckCircle2, Lock, Zap, BookOpen, 
  Trophy, GraduationCap, ShieldCheck, ChevronRight, 
  Star, Target, Compass, Sparkles, ArrowUpRight
} from 'lucide-react';
import { User, Course } from '../types';
import I2LMSLogo from './I2LMSLogo';

interface ProgressPathProps {
  user: User;
  courses?: Course[];
  onNavigateToCourse?: (courseId: string) => void;
  onNavigateToExams?: () => void;
  onNavigateToShop?: () => void;
}

export interface Milestone {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  kpRequired: number;
  description: string;
  badgeName: string;
  badgeIcon: string;
  unlockedPerks: string[];
  color: string;
  bgGradient: string;
  accentBorder: string;
}

export const SOVEREIGN_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    level: 1,
    title: 'Aduu Ganama Genesis',
    subtitle: 'Morning Sun Scholar Enrolment',
    kpRequired: 0,
    description: 'The sunrise of sovereign education begins. Access essential Grade 11 & 12 curriculum tools.',
    badgeName: 'Rising Light Badge',
    badgeIcon: '☀️',
    unlockedPerks: ['Full Access to National Study Hall', 'Basic AI Tutor Queries', 'Standardized Profile Index'],
    color: 'amber',
    bgGradient: 'from-amber-500 to-yellow-600',
    accentBorder: 'border-amber-400'
  },
  {
    id: 'm2',
    level: 2,
    title: 'Oromia Regional Scholar',
    subtitle: 'Foundation Subject Competency',
    kpRequired: 300,
    description: 'Demonstrate subject mastery across regional academic modules & homework assignments.',
    badgeName: 'Regional Vanguard',
    badgeIcon: '📜',
    unlockedPerks: ['Unlock Sovereign Quiz Arena', 'Priority AI Tutor Response', 'Digital Certificate Verification'],
    color: 'green',
    bgGradient: 'from-emerald-600 to-green-700',
    accentBorder: 'border-emerald-400'
  },
  {
    id: 'm3',
    level: 3,
    title: 'Grade 12 National Contender',
    subtitle: 'EAES National Exam Readiness',
    kpRequired: 800,
    description: 'Score 75%+ across standardized national mock exams and complete core subject tracks.',
    badgeName: 'EAES Master Emblem',
    badgeIcon: '🎯',
    unlockedPerks: ['National Mock Exam Diagnostics', 'VIP Knowledge Shop Discounts', 'National Leaderboard Badge'],
    color: 'blue',
    bgGradient: 'from-blue-600 to-cyan-700',
    accentBorder: 'border-blue-400'
  },
  {
    id: 'm4',
    level: 4,
    title: 'Sovereign Laureate',
    subtitle: 'High Sovereign Index Distinction',
    kpRequired: 1500,
    description: 'Achieve high academic rank with over 1500 KP and multi-subject mastery certifications.',
    badgeName: 'Sovereign Laureate Ring',
    badgeIcon: '👑',
    unlockedPerks: ['Direct Faculty Mentorship Channel', 'Full Knowledge Shop VIP Access', 'Custom Sovereign Registry Shield'],
    color: 'purple',
    bgGradient: 'from-purple-600 to-indigo-800',
    accentBorder: 'border-purple-400'
  },
  {
    id: 'm5',
    level: 5,
    title: 'IFTU National Luminary',
    subtitle: 'Supreme Sovereign Education Elite',
    kpRequired: 2500,
    description: 'The highest pinnacle of national academic excellence. Recognized across the sovereign registry.',
    badgeName: 'National Luminary Sun Crest',
    badgeIcon: '🌟',
    unlockedPerks: ['Official Graduate Recommendation', 'Lifetime Academic Alumni Access', 'Gold Sovereign Trophy Emblem'],
    color: 'yellow',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-600',
    accentBorder: 'border-yellow-300'
  }
];

export const ProgressPath: React.FC<ProgressPathProps> = ({
  user,
  courses = [],
  onNavigateToCourse,
  onNavigateToExams,
  onNavigateToShop
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Determine user level and current progress
  const currentKp = user.points || 0;
  const currentMilestoneIndex = SOVEREIGN_MILESTONES.reduce((acc, m, idx) => {
    return currentKp >= m.kpRequired ? idx : acc;
  }, 0);

  const currentMilestone = SOVEREIGN_MILESTONES[currentMilestoneIndex];
  const nextMilestone = SOVEREIGN_MILESTONES[currentMilestoneIndex + 1] || null;

  const kpProgressToNext = nextMilestone 
    ? Math.min(100, Math.max(0, ((currentKp - currentMilestone.kpRequired) / (nextMilestone.kpRequired - currentMilestone.kpRequired)) * 100))
    : 100;

  const kpNeeded = nextMilestone ? nextMilestone.kpRequired - currentKp : 0;
  const sovereignIndexCode = user.sovereignIndex || `SOV-${(user.points || 0) * 7 + 1042}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 260, damping: 20 } 
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn font-sans">
      {/* Top Banner with Logo & Sovereign Identity */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 border-8 border-black rounded-[3.5rem] p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] text-black relative overflow-hidden">
        {/* Decorative background sunburst */}
        <div className="absolute -right-12 -bottom-12 opacity-15 pointer-events-none">
          <Sun size={320} className="text-black animate-spin-slow" />
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <I2LMSLogo size="sm" showText={false} />
              <span className="px-4 py-1 bg-black text-amber-300 border-2 border-black rounded-full font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]">
                Aduu Ganama Journey
              </span>
              <span className="px-4 py-1 bg-white text-black border-2 border-black rounded-full font-black text-xs uppercase tracking-widest">
                ID: {sovereignIndexCode}
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight leading-none drop-shadow-sm">
              Sovereign Progress Path
            </h2>
            <p className="text-sm md:text-base font-bold text-black/90 uppercase italic">
              Aduu Ganama ("Rising Morning Sun") Education Roadmap. Map your sovereign index, unlock milestones, and attain academic mastery.
            </p>
          </div>

          {/* User Status Card */}
          <div className="p-6 bg-white border-4 border-black rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6 shrink-0 w-full lg:w-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 border-4 border-black rounded-2xl flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 animate-pulse">
              {currentMilestone.badgeIcon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">CURRENT RANK LEVEL {currentMilestone.level}</p>
              <h3 className="text-2xl font-black text-black uppercase italic">{currentMilestone.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-black rounded-lg text-[10px] font-black uppercase">
                  ⚡ {currentKp} Knowledge Points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar to Next Rank */}
        {nextMilestone ? (
          <div className="mt-8 bg-white/90 border-4 border-black rounded-3xl p-5 space-y-2 relative z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-black uppercase gap-1">
              <span className="flex items-center gap-2">
                <Target size={16} className="text-amber-600" />
                Target: Level {nextMilestone.level} — {nextMilestone.title}
              </span>
              <span className="text-amber-800">
                {currentKp} / {nextMilestone.kpRequired} KP ({kpNeeded} KP Needed)
              </span>
            </div>
            <div className="h-5 bg-gray-200 border-2 border-black rounded-full overflow-hidden relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-yellow-500 border-r-2 border-black"
                initial={{ width: 0 }}
                animate={{ width: `${kpProgressToNext}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-black text-gray-700 uppercase pt-1">
              <span>Current: Level {currentMilestone.level} ({currentMilestone.kpRequired} KP)</span>
              <span>Next Milestone: Level {nextMilestone.level} ({nextMilestone.kpRequired} KP)</span>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-emerald-100 border-4 border-black rounded-3xl p-5 text-center text-emerald-950 font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            🌟 Maximum Sovereign Milestone Attained! You are an Official IFTU National Luminary.
          </div>
        )}
      </div>

      {/* Ethiopian Roadmap Section */}
      <div className="bg-white border-8 border-black rounded-[3.5rem] p-8 md:p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-black pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="text-amber-500 animate-spin-slow" size={24} />
              <span className="text-xs font-black uppercase tracking-widest text-amber-600">
                Sovereign Learning Vector Roadmap
              </span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black uppercase italic text-black mt-1">
              Academic Milestone Odyssey
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-900 border-2 border-black rounded-xl text-xs font-black uppercase">
              🟢 Active Path Verified
            </span>
          </div>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="relative py-8">
          {/* Vertical/Horizontal Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-4 bg-gray-200 border-2 border-black rounded-full -translate-y-1/2 z-0">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-yellow-500"
              initial={{ width: '0%' }}
              animate={{ 
                width: `${Math.min(100, ((currentMilestoneIndex + (kpProgressToNext / 100)) / (SOVEREIGN_MILESTONES.length - 1)) * 100)}%` 
              }}
              transition={{ duration: 1.2 }}
            />
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10"
          >
            {SOVEREIGN_MILESTONES.map((m, idx) => {
              const isPassed = currentKp >= m.kpRequired;
              const isCurrent = currentMilestoneIndex === idx;
              const isLocked = currentKp < m.kpRequired;

              return (
                <motion.div
                  key={m.id}
                  variants={itemVariants}
                  whileHover={{ y: isCurrent ? -16 : -8, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMilestone(m)}
                  className={`cursor-pointer group flex flex-col justify-between p-6 rounded-[2.5rem] border-4 border-black transition-all ${
                    isCurrent 
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-300 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ring-4 ring-black ring-offset-4' 
                      : isPassed
                      ? 'bg-emerald-50 hover:bg-emerald-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-gray-100 opacity-75 hover:opacity-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Level Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`w-10 h-10 rounded-2xl border-2 border-black font-black text-sm flex items-center justify-center ${
                        isCurrent 
                          ? 'bg-black text-amber-300 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]' 
                          : isPassed 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {m.level}
                      </span>
                      {isPassed ? (
                        <span className="px-2.5 py-1 bg-emerald-500 text-white border-2 border-black rounded-full font-black text-[9px] uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <CheckCircle2 size={12} /> UNLOCKED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-gray-300 text-gray-700 border-2 border-black rounded-full font-black text-[9px] uppercase flex items-center gap-1">
                          <Lock size={12} /> {m.kpRequired} KP
                        </span>
                      )}
                    </div>

                    {/* Milestone Icon & Title */}
                    <div className="space-y-2">
                      <div className="w-16 h-16 rounded-3xl border-4 border-black bg-white flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto group-hover:scale-110 transition-transform">
                        {m.badgeIcon}
                      </div>
                      <h4 className="text-xl font-black uppercase italic text-center text-black leading-tight">
                        {m.title}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-600 uppercase text-center line-clamp-2">
                        {m.subtitle}
                      </p>
                    </div>

                    {/* Requirements / Perks summary */}
                    <div className="pt-3 border-t-2 border-black/10 text-center">
                      <p className="text-[9px] font-black uppercase tracking-wider text-black/70">
                        {m.kpRequired === 0 ? 'Entry Level' : `Requires ${m.kpRequired} KP`}
                      </p>
                    </div>
                  </div>

                  <button className={`mt-6 w-full py-2.5 rounded-xl border-2 border-black font-black uppercase italic text-xs flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors ${
                    isCurrent 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : isPassed 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-200'
                  }`}>
                    <span>View Details</span>
                    <ChevronRight size={14} />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Action Grid: Ways to Earn KP & Progress */}
        <div className="bg-gray-50 border-4 border-black rounded-[2.5rem] p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="px-3 py-1 bg-amber-400 text-black border-2 border-black rounded-lg text-[10px] font-black uppercase">
                BOOST YOUR SOVEREIGN INDEX
              </span>
              <h4 className="text-2xl font-black uppercase italic mt-1">Accelerate Your Pathway</h4>
            </div>
            <p className="text-xs font-bold text-gray-600 uppercase max-w-md">
              Complete lessons, practice mock exams, and exchange points in the Sovereign Shop to reach Luminary status.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={onNavigateToExams}
              className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer space-y-4"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-700 border-2 border-black rounded-xl flex items-center justify-center text-xl font-black">
                🎯
              </div>
              <div>
                <h5 className="font-black uppercase italic text-lg">Grade 12 Mock Exams</h5>
                <p className="text-xs font-bold text-gray-500 mt-1">Earn up to +200 KP per national mock exam submission.</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-blue-600">
                Launch Exams <ArrowUpRight size={14} />
              </span>
            </div>

            <div 
              onClick={() => onNavigateToCourse?.('')}
              className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 border-2 border-black rounded-xl flex items-center justify-center text-xl font-black">
                📚
              </div>
              <div>
                <h5 className="font-black uppercase italic text-lg">Course Lessons</h5>
                <p className="text-xs font-bold text-gray-500 mt-1">Earn +50 KP for every finished curriculum lesson.</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-emerald-600">
                Browse Courses <ArrowUpRight size={14} />
              </span>
            </div>

            <div 
              onClick={onNavigateToShop}
              className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer space-y-4"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-700 border-2 border-black rounded-xl flex items-center justify-center text-xl font-black">
                🛍️
              </div>
              <div>
                <h5 className="font-black uppercase italic text-lg">Redemption Shop</h5>
                <p className="text-xs font-bold text-gray-500 mt-1">Redeem earned points for official digital badges & passes.</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-amber-600">
                Open Bazaar <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Detail Modal */}
      <AnimatePresence>
        {selectedMilestone && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9000] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white border-8 border-black rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-[24px_24px_0px_0px_rgba(0,0,0,1)] space-y-6 relative"
            >
              <button 
                onClick={() => setSelectedMilestone(null)}
                className="absolute top-6 right-6 w-12 h-12 bg-black text-white rounded-2xl border-2 border-black font-black text-xl hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                ✕
              </button>

              <div className="flex items-center gap-4 border-b-4 border-black pb-6">
                <div className="w-20 h-20 bg-amber-400 border-4 border-black rounded-3xl flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                  {selectedMilestone.badgeIcon}
                </div>
                <div>
                  <span className="px-3 py-1 bg-black text-amber-300 border border-black rounded-md text-[10px] font-black uppercase tracking-wider">
                    LEVEL {selectedMilestone.level} MILESTONE
                  </span>
                  <h3 className="text-3xl font-black uppercase italic mt-1">{selectedMilestone.title}</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase">{selectedMilestone.subtitle}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                  {selectedMilestone.description}
                </p>

                <div className="p-4 bg-amber-50 border-4 border-black rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase">KP Requirement Status:</span>
                    <span className="text-xs font-black uppercase text-amber-900">
                      {user.points >= selectedMilestone.kpRequired ? '✅ REQUIREMENT MET' : `🔒 REQUIRES ${selectedMilestone.kpRequired} KP (${selectedMilestone.kpRequired - user.points} NEEDED)`}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">UNLOCKED PERKS & ADVANTAGES</h4>
                  <div className="space-y-2">
                    {selectedMilestone.unlockedPerks.map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-100 border-2 border-black rounded-xl text-xs font-bold text-black">
                        <Sparkles size={16} className="text-amber-500 shrink-0" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t-4 border-black flex gap-4">
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="flex-1 py-4 bg-gray-200 text-black border-4 border-black rounded-2xl font-black uppercase italic text-sm hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                {user.points < selectedMilestone.kpRequired ? (
                  <button
                    onClick={() => {
                      setSelectedMilestone(null);
                      onNavigateToExams?.();
                    }}
                    className="flex-1 py-4 bg-amber-400 text-black border-4 border-black rounded-2xl font-black uppercase italic text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap size={18} /> Earn KP Now
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedMilestone(null)}
                    className="flex-1 py-4 bg-emerald-500 text-white border-4 border-black rounded-2xl font-black uppercase italic text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} /> Verified Active
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressPath;
