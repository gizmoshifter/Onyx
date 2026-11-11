import React, { useState } from 'react';
import { Swords, TrendingUp, AlertTriangle, Shield, Zap, Clock, Flame } from 'lucide-react';
import { ChampionMeta, MatchupData } from '../types/league';
import { evaluateMatchupAdvantage } from '../utils/buildCalculations';

interface MatchupAnalyticsProps {
  champion: ChampionMeta;
  onSelectChampion: (champId: string) => void;
}

export const MatchupAnalytics: React.FC<MatchupAnalyticsProps> = ({ champion, onSelectChampion }) => {
  const [selectedMatchupIndex, setSelectedMatchupIndex] = useState(0);

  const activeMatchup: MatchupData | undefined = champion.matchups[selectedMatchupIndex] || champion.matchups[0];

  if (!activeMatchup) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#0e1322]/80 border border-white/10">
        <p className="text-sm text-slate-400">No specific lane matchup data available.</p>
      </div>
    );
  }

  const evalResult = evaluateMatchupAdvantage(activeMatchup);

  return (
    <div className="space-y-6">
      {/* Top Matchup Header Ribbon */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#141b30]/80 to-[#0c1020]/80 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white font-heading">
                Lane Matchups & Counter Windows
              </h2>
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 text-[10px] font-mono font-semibold border border-sky-500/30">
                14.23
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live in-game timing, trading windows & spike alerts
            </p>
          </div>
        </div>

        {/* Matchup Quick Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          {champion.matchups.map((m, idx) => (
            <button
              key={m.championId}
              onClick={() => setSelectedMatchupIndex(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border ${
                selectedMatchupIndex === idx
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-md shadow-sky-500/20'
                  : 'bg-[#090c16]/60 border-white/5 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <img src={m.championIcon} alt={m.championName} className="w-5 h-5 rounded-md" />
              <span>vs {m.championName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Matchup Spotlight Comparison Card */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#141b30]/80 to-[#0c1020]/80 backdrop-blur-xl border border-white/10 space-y-6 shadow-2xl">
        {/* Faceoff Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#080c18]/90 p-5 rounded-2xl border border-white/5">
          {/* Your Champion */}
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={champion.iconUrl}
              alt={champion.name}
              className="w-16 h-16 rounded-2xl border-2 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
            />
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">PICK</span>
              <h3 className="text-2xl font-black text-white font-heading">{champion.name}</h3>
              <span className="text-xs text-slate-400 font-mono">{champion.role}</span>
            </div>
          </div>

          {/* Versus Centerpiece */}
          <div className="text-center px-4">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-slate-900 border border-white/10 shadow-lg">
              <Swords className="w-5 h-5 text-amber-400" />
            </div>
            <div className="mt-2">
              <span
                className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full font-heading"
                style={{
                  backgroundColor: `${evalResult.badgeColor}20`,
                  color: evalResult.badgeColor,
                  border: `1px solid ${evalResult.badgeColor}50`,
                }}
              >
                {activeMatchup.difficulty}
              </span>
            </div>
          </div>

          {/* Opponent Champion */}
          <div className="flex items-center gap-4 text-center sm:text-right flex-row-reverse sm:flex-row">
            <div>
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold">TARGET</span>
              <h3 className="text-2xl font-black text-white font-heading">{activeMatchup.championName}</h3>
              <span className="text-xs text-slate-400 font-mono">{activeMatchup.role}</span>
            </div>
            <img
              src={activeMatchup.championIcon}
              alt={activeMatchup.championName}
              className="w-16 h-16 rounded-2xl border-2 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
            />
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0a0e1c]/80 border border-white/5 text-center">
            <span className="text-[11px] text-slate-400 block font-mono">Win Rate</span>
            <span
              className={`text-2xl font-black font-mono block mt-0.5 ${
                activeMatchup.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {activeMatchup.winRate}%
            </span>
            <span className="text-[10px] text-slate-500">{activeMatchup.matchCount} games</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0e1c]/80 border border-white/5 text-center">
            <span className="text-[11px] text-slate-400 block font-mono">Gold @ 15m</span>
            <span
              className={`text-2xl font-black font-mono block mt-0.5 ${
                activeMatchup.goldDiffAt15 >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {activeMatchup.goldDiffAt15 >= 0 ? `+${activeMatchup.goldDiffAt15}` : activeMatchup.goldDiffAt15}g
            </span>
            <span className="text-[10px] text-slate-500">Lane Diff</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0e1c]/80 border border-white/5 text-center">
            <span className="text-[11px] text-slate-400 block font-mono">Kill Rate</span>
            <span className="text-2xl font-black font-mono text-sky-400 block mt-0.5">
              {activeMatchup.killRateInLane}%
            </span>
            <span className="text-[10px] text-slate-500">Solo kill</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0a0e1c]/80 border border-white/5 text-center">
            <span className="text-[11px] text-slate-400 block font-mono">Score</span>
            <span
              className="text-2xl font-black font-mono block mt-0.5"
              style={{ color: evalResult.badgeColor }}
            >
              {evalResult.score > 0 ? `+${evalResult.score}` : evalResult.score}
            </span>
            <span className="text-[10px] text-slate-500">Advantage</span>
          </div>
        </div>

        {/* In-Game HUD: Trade Window, Power Spike Alert & Counter Rush Item */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Trade Window */}
          <div className="p-4 rounded-xl bg-[#0b1022]/90 border border-sky-500/25 space-y-2">
            <div className="flex items-center gap-2 text-sky-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Trade Window
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeMatchup.tradeWindow || activeMatchup.proTips}
            </p>
          </div>

          {/* 2. Power Spike Alert */}
          <div className="p-4 rounded-xl bg-[#1a0f16]/90 border border-rose-500/25 space-y-2">
            <div className="flex items-center gap-2 text-rose-400">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Power Spike Alert
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {activeMatchup.powerSpike || 'Watch levels 3, 6, and completion of first legendary item.'}
            </p>
          </div>

          {/* 3. Recommended Counter Rush Item */}
          <div className="p-4 rounded-xl bg-[#14120a]/90 border border-amber-500/25 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Counter Rush Item
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-400/50 flex items-center justify-center font-bold text-amber-300 text-sm">
                ⭐
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{activeMatchup.recommendedCounterItem}</span>
                <span className="text-[10px] text-slate-400">Optimal counter item</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Matchup Quick Table */}
      <div className="rounded-2xl p-6 bg-gradient-to-br from-[#141b30]/80 to-[#0c1020]/80 backdrop-blur-xl border border-white/10 space-y-4 shadow-2xl">
        <h3 className="text-base font-bold text-white font-heading">
          All Matchups for {champion.name}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Enemy</th>
                <th className="py-2.5 px-3">Diff</th>
                <th className="py-2.5 px-3">WR</th>
                <th className="py-2.5 px-3">Gold @ 15</th>
                <th className="py-2.5 px-3">Counter Item</th>
                <th className="py-2.5 px-3 text-right">HUD Select</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {champion.matchups.map((m, idx) => (
                <tr
                  key={m.championId}
                  onClick={() => setSelectedMatchupIndex(idx)}
                  className={`hover:bg-sky-500/10 transition-colors cursor-pointer ${
                    selectedMatchupIndex === idx ? 'bg-sky-500/15' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 flex items-center gap-2.5">
                    <img src={m.championIcon} alt={m.championName} className="w-7 h-7 rounded-md" />
                    <span className="font-bold text-white">{m.championName}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.difficulty === 'Favored'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : m.difficulty === 'Skill'
                          ? 'bg-sky-950 text-sky-400 border border-sky-500/30'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {m.difficulty}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold">
                    <span className={m.winRate >= 50 ? 'text-emerald-400' : 'text-rose-400'}>
                      {m.winRate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className={m.goldDiffAt15 >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {m.goldDiffAt15 >= 0 ? `+${m.goldDiffAt15}` : m.goldDiffAt15}g
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-amber-300 font-medium">
                    {m.recommendedCounterItem}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMatchupIndex(idx);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-sky-500 text-slate-200 hover:text-white transition-colors text-[11px]"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

