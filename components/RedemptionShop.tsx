import React, { useState } from 'react';
import { 
  ShoppingBag, Award, BookOpen, Sparkles, CheckCircle2, Lock, Check,
  Zap, AlertCircle, Search, ShieldCheck, X, ChevronRight, Gift
} from 'lucide-react';
import { User, Course, Badge } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface KPShopItem {
  id: string;
  title: string;
  category: 'badges' | 'courses' | 'perks';
  kpCost: number;
  description: string;
  icon: string;
  badgeData?: Badge;
  courseId?: string;
  perkKey?: string;
  benefits: string[];
  popular?: boolean;
}

export const KP_SHOP_ITEMS: KPShopItem[] = [
  {
    id: 'kp_badge_sovereign_scholar',
    title: 'Sovereign Scholar Badge',
    category: 'badges',
    kpCost: 500,
    description: 'Official I2LMS National Digital Registry badge honoring consistent academic distinction.',
    icon: '🏆',
    badgeData: {
      id: 'badge_sovereign_scholar',
      title: 'Sovereign Scholar',
      icon: '🏆',
      earnedAt: new Date().toISOString(),
      description: 'National Academic Distinction'
    },
    benefits: [
      'Featured gold badge on Digital Student ID',
      'Public registry distinction badge',
      '10% bonus boost on national leaderboards'
    ],
    popular: true
  },
  {
    id: 'kp_badge_eaes_master',
    title: 'EAES Exam Pioneer Badge',
    category: 'badges',
    kpCost: 800,
    description: 'Special recognition for high performance in national mock examinations.',
    icon: '⚡',
    badgeData: {
      id: 'badge_eaes_pioneer',
      title: 'EAES Pioneer',
      icon: '⚡',
      earnedAt: new Date().toISOString(),
      description: 'National Mock Master'
    },
    benefits: [
      'Special EAES Pioneer badge on profile',
      'Exclusive mock solution step-by-step access',
      'Priority grading queue'
    ]
  },
  {
    id: 'kp_badge_ai_catalyst',
    title: 'AI Study Catalyst Badge',
    category: 'badges',
    kpCost: 1000,
    description: 'Mastery of AI-guided contextual learning and interactive problem solving.',
    icon: '🤖',
    badgeData: {
      id: 'badge_ai_catalyst',
      title: 'AI Catalyst',
      icon: '🤖',
      earnedAt: new Date().toISOString(),
      description: 'Interactive AI Champion'
    },
    benefits: [
      'Custom avatar AI halo glow',
      'Unlocks AI Tutor Advanced Reasoning mode',
      'Exclusive AI prompt templates'
    ]
  },
  {
    id: 'kp_badge_sovereign_laureate',
    title: 'National Sovereign Laureate',
    category: 'badges',
    kpCost: 1500,
    description: 'The pinnacle academic honor awarded to top national learners on I2LMS.',
    icon: '👑',
    badgeData: {
      id: 'badge_sovereign_laureate',
      title: 'Sovereign Laureate',
      icon: '👑',
      earnedAt: new Date().toISOString(),
      description: 'Top 1% National Academic Elite'
    },
    benefits: [
      'Permanent Gold Sovereign Halo on ID',
      'Direct Ministry Honor Roll listing',
      'Free certificate downloads for all courses'
    ],
    popular: true
  },
  {
    id: 'kp_course_eaes_masterclass',
    title: 'EAES National Mock Masterclass VIP Pass',
    category: 'courses',
    kpCost: 300,
    description: '30-day VIP access to national exam video walkthroughs and step-by-step solutions.',
    icon: '📚',
    perkKey: 'eaes_masterclass_vip',
    benefits: [
      'Full video breakdowns of past 5 years national exams',
      'Downloadable practice PDF workbooks',
      'Time-management strategies for exam day'
    ],
    popular: true
  },
  {
    id: 'kp_course_stem_formulas',
    title: 'Ministry STEM Formula & Blueprint Pack',
    category: 'courses',
    kpCost: 400,
    description: 'High-yield STEM formula sheets, key term mnemonics, and national exam summaries.',
    icon: '📄',
    perkKey: 'formula_pack_vip',
    benefits: [
      'Covers Physics, Chemistry, Biology & Math (Grades 9-12)',
      'High-density printable PDF cheat sheets',
      'Mnemonic flashcard decks'
    ]
  },
  {
    id: 'kp_course_virtual_lab',
    title: 'Advanced Virtual Science Lab Access',
    category: 'courses',
    kpCost: 750,
    description: 'Interactive virtual science experiments, physics motion labs, and chemistry 3D simulations.',
    icon: '🔬',
    perkKey: 'virtual_lab_vip',
    benefits: [
      'Interactive 3D molecular viewer',
      'Simulated physics force & motion laboratory',
      'Auto-graded lab reports'
    ]
  },
  {
    id: 'kp_perk_ai_unlimited',
    title: 'AI Tutor Priority Access (30 Days)',
    category: 'perks',
    kpCost: 600,
    description: 'Instant zero-latency responses from I2LMS AI Tutor with multi-step reasoning.',
    icon: '💡',
    perkKey: 'ai_priority_unlimited',
    benefits: [
      'Zero waiting latency on AI Tutor queries',
      'Unlimited multi-step problem solving',
      'Custom practice question generator'
    ],
    popular: true
  },
  {
    id: 'kp_perk_cert_pass',
    title: 'Sovereign VIP Digital Certificate Pass',
    category: 'perks',
    kpCost: 1000,
    description: 'Unlock verified digital completion certificates with official QR verification for all completed courses.',
    icon: '📜',
    perkKey: 'all_certificates_unlocked',
    benefits: [
      'Verifiable digital QR certificate for all courses',
      'High-res printable PDF exports',
      'Official Ministry of Education digital stamp'
    ]
  },
  {
    id: 'kp_perk_educator_consult',
    title: 'Senior Educator 1-on-1 Advisory Pass',
    category: 'perks',
    kpCost: 900,
    description: '30-minute private academic advisory session with a senior national educator.',
    icon: '👨‍🏫',
    perkKey: 'educator_consultation',
    benefits: [
      '1-on-1 personalized academic review',
      'University & stream advisory guidance',
      'Customized study schedule calibration'
    ]
  }
];

interface RedemptionShopProps {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  allCourses?: Course[];
  onNavigateToCourse?: (courseId: string) => void;
}

export const RedemptionShop: React.FC<RedemptionShopProps> = ({
  user,
  onUpdateUser,
  allCourses = [],
  onNavigateToCourse
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'badges' | 'courses' | 'perks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<KPShopItem | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] = useState<KPShopItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter items
  const filteredItems = KP_SHOP_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConfirmRedeem = async (item: KPShopItem) => {
    if (user.points < item.kpCost) {
      setErrorMessage(`Insufficient Knowledge Points! You need ${item.kpCost - user.points} more KP.`);
      return;
    }

    setIsRedeeming(true);
    setErrorMessage(null);

    const newPoints = user.points - item.kpCost;
    let newBadges = [...(user.badges || [])];
    let newCertificates = [...(user.certificatesPaid || [])];

    if (item.badgeData) {
      const alreadyHas = newBadges.some(b => b.id === item.badgeData?.id);
      if (!alreadyHas) {
        newBadges.push(item.badgeData);
      }
    }

    if (item.perkKey) {
      if (!newCertificates.includes(item.perkKey)) {
        newCertificates.push(item.perkKey);
      }
    }

    const updatedUser: User = {
      ...user,
      points: newPoints,
      badges: newBadges,
      certificatesPaid: newCertificates
    };

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        points: newPoints,
        badges: newBadges,
        certificatesPaid: newCertificates
      });

      onUpdateUser(updatedUser);
      setIsRedeeming(false);
      setSelectedItem(null);
      setRedemptionSuccess(item);
    } catch (err) {
      console.error("Error updating user points in Firestore:", err);
      // Fallback local update
      onUpdateUser(updatedUser);
      setIsRedeeming(false);
      setSelectedItem(null);
      setRedemptionSuccess(item);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-8 border-black rounded-[3.5rem] p-8 md:p-12 shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        <div className="absolute right-4 bottom-0 opacity-15 pointer-events-none text-9xl font-black italic select-none">
          I²LMS
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-black text-amber-300 border-2 border-black rounded-full font-black text-xs uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                SOVEREIGN BAZAAR
              </span>
              <span className="px-4 py-1.5 bg-white text-black border-2 border-black rounded-full font-black text-xs uppercase tracking-widest">
                KNOWLEDGE REWARDS STORE
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic text-black leading-tight">
              Knowledge Point Redemption Shop
            </h2>
            <p className="text-sm font-bold text-black/80 uppercase tracking-wide">
              Exchange your earned academic Knowledge Points (KP) for official digital badges, premium course access passes, and AI study tools.
            </p>
          </div>

          {/* Balance Widget */}
          <div className="bg-white border-8 border-black rounded-[2.5rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-6 shrink-0 w-full lg:w-auto">
            <div className="w-20 h-20 bg-yellow-400 border-4 border-black rounded-3xl flex items-center justify-center text-5xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 animate-bounce-slow">
              ⚡
            </div>
            <div>
              <p className="text-xs font-black uppercase text-gray-400 tracking-widest">AVAILABLE BALANCE</p>
              <p className="text-4xl md:text-5xl font-black text-black">{user.points || 0} KP</p>
              <p className="text-xs font-black text-green-600 uppercase mt-1 flex items-center gap-1">
                <ShieldCheck size={14} /> Verified Student Account
              </p>
            </div>
          </div>
        </div>

        {/* Level & Rank Progress Bar */}
        <div className="mt-8 bg-white/90 border-4 border-black rounded-2xl p-5 space-y-2 relative z-10">
          <div className="flex justify-between items-center text-xs font-black uppercase text-black">
            <span>Progress to Next Rank Tier (2,000 KP)</span>
            <span>{user.points || 0} / 2,000 KP</span>
          </div>
          <div className="h-5 bg-gray-200 border-3 border-black rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 border-r-2 border-black rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((user.points || 0) / 2000) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-600 uppercase">
            <span>+50 KP per completed lesson</span>
            <span>+200 KP per national mock exam</span>
            <span>+300 KP per course certificate</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-gray-50 border-4 border-black p-4 rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* Category Switches */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Catalog', icon: ShoppingBag },
            { id: 'badges', label: 'Digital Badges', icon: Award },
            { id: 'courses', label: 'Premium Passes', icon: BookOpen },
            { id: 'perks', label: 'VIP Perks', icon: Sparkles }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-black font-black uppercase italic text-xs transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(251,191,36,1)]' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <cat.icon size={16} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search rewards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-white border-2 border-black rounded-xl px-4 pl-10 font-bold text-xs uppercase outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <Search size={16} className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => {
          const isBadgeUnlocked = item.badgeData && user.badges?.some(b => b.id === item.badgeData?.id);
          const isPerkUnlocked = item.perkKey && user.certificatesPaid?.includes(item.perkKey);
          const isUnlocked = Boolean(isBadgeUnlocked || isPerkUnlocked);
          const canAfford = (user.points || 0) >= item.kpCost;

          return (
            <div 
              key={item.id}
              className={`bg-white border-8 border-black rounded-[3rem] p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative transition-all hover:-translate-y-2 hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] ${
                isUnlocked ? 'bg-green-50/40 border-green-800' : ''
              }`}
            >
              {item.popular && (
                <div className="absolute top-0 right-0 bg-amber-400 text-black border-b-4 border-l-4 border-black px-4 py-1 font-black text-[10px] uppercase tracking-widest rounded-bl-2xl">
                  🔥 POPULAR CHOICE
                </div>
              )}

              <div className="space-y-6">
                {/* Header & Cost */}
                <div className="flex items-start justify-between">
                  <div className="w-20 h-20 bg-yellow-100 border-4 border-black rounded-3xl flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                    {item.icon}
                  </div>
                  <div className="px-4 py-2 bg-black text-amber-300 border-2 border-black rounded-2xl font-black text-sm italic shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]">
                    {item.kpCost} KP
                  </div>
                </div>

                <div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-black rounded-lg text-[9px] font-black uppercase tracking-wider">
                    {item.category === 'badges' ? 'DIGITAL BADGE' : item.category === 'courses' ? 'PREMIUM ACCESS' : 'VIP PERK'}
                  </span>
                  <h3 className="text-2xl font-black uppercase italic mt-2 leading-tight">{item.title}</h3>
                  <p className="text-xs font-bold text-gray-500 mt-2 leading-relaxed">{item.description}</p>
                </div>

                {/* Benefits */}
                <div className="space-y-2 pt-2 border-t-2 border-gray-100">
                  <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">INCLUDED ADVANTAGES</p>
                  {item.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t-4 border-black">
                {isUnlocked ? (
                  <button 
                    disabled 
                    className="w-full py-4 bg-green-200 text-green-900 border-4 border-black rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-2 cursor-default"
                  >
                    <Check size={18} /> UNLOCKED & ACTIVE
                  </button>
                ) : canAfford ? (
                  <button 
                    onClick={() => {
                      setSelectedItem(item);
                      setErrorMessage(null);
                    }}
                    className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 text-black border-4 border-black rounded-2xl font-black uppercase italic text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} /> REDEEM WITH {item.kpCost} KP
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setSelectedItem(item);
                      setErrorMessage(`You need ${item.kpCost - (user.points || 0)} more Knowledge Points to unlock this asset.`);
                    }}
                    className="w-full py-4 bg-gray-100 text-gray-400 border-4 border-gray-300 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                    <Lock size={16} /> REQUIRES {item.kpCost} KP ({item.kpCost - (user.points || 0)} NEEDED)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-8 border-black rounded-[3rem] max-w-lg w-full p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-6 relative animate-in fade-in zoom-in-95">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-black hover:text-white border-2 border-black rounded-xl font-bold flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-100 border-4 border-black rounded-2xl flex items-center justify-center text-3xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {selectedItem.icon}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest">CONFIRM KP REDEMPTION</span>
                <h3 className="text-2xl font-black uppercase italic leading-tight">{selectedItem.title}</h3>
              </div>
            </div>

            <div className="bg-gray-50 border-4 border-black rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500">Item Cost:</span>
                <span className="font-black text-amber-600">{selectedItem.kpCost} KP</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-gray-500">Your Current KP:</span>
                <span className="font-black">{user.points || 0} KP</span>
              </div>
              <div className="border-t-2 border-gray-200 pt-2 flex justify-between items-center text-xs font-black">
                <span>Remaining Balance:</span>
                <span className={(user.points || 0) - selectedItem.kpCost < 0 ? 'text-red-600' : 'text-green-600'}>
                  {(user.points || 0) - selectedItem.kpCost} KP
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border-4 border-red-500 rounded-2xl text-red-700 font-bold text-xs flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-black border-4 border-black rounded-2xl font-black uppercase italic text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmRedeem(selectedItem)}
                disabled={isRedeeming || (user.points || 0) < selectedItem.kpCost}
                className="flex-1 py-4 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black border-4 border-black rounded-2xl font-black uppercase italic text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {isRedeeming ? 'Processing...' : 'Confirm Redemption'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Modal */}
      {redemptionSuccess && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-8 border-black rounded-[3rem] max-w-lg w-full p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] space-y-6 text-center relative animate-in zoom-in-95">
            <div className="w-24 h-24 bg-green-400 border-4 border-black rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-bounce-slow">
              🎉
            </div>

            <div>
              <span className="px-4 py-1 bg-green-100 text-green-800 border border-black rounded-full text-xs font-black uppercase">
                SUCCESSFULLY UNLOCKED
              </span>
              <h3 className="text-3xl font-black uppercase italic mt-3">{redemptionSuccess.title}</h3>
              <p className="text-xs font-bold text-gray-500 mt-2">
                This digital asset has been permanently bound to your I2LMS sovereign student profile!
              </p>
            </div>

            <button
              onClick={() => setRedemptionSuccess(null)}
              className="w-full py-4 bg-black text-white hover:bg-gray-800 border-4 border-black rounded-2xl font-black uppercase italic text-xs shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]"
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedemptionShop;
