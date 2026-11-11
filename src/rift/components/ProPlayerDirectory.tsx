import React, { useState } from 'react';
import { Users, ChevronRight } from 'lucide-react';
import { Region } from '../types/league';
import { PRO_PROFILES } from '../data/mockLeagueData';
import { getRankEmblemUrl } from '../utils/buildCalculations';

interface ProPlayerDirectoryProps {
  onSelectPlayer: (id: string) => void;
  onViewRanksTab: () => void;
}

export const ProPlayerDirectory: React.FC<ProPlayerDirectoryProps> = ({ onSelectPlayer, onViewRanksTab }) => {
  const [filterRegion, setFilterRegion] = useState<Region>('ALL');

  const filteredPros = PRO_PROFILES.filter((p) => {
    if (filterRegion !== 'ALL' && p.region !== filterRegion) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Ribbon */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white font-heading">
            Tracked Players & OTPs
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          {(['ALL', 'KR', 'EUW', 'CN'] as Region[]).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRegion(r)}
              className={`px-3 py-1 rounded-lg font-mono font-semibold transition-all cursor-pointer ${
                filterRegion === r
                  ? 'bg-purple-500 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Pro Grid with Real Rank Emblems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPros.map((pro) => (
          <div
            key={pro.playerId}
            onClick={() => {
              onSelectPlayer(pro.playerId);
              onViewRanksTab();
            }}
            className="glass-card rounded-2xl p-5 border border-white/10 hover:border-purple-500/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={pro.avatarUrl}
                  alt={pro.proName}
                  className="w-12 h-12 rounded-xl object-cover border border-white/15 shadow group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                      {pro.proName}
                    </h3>
                    <span className="text-[10px] font-mono font-bold text-purple-400">[{pro.team}]</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono block truncate">
                    {pro.summonerName} • {pro.region}
                  </span>
                </div>
              </div>

              {/* Rank Pill with Real Riot Emblem */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1 mb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={getRankEmblemUrl(pro.currentRank.tier)}
                      alt={pro.currentRank.tier}
                      className="w-6 h-6 object-contain"
                    />
                    <span className="text-xs font-bold text-amber-300 font-heading">
                      {pro.currentRank.tier}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    {pro.currentRank.lp.toLocaleString()} LP
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5">
                  <span className="text-emerald-400">{pro.currentRank.winRate}% WR</span>
                  <span>#{pro.currentRank.ladderRank} {pro.region}</span>
                </div>
              </div>

              {/* Career Peak */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono mb-2">
                <span>Peak:</span>
                <span className="font-bold text-amber-400">{pro.peakCareerRank.lp.toLocaleString()} LP (#{pro.peakCareerRank.ladderRank})</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold text-purple-300 group-hover:text-purple-200">
              <span>View Ranks & Timeline</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

