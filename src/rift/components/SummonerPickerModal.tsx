import React, { useState } from 'react';
import { UserCheck, Search, X, Sparkles, Trophy, Globe, Flame } from 'lucide-react';
import { UserSummonerProfile, Region } from '../types/league';
import { USER_SUMMONER_PRESETS } from '../data/mockLeagueData';
import { getRankEmblemUrl } from '../utils/buildCalculations';

interface SummonerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserSummonerProfile;
  onSelectProfile: (profile: UserSummonerProfile) => void;
}

export const SummonerPickerModal: React.FC<SummonerPickerModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectProfile,
}) => {
  const [customName, setCustomName] = useState('');
  const [customTag, setCustomTag] = useState('NA1');
  const [selectedRegion, setSelectedRegion] = useState<Region>('NA');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newProfile: UserSummonerProfile = {
      id: `custom-${Date.now()}`,
      summonerName: customName.trim(),
      tagline: customTag.trim() || 'NA1',
      region: selectedRegion,
      profileIconUrl: 'https://ddragon.leagueoflegends.com/cdn/14.23.1/img/profileicon/588.png',
      level: 285,
      soloTier: 'MASTER',
      soloLp: 285,
      soloWins: 142,
      soloLosses: 98,
      streak: 2,
      averageCsPerMin: 8.9,
      averageKp: 72,
      topChampions: currentProfile.topChampions,
      recentMatches: currentProfile.recentMatches,
    };

    onSelectProfile(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-card rounded-2xl border border-white/15 p-6 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-heading">Select Summoner</h2>
            <p className="text-xs text-slate-400">Choose your profile to track on the home screen</p>
          </div>
        </div>

        {/* Featured Summoner Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Featured High Elo Profiles
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {USER_SUMMONER_PRESETS.map((p) => {
              const isSelected = currentProfile.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProfile(p);
                    onClose();
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/25 border-sky-400 text-white shadow-lg shadow-sky-500/20'
                      : 'bg-black/30 border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <img
                    src={p.profileIconUrl}
                    alt={p.summonerName}
                    className="w-10 h-10 rounded-xl border border-white/15 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{p.summonerName}</span>
                      <span className="text-[10px] text-sky-400 font-mono">#{p.tagline}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 font-mono">
                      <span>{p.region}</span>
                      <span>•</span>
                      <img
                        src={getRankEmblemUrl(p.soloTier)}
                        alt={p.soloTier}
                        className="w-4 h-4 object-contain inline"
                      />
                      <span className="text-amber-400 font-bold">{p.soloTier}</span>
                      <span>{p.soloLp} LP</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Summoner Search / Input */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Or Enter Any Riot ID
          </span>
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div className="grid grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Game Name (e.g. Doublelift)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="col-span-6 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
              <input
                type="text"
                placeholder="#Tag (NA1)"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                className="col-span-3 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as Region)}
                className="col-span-3 px-2 py-2 rounded-xl bg-[#0e1322] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-sky-400"
              >
                <option value="NA">NA</option>
                <option value="KR">KR</option>
                <option value="EUW">EUW</option>
                <option value="CN">CN</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={!customName.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-40 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-sky-500/20"
            >
              Set as Home Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

