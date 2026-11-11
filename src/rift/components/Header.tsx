import React, { useState } from 'react';
import { Search, Shield, Trophy, Flame, Sparkles, Filter, ChevronDown, ChevronUp, Users, RefreshCw } from 'lucide-react';
import { Role, Region, UserSummonerProfile } from '../types/league';
import { CHAMPIONS_METADATA, PRO_PROFILES } from '../data/mockLeagueData';
import { getRankEmblemUrl } from '../utils/buildCalculations';

interface HeaderProps {
  selectedRole: Role | 'ALL';
  onSelectRole: (role: Role | 'ALL') => void;
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  selectedChampion: string;
  onSelectChampion: (champId: string) => void;
  onSelectPlayer: (playerId: string) => void;
  activeTab: 'builds' | 'ranks' | 'matchups' | 'pros' | 'sandbox';
  setActiveTab: (tab: 'builds' | 'ranks' | 'matchups' | 'pros' | 'sandbox') => void;
  userProfile?: UserSummonerProfile;
  onOpenSummonerPicker?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedRole,
  onSelectRole,
  selectedRegion,
  onSelectRegion,
  selectedChampion,
  onSelectChampion,
  onSelectPlayer,
  activeTab,
  setActiveTab,
  userProfile,
  onOpenSummonerPicker,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const roles: { id: Role | 'ALL'; label: string; icon: string }[] = [
    { id: 'ALL', label: 'All', icon: '❖' },
    { id: 'TOP', label: 'Top', icon: '🗡' },
    { id: 'JUNGLE', label: 'Jungle', icon: '🌲' },
    { id: 'MID', label: 'Mid', icon: '⚡' },
    { id: 'ADC', label: 'ADC', icon: '🏹' },
    { id: 'SUPPORT', label: 'Support', icon: '🛡' },
  ];

  const regions: Region[] = ['ALL', 'KR', 'EUW', 'NA', 'CN'];

  // Filter autocomplete results
  const filteredChampions = searchQuery.trim()
    ? CHAMPIONS_METADATA.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredPros = searchQuery.trim()
    ? PRO_PROFILES.filter(
        (p) =>
          p.proName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.summonerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.team.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const activeChampMeta = CHAMPIONS_METADATA.find(
    (c) => c.id.toLowerCase() === selectedChampion.toLowerCase()
  ) || CHAMPIONS_METADATA[0];

  const shouldShowFullNav = isExpanded || isPinned || isSearchFocused;

  return (
    <header
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        if (!isSearchFocused && !isPinned) {
          setIsExpanded(false);
        }
      }}
      className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-2xl transition-all duration-300"
    >
      {/* Sleek Minimal Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Minimal Onyx Icon & Clean Wordmark */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setActiveTab('builds')}
        >
          {/* Geometric Onyx Glyph */}
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 via-neutral-900 to-black p-0.5 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:border-sky-400/60 transition-colors">
            <div className="w-full h-full bg-[#07090e] rounded-[6px] flex items-center justify-center relative overflow-hidden">
              {/* Faceted Onyx Diamond */}
              <div className="w-3.5 h-3.5 rotate-45 bg-gradient-to-br from-sky-400/80 via-indigo-500/70 to-slate-900 border border-white/40 shadow-sm" />
            </div>
          </div>
          <span className="font-heading text-sm font-extrabold tracking-widest text-slate-100 group-hover:text-white transition-colors">
            ONYX
          </span>
        </div>

        {/* Compact Mode Pill (Visible when collapsed) */}
        {!shouldShowFullNav && (
          <div className="flex items-center gap-3 animate-fadeIn">
            {/* Active Champion Pill */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs">
              <img
                src={activeChampMeta.iconUrl}
                alt={activeChampMeta.name}
                className="w-4 h-4 rounded-full"
              />
              <span className="font-bold text-white text-[11px]">{activeChampMeta.name}</span>
            </div>

            {/* Active Tab Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 border border-sky-400/30 text-[11px] text-sky-300 font-mono font-semibold">
              {activeTab === 'builds' && <Shield className="w-3 h-3" />}
              {activeTab === 'ranks' && <Trophy className="w-3 h-3" />}
              {activeTab === 'matchups' && <Flame className="w-3 h-3" />}
              {activeTab === 'pros' && <Users className="w-3 h-3" />}
              {activeTab === 'sandbox' && <Sparkles className="w-3 h-3" />}
              <span className="capitalize">{activeTab}</span>
            </div>

            {/* Hover to expand hint button */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              className="text-[10px] text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/5 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Menu</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Global Search Bar (Full when expanded) */}
        {shouldShowFullNav && (
          <div className="relative flex-1 max-w-sm animate-fadeIn">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search Champion or Player..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0e1322]/90 border border-white/10 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500/60 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && (filteredChampions.length > 0 || filteredPros.length > 0) && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsSearchFocused(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 z-40 rounded-xl glass-card p-2 border border-white/15 shadow-2xl max-h-80 overflow-y-auto">
                  {filteredChampions.length > 0 && (
                    <div className="mb-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase px-2 py-1 block">
                        Champions
                      </span>
                      {filteredChampions.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectChampion(c.id);
                            setSearchQuery('');
                            setIsSearchFocused(false);
                            setActiveTab('builds');
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-sky-500/20 text-left transition-colors cursor-pointer"
                        >
                          <img src={c.iconUrl} alt={c.name} className="w-6 h-6 rounded-md" />
                          <span className="text-xs font-semibold text-white flex-1">{c.name}</span>
                          <span className="text-[10px] text-sky-400 font-mono">{c.winRate}%</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredPros.length > 0 && (
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase px-2 py-1 block border-t border-white/5 pt-1.5">
                        Players
                      </span>
                      {filteredPros.map((p) => (
                        <button
                          key={p.playerId}
                          onClick={() => {
                            onSelectPlayer(p.playerId);
                            setSearchQuery('');
                            setIsSearchFocused(false);
                            setActiveTab('ranks');
                          }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-sky-500/20 text-left transition-colors cursor-pointer"
                        >
                          <img src={p.avatarUrl} alt={p.proName} className="w-6 h-6 rounded-full object-cover" />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold text-white block truncate">{p.proName}</span>
                            <span className="text-[10px] text-slate-400">{p.summonerName}</span>
                          </div>
                          <span className="text-[10px] text-amber-400 font-mono">{p.currentRank.lp} LP</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Right Corner: User Profile Quick Chip & Pin Button */}
        <div className="flex items-center gap-2">
          {/* User Summoner Chip */}
          {userProfile && (
            <button
              onClick={onOpenSummonerPicker}
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 text-xs transition-all cursor-pointer group"
              title="Click to switch summoner profile"
            >
              <img
                src={userProfile.profileIconUrl}
                alt={userProfile.summonerName}
                className="w-5 h-5 rounded-md object-cover"
              />
              <span className="text-[11px] font-bold text-slate-200 group-hover:text-white truncate max-w-[100px] hidden sm:inline">
                {userProfile.summonerName}
              </span>
              <img
                src={getRankEmblemUrl(userProfile.soloTier)}
                alt={userProfile.soloTier}
                className="w-4 h-4 object-contain"
              />
            </button>
          )}

          {/* Pin/Unpin Controls */}
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              isPinned ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title={isPinned ? 'Unpin HUD' : 'Pin HUD Open'}
          >
            {isPinned ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Navigation Drawer (Shown on hover or click) */}
      {shouldShowFullNav && (
        <div className="border-t border-white/5 px-4 py-2 animate-fadeIn max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('builds')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'builds'
                  ? 'bg-sky-500/25 text-sky-300 border border-sky-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Builds</span>
            </button>

            <button
              onClick={() => setActiveTab('ranks')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ranks'
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Trophy className="w-3 h-3" />
              <span>Ranks</span>
            </button>

            <button
              onClick={() => setActiveTab('matchups')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'matchups'
                  ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Counters</span>
            </button>

            <button
              onClick={() => setActiveTab('pros')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'pros'
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Players</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Runes</span>
            </button>
          </div>

          {/* Filters: Role & Region in clean minimal chips */}
          <div className="flex items-center gap-2">
            {/* Role Pills */}
            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
              {roles.map((r) => (
                <button
                  key={r.id}
                  onClick={() => onSelectRole(r.id)}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] transition-all cursor-pointer ${
                    selectedRole === r.id
                      ? 'bg-sky-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={r.label}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Region Pills */}
            <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => onSelectRegion(reg)}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] transition-all cursor-pointer ${
                    selectedRegion === reg
                      ? 'bg-sky-500 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

