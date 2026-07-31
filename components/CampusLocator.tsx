
import React, { useState } from 'react';
import { findNearbyColleges } from '../services/geminiService';
import { NATIONAL_CENTER_INFO } from '../constants';

const CampusLocator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string, places: any[] } | null>(null);
  const [type, setType] = useState<'TVET' | 'High School'>('TVET');

  const handleLocate = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const data = await findNearbyColleges(pos.coords.latitude, pos.coords.longitude, type);
        setResults(data);
        setLoading(false);
      }, (err) => {
        alert("Location access denied. Please enable GPS in your browser settings.");
        setLoading(false);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-10 animate-fadeIn px-4 overflow-x-hidden">
      <div className="bg-white border-4 md:border-8 border-black rounded-3xl md:rounded-[3rem] p-6 md:p-12 shadow-[12px_12px_0px_0px_rgba(34,197,94,1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 ethiopian-gradient"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-full min-w-0">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight text-blue-900 break-words">Campus <br className="hidden sm:inline"/>Locator.</h2>
            <p className="text-xs sm:text-base font-black text-gray-500 uppercase tracking-widest italic">Find the nearest center of excellence</p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <div className="flex bg-gray-100 p-1.5 rounded-xl border-2 md:border-4 border-black">
              <button onClick={() => setType('TVET')} className={`flex-1 px-4 py-2 rounded-lg font-black uppercase text-xs transition-all ${type === 'TVET' ? 'bg-black text-white' : ''}`}>TVET</button>
              <button onClick={() => setType('High School')} className={`flex-1 px-4 py-2 rounded-lg font-black uppercase text-xs transition-all ${type === 'High School' ? 'bg-black text-white' : ''}`}>Secondary</button>
            </div>
            <button 
              onClick={handleLocate}
              disabled={loading}
              className="px-6 py-4 bg-blue-600 text-white border-2 md:border-4 border-black rounded-2xl font-black uppercase text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <><div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div> Interrogating Satellites...</>
              ) : 'Locate Nearest Centers'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured National Headquarters - Always Shown */}
        <div className="space-y-6 min-w-0">
          <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-blue-900 ml-2">National Headquarters</h3>
          <a 
            href={NATIONAL_CENTER_INFO.mapsLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-blue-50 border-4 md:border-8 border-black rounded-2xl md:rounded-[2.5rem] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all group relative overflow-hidden min-w-0"
          >
            <div className="absolute top-0 right-0 p-2 sm:p-3 bg-yellow-400 border-b-2 border-l-2 md:border-b-4 md:border-l-4 border-black font-black uppercase text-[9px] tracking-widest">Primary Hub</div>
            <div className="flex justify-between items-start gap-4">
              <h4 className="text-xl sm:text-2xl md:text-3xl font-black uppercase italic tracking-tighter group-hover:text-blue-700 leading-snug break-words">{NATIONAL_CENTER_INFO.name}</h4>
              <span className="text-3xl shrink-0">🏛️</span>
            </div>
            <p className="mt-4 text-gray-700 font-bold uppercase text-[11px] tracking-wider leading-relaxed break-words">
              {NATIONAL_CENTER_INFO.location}
            </p>
            <div className="mt-6 flex items-center gap-2 text-blue-600 font-black uppercase text-xs">
              Navigate to Command Center →
            </div>
          </a>
        </div>

        {results && (
          <div className="space-y-6 animate-fadeIn min-w-0">
            <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-blue-900 ml-2">Registry Matches</h3>
            <div className="space-y-4">
              {results.places.length > 0 ? results.places.map((place, i) => (
                <a 
                  key={i} 
                  href={place.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-white border-4 md:border-6 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] hover:-translate-y-1 transition-all group min-w-0"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter group-hover:text-blue-600 break-words">{place.title}</h4>
                    <span className="text-2xl shrink-0">📍</span>
                  </div>
                  {place.snippet && <p className="mt-3 text-gray-500 font-bold uppercase text-[10px] tracking-wider leading-relaxed break-words">{place.snippet}</p>}
                  <div className="mt-4 flex items-center gap-2 text-blue-600 font-black uppercase text-xs">
                    Explore on Digital Map →
                  </div>
                </a>
              )) : (
                <div className="bg-gray-50 border-4 border-dashed border-black/20 rounded-2xl p-8 text-center">
                  <p className="font-black text-gray-400 uppercase italic text-sm">No direct matches found in mapping registry.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusLocator;
