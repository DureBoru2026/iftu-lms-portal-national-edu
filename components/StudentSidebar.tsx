
import React from 'react';
import { 
  LayoutDashboard, BookOpen, Newspaper, 
  Video, GraduationCap, ClipboardList, 
  School, MessageSquare, Calendar, 
  Bot, BarChart, Trophy, User, 
  MapPin, HelpCircle, Info, Menu, X, 
  ChevronRight, LogOut, ShieldCheck
} from 'lucide-react';
import { User as UserType } from '../types';
import { motion } from 'framer-motion';
import I2LMSLogo from './I2LMSLogo';

interface StudentSidebarProps {
  activeView: string;
  onNavClick: (view: string) => void;
  currentUser: UserType | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeView,
  onNavClick,
  currentUser,
  isSidebarOpen,
  setIsSidebarOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onLogout
}) => {
  const navSections = [
    {
      title: "Learning Hub",
      items: [
        { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'news', label: 'National News', icon: Newspaper },
        { id: 'mediahub', label: 'Media Hub', icon: Video },
      ]
    },
    {
      title: "Assessment",
      items: [
        { id: 'exams', label: 'Mock Exams', icon: GraduationCap },
        { id: 'assignments', label: 'Assignments', icon: ClipboardList },
        { id: 'performance', label: 'My Results', icon: BarChart },
      ]
    },
    {
      title: "Sovereign Tools",
      items: [
        { id: 'studyhall', label: 'Study Hall', icon: School },
        { id: 'forum', label: 'Community', icon: MessageSquare },
      ]
    },
    {
      title: "Navigation",
      items: [
        { id: 'leaderboard', label: 'Rankings', icon: Trophy },
        { id: 'profile', label: 'My Registry', icon: User },
        { id: 'locator', label: 'Campus Map', icon: MapPin },
        { id: 'about', label: 'About IFTU', icon: Info },
      ]
    }
  ];

  return (
    <>
      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[6000] bg-black text-white transition-all duration-500 ease-in-out border-r-8 border-black shadow-[10px_0px_0px_0px_rgba(59,130,246,1)] ${
          isSidebarOpen ? 'w-80' : 'w-24'
        } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-8 border-b-4 border-white/10 flex items-center justify-between">
            <div className={`flex items-center gap-4 ${!isSidebarOpen && 'hidden'}`}>
              <I2LMSLogo size="sm" />
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors hidden md:block"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors md:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {navSections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                {isSidebarOpen && (
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 px-4">
                    {section.title}
                  </p>
                )}
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavClick(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                        title={!isSidebarOpen ? item.label : ''}
                      >
                        <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                        {isSidebarOpen && (
                          <span className="font-black uppercase italic text-xs tracking-tight truncate">{item.label}</span>
                        )}
                        {isActive && isSidebarOpen && (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-8 border-t-4 border-white/10 space-y-6">
            <div className={`flex items-center gap-4 ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-10 h-10 rounded-full border-2 border-blue-600 overflow-hidden bg-white shrink-0">
                <img src={currentUser?.photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'Student'}`} alt="Student" />
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="font-black uppercase text-[10px] truncate">{currentUser?.name || "Registry Member"}</p>
                  <p className="text-[8px] text-blue-400 uppercase font-bold">Standardized Student</p>
                </div>
              )}
            </div>
            
            <button 
              onClick={onLogout}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white border-2 border-rose-600/20 ${!isSidebarOpen && 'justify-center'}`}
            >
              <LogOut className="w-6 h-6 shrink-0" />
              {isSidebarOpen && (
                <span className="font-black uppercase italic text-xs tracking-tight">Exit Portal</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[5500] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
