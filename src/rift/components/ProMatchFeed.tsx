import React, { useState } from 'react';
import { Swords, Eye, Shield, Trophy, Clock, Coins, Flame, Filter, ChevronRight, User } from 'lucide-react';
import { ProMatch, Region, Role } from '../types/league';
import { filterMatches, formatKDAString } from '../utils/buildCalculations';

interface ProMatchFeedProps {
  matches: ProMatch[];
  selectedChampionId: string;
  selectedRole: Role | 'ALL';
  selectedRegion: Region;
  onOpenMatch: (match: ProMatch) => void;
  onSelectChampion: (champId: string) => void;
}

export const ProMatchFeed: React.FC<ProMatchFeedProps> = ({
  matches,
  selectedChampionId,
  selectedRole,
  selectedRegion,
  onOpenMatch,
  onSelectChampion,
}) => {
  const [resultFilter, setResultFilter] = useState<'all' | 'win' | 'loss'>('all');
  const [matchSearch, setMatchSearch] = useState('');

  // Filter matches
  const filtered = filterMatches(matches, {
    championId: selectedChampionId,
    role: selectedRole,
    region: selectedRegion,
    resultFilter: resultFilter,
    searchQuery: matchSearch,
  });

  return (
    <div className="space-y-4">
      {/* Sub Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl glass-panel border border-white/5">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Swords className="w-4 h-4 text-sky-400" />
            <span>Recent High-Elo Pro & OTP Matches</span>
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            {filtered.length} Matches Found
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Win/Loss Filter */}
          <div className="flex items-center bg-[#090c16] rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setResultFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                resultFilter === 'all' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setResultFilter('win')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                resultFilter === 'win' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Victories
            </button>
            <button
              onClick={() => setResultFilter('loss')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                resultFilter === 'loss' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Defeats
            </button>
          </div>
        </div>
      </div>

      {/* Matches List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-card border border-white/5 space-y-3">
          <Swords className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-heading">No Matches Match Current Filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try switching the result filter, selecting "All Roles" or clearing the region filter to see more games.
          </p>
          <button
            onClick={() => {
              setResultFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((match) => (
            <div
              key={match.id}
              onClick={() => onOpenMatch(match)}
              className={`glass-card rounded-xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer group hover:scale-[1.005] ${
                match.win
                  ? 'border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'border-rose-500/20 hover:border-rose-400/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
              }`}
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* 1. Pro Player & Result Badge */}
                <div className="flex items-center gap-3.5 min-w-[220px]">
                  {/* Result Indicator Pillar */}
                  <div
                    className={`w-1.5 h-14 rounded-full ${
                      match.win ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-rose-500 shadow-[0_0_10px_#ef4444]'
                    }`}
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">
                        {match.proPlayerName}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 font-mono text-[10px] border border-indigo-500/30">
                        {match.teamTag}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">[{match.region}]</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span
                        className={`font-black font-heading tracking-wide ${
                          match.win ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {match.win ? 'VICTORY' : 'DEFEAT'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {match.gameDurationMinutes}m
                      </span>
                      <span>•</span>
                      <span>{match.timeAgo}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Direct Lane Matchup (Champion vs Opponent) */}
                <div className="flex items-center gap-3 bg-[#080b14]/70 px-4 py-2 rounded-xl border border-white/5">
                  <div className="text-center">
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block mb-1">PRO</span>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${match.championId}.png`}
                      alt={match.championName}
                      className="w-10 h-10 rounded-lg border border-sky-400/50 shadow"
                    />
                    <span className="text-[10px] font-semibold text-slate-200 block mt-0.5">{match.championName}</span>
                  </div>

                  <div className="text-center px-2">
                    <span className="text-xs font-black font-mono text-slate-400 block">VS</span>
                    <span className="text-[9px] text-slate-400 uppercase font-mono">{match.role}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-[9px] font-mono text-rose-400 uppercase tracking-widest block mb-1">ENEMY</span>
                    <img
                      src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${match.opponentChampionId}.png`}
                      alt={match.opponentChampionName}
                      className="w-10 h-10 rounded-lg border border-slate-700 shadow"
                    />
                    <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{match.opponentChampionName}</span>
                  </div>
                </div>

                {/* 3. KDA, KP% & CS Stats */}
                <div className="min-w-[170px]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black font-mono text-white">
                      {match.kills} / <span className="text-rose-400">{match.deaths}</span> / {match.assists}
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      ({Math.round(((match.kills + match.assists) / Math.max(1, match.deaths)) * 10) / 10} KDA)
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                    <span className="text-sky-300 font-bold">{match.killParticipation}% KP</span>
                    <span>•</span>
                    <span>{match.cs} CS ({match.csPerMin}/m)</span>
                  </div>
                </div>

                {/* 4. Inventory Items + Keystone */}
                <div className="flex items-center gap-3">
                  {/* Spells & Keystone */}
                  <div className="flex flex-col gap-1 items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-900 border border-sky-400/70 overflow-hidden flex items-center justify-center shadow" title={match.keystone.name}>
                      <img src={match.keystone.icon} alt={match.keystone.name} className="w-full h-full object-contain p-0.5" />
                    </div>
                    <div className="flex gap-0.5">
                      {match.spells.map((s, i) => (
                        <span key={i} className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                          {s[0]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 6 Inventory Items + Trinket */}
                  <div className="flex items-center gap-1 bg-[#090b14]/90 p-1.5 rounded-xl border border-white/5">
                    {match.items.map((item, idx) => (
                      <div key={idx} className="relative group/item">
                        <img
                          src={item.icon}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg border border-slate-700 hover:border-sky-400 transition-colors"
                        />
                      </div>
                    ))}
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <img
                      src={match.trinket.icon}
                      alt={match.trinket.name}
                      className="w-8 h-8 rounded-lg border border-amber-500/30"
                    />
                  </div>
                </div>

                {/* 5. Click to Inspect Action */}
                <div className="hidden xl:flex items-center text-slate-400 group-hover:text-sky-400 transition-colors">
                  <span className="text-xs font-semibold mr-1">Scoreboard</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

