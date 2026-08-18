
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Search } from 'lucide-react';
import { Language, User } from '../types';
import { NotificationBell } from './NotificationBell';
import RoleGuard from './RoleGuard';
import I2LMSLogo from './I2LMSLogo';

interface HeaderProps {
  onNavClick: (view: string) => void;
  activeView: string;
  isLoggedIn: boolean;
  userRole?: 'student' | 'teacher' | 'admin' | 'content_creator' | 'teaching_assistant' | 'guest_user';
  onLogout: () => void;
  onLoginClick: () => void;
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  t: (key: string) => string;
  accessibilitySettings: any;
  onAccessibilityChange: (settings: any) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isOnline: boolean;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onNavClick, activeView, isLoggedIn, userRole, onLogout, onLoginClick, currentLang, onLangChange, t, isOnline, onSearch,
  isDarkMode, onToggleDarkMode
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      setSearchQuery('');
    }
  };

  // Dropdown navigation handler
  const handleNav = (view: string) => {
    onNavClick(view);
    setIsDropdownOpen(false);
  };

  const navConfig = [
    { id: 'home', roles: ['student', 'teacher', 'admin', 'teaching_assistant', 'content_creator', 'guest_user'] },
    { id: 'about', roles: ['student', 'teacher', 'admin', 'teaching_assistant', 'content_creator', 'guest_user'] },
    { id: 'news', roles: ['student', 'teacher', 'admin', 'teaching_assistant', 'content_creator', 'guest_user'] },
    { id: 'courses', roles: ['student', 'teacher', 'admin', 'teaching_assistant', 'content_creator', 'guest_user'] },
    { id: 'mediahub', roles: ['student', 'teacher', 'admin', 'teaching_assistant', 'content_creator', 'guest_user'] },
    { id: 'exams', roles: ['student'] },
    { id: 'assignments', roles: ['student', 'teacher', 'admin', 'teaching_assistant', 'content_creator'] },
    { id: 'studyhall', roles: ['student'] },
    { id: 'forum', roles: ['student', 'teacher', 'admin', 'teaching_assistant', 'content_creator'] },
    { id: 'performance', roles: ['student'] },
    { id: 'leaderboard', roles: ['student', 'teacher', 'admin'] },
    { id: 'profile', roles: ['student'] },
    { id: 'admin', roles: ['admin'] },
    { id: 'teacher', roles: ['teacher', 'teaching_assistant', 'content_creator', 'admin'] },
    { id: 'locator', roles: ['student', 'teacher', 'admin', 'teaching_assistant', 'content_creator', 'guest_user'] },
    { id: 'guide', roles: ['student', 'teacher', 'admin', 'teaching_assistant', 'content_creator', 'guest_user'] },
  ];

  const currentUserMock = isLoggedIn ? { role: userRole } as User : { role: 'guest_user' } as User;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[100] bg-white border-b-6 md:border-b-8 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] max-w-full overflow-x-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-20 md:h-24 gap-2 md:gap-6">
          {/* Left Section: Logo + Navigation */}
          <div className="flex items-center gap-3 md:gap-6 shrink-0 min-w-0">
            {/* Logo Section */}
            <I2LMSLogo onClick={() => handleNav('home')} size="md" />

            {/* Desktop Navigation (Moved to Left) */}
            <nav className="hidden md:flex items-center gap-1 xl:gap-2">
              {/* Force show Home, About, News for all desktop users */}
              {[
                { id: 'home', roles: ['guest_user', 'student', 'teacher', 'admin'] },
                { id: 'about', roles: ['guest_user', 'student', 'teacher', 'admin'] },
                { id: 'news', roles: ['guest_user', 'student', 'teacher', 'admin'] }
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => handleNav(item.id)} 
                  className={`text-[10px] xl:text-[11px] font-black uppercase tracking-[0.1em] px-3 xl:px-4 py-2 rounded-lg transition-all relative group overflow-hidden ${activeView === item.id ? 'text-black bg-yellow-400' : 'text-gray-900 hover:text-blue-700 hover:bg-blue-100'}`}
                >
                  <span className="relative z-10">{t(item.id)}</span>
                  <div className={`absolute bottom-0 left-0 h-1 bg-black transition-all duration-300 ${activeView === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
                </button>
              ))}

              {/* Rest of Nav for XL screens */}
              <div className="hidden xl:flex items-center gap-2 border-l-4 border-black/5 ml-2 pl-2">
                {navConfig.slice(3, 10).map((item) => (
                  <RoleGuard 
                    key={item.id} 
                    currentUser={currentUserMock} 
                    allowedRoles={item.roles as any}
                  >
                    <button 
                      onClick={() => handleNav(item.id)} 
                      className={`text-[11px] font-black uppercase tracking-[0.1em] px-4 py-2 rounded-lg transition-all relative group overflow-hidden ${activeView === item.id ? 'text-black bg-yellow-400' : 'text-gray-900 hover:text-blue-700 hover:bg-blue-100'}`}
                    >
                      <span className="relative z-10">{t(item.id)}</span>
                      {activeView === item.id && (
                        <motion.div 
                          layoutId="nav-glow"
                          className="absolute inset-0 bg-yellow-400/20 blur-md"
                        />
                      )}
                      <div className={`absolute bottom-0 left-0 h-1 bg-black transition-all duration-300 ${activeView === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`}></div>
                    </button>
                  </RoleGuard>
                ))}
              </div>
            </nav>

            {/* Search Engine Integration */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative group">
              <input 
                type="text" 
                placeholder="Search Portal..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 xl:w-52 h-10 bg-white border-2 border-black rounded-lg px-4 pr-10 font-black uppercase text-[10px] tracking-widest focus:w-64 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none"
              />
              <button type="submit" className="absolute right-3 text-black hover:scale-110 transition-transform">
                <Search size={16} strokeWidth={3} />
              </button>
            </form>
          </div>

          {/* Right Section Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0 relative" ref={dropdownRef}>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-green-500/10 border-2 border-black rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black uppercase tracking-tight text-green-700">Sovereign Portal Access Ready</span>
            </div>
            {/* Language & Theme Selectors (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={onToggleDarkMode}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl border-4 border-black flex items-center justify-center transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-blue-600" />}
              </button>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-xl border-4 border-black h-10 md:h-12">
                <div className={`w-3 h-3 rounded-full border-2 border-black ${isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} title={isOnline ? 'Online' : 'Offline'}></div>
                {!isOnline && (
                  <button 
                    onClick={() => window.location.reload()}
                    className="text-[8px] font-black uppercase hover:underline"
                  >
                    Sync
                  </button>
                )}
              </div>

              <div className="flex gap-1 bg-gray-100 p-1.5 rounded-xl border-4 border-black">
              {[
                { code: 'en' as Language, label: 'EN', name: 'English' },
                { code: 'am' as Language, label: 'አማ', name: 'አማርኛ' },
                { code: 'om' as Language, label: 'OM', name: 'Afaan Oromoo' }
              ].map(({ code, label, name }) => (
                <button 
                  key={code} 
                  onClick={() => onLangChange(code)} 
                  title={`Switch language to ${name}`}
                  className={`px-2.5 py-1 rounded-lg border-2 border-black text-[9px] font-black uppercase transition-all ${currentLang === code ? 'bg-[#FFD700] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-200'}`}
                >
                  {label}
                </button>
              ))}
              </div>
            </div>
            {isLoggedIn && <NotificationBell />}

            {/* Main Action Button (Login or Identity) */}
            {isLoggedIn ? (
              <div className="flex items-center gap-2 md:gap-4">
                <button 
                  onClick={() => {
                    const teacherRoles = ['teacher', 'teaching_assistant', 'content_creator'];
                    if (userRole === 'admin') handleNav('admin');
                    else if (teacherRoles.includes(userRole || '')) handleNav('teacher');
                    else handleNav('performance');
                  }}
                  className="hidden sm:flex h-12 md:h-14 px-4 md:px-6 bg-blue-50 text-blue-700 rounded-xl border-4 border-black font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-100 transition-all items-center gap-2"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Portal
                </button>
                <button onClick={onLogout} className="h-12 md:h-14 px-4 md:px-6 bg-rose-50 text-rose-600 rounded-xl border-4 border-black font-black uppercase text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-rose-100 transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick} 
                className="h-12 md:h-14 px-4 md:px-8 bg-blue-600 text-white rounded-xl border-4 border-black font-black uppercase text-xs tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <span className="text-lg">🔐</span>
                Access Portal
              </button>
            )}

            {/* Dropdown Menu Toggle (Right side of Login) */}
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-xl border-4 border-black flex items-center justify-center text-xl md:text-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${isDropdownOpen ? 'bg-yellow-400 translate-y-1 shadow-none' : 'bg-white hover:bg-gray-100'}`}
                aria-label="Toggle Portal Menu"
              >
                {isDropdownOpen ? '✕' : '☰'}
              </button>

              {/* Portal Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-16 md:top-24 w-[300px] bg-white border-8 border-black rounded-[3rem] shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-scaleIn z-[1000] max-h-[80vh] overflow-y-auto">
                  <div className="p-6 bg-gray-50 text-black flex justify-between items-center border-b-8 border-black">
                    <span className="text-[10px] font-black uppercase tracking-widest">Portal Menu</span>
                    <span className="text-xl">🎓</span>
                  </div>
                  <div className="flex flex-col p-4 gap-2">
                    {/* Mobile Settings Section */}
                    <div className="md:hidden flex flex-col gap-4 mb-4 pb-4 border-b-4 border-black">
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={onToggleDarkMode}
                          className={`flex items-center gap-2 px-4 py-2 border-4 border-black rounded-xl font-black uppercase text-[10px] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
                        >
                          {isDarkMode ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-blue-600" />}
                          {isDarkMode ? 'Light' : 'Dark'}
                        </button>
                        <div className="flex items-center gap-2">
                           <div className={`w-3 h-3 rounded-full border-2 border-black ${isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></div>
                           <span className="text-[10px] font-black uppercase">{isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {[
                          { code: 'en' as Language, name: 'English' },
                          { code: 'am' as Language, name: 'አማርኛ' },
                          { code: 'om' as Language, name: 'Afaan Oromoo' }
                        ].map(({ code, name }) => (
                          <button 
                            key={code} 
                            onClick={() => onLangChange(code)} 
                            className={`flex-1 py-2 rounded-xl border-4 border-black text-[10px] font-black uppercase transition-colors ${currentLang === code ? 'bg-[#FFD700] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'}`}
                          >
                            {name}
                          </button>
                        ))}
                      </div>

                      {isLoggedIn && (
                        <div className="flex gap-2 mt-2">
                          <button 
                            onClick={() => {
                              const teacherRoles = ['teacher', 'teaching_assistant', 'content_creator'];
                              if (userRole === 'admin') handleNav('admin');
                              else if (teacherRoles.includes(userRole || '')) handleNav('teacher');
                              else handleNav('performance');
                              setIsDropdownOpen(false);
                            }}
                            className="flex-1 py-3 bg-blue-50 text-blue-700 rounded-xl border-4 border-black font-black uppercase text-[10px]"
                          >
                            Dashboard
                          </button>
                          <button onClick={onLogout} className="flex-1 py-3 bg-rose-50 text-rose-600 rounded-xl border-4 border-black font-black uppercase text-[10px]">
                            Logout
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Mobile Search */}
                    <form onSubmit={handleSearchSubmit} className="lg:hidden relative mb-4">
                      <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 bg-white border-4 border-black rounded-xl px-4 pr-10 font-black uppercase text-[10px] outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      />
                      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Search size={16} strokeWidth={3} />
                      </button>
                    </form>

                    {navConfig.map((item) => (
                      <RoleGuard 
                        key={item.id} 
                        currentUser={currentUserMock} 
                        allowedRoles={item.roles as any}
                      >
                        <button 
                          onClick={() => handleNav(item.id)} 
                          className={`w-full text-left px-8 py-5 rounded-2xl border-4 border-black font-black uppercase text-xs tracking-widest transition-all ${activeView === item.id ? 'bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white hover:bg-gray-50 hover:translate-x-2'}`}
                        >
                          {t(item.id)}
                        </button>
                      </RoleGuard>
                    ))}
                    
                    {/* Logged in info */}
                    {isLoggedIn && (
                      <div className="mt-4 pt-4 border-t-4 border-black/10 flex items-center gap-4 px-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-black flex items-center justify-center text-xl">👤</div>
                        <div className="leading-tight">
                          <p className="text-[9px] font-black uppercase text-gray-400">Authenticated Role</p>
                          <p className="text-xs font-black uppercase italic">{userRole}</p>
                        </div>
                      </div>
                    )}

                    {/* Quick Language Mobile */}
                    <div className="md:hidden mt-4 pt-4 border-t-4 border-black/10 flex gap-2">
                      {(['en', 'am', 'om'] as Language[]).map(l => (
                        <button key={l} onClick={() => onLangChange(l)} className={`flex-1 py-3 rounded-xl border-2 border-black text-[9px] font-black uppercase ${currentLang === l ? 'bg-[#FFD700]' : 'bg-white'}`}>{l}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
