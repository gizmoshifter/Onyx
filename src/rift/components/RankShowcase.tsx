import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Calendar,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { PlayerRankProfile, GameModeRank, SeasonRankHistory } from '../types/league';
import { PRO_PROFILES } from '../data/mockLeagueData';
import { formatRankRating, getRankEmblemUrl } from '../utils/buildCalculations';

interface RankShowcaseProps {
  selectedPlayerId: string;
  onSelectPlayer: (id: string) => void;
}

export const RankShowcase: React.FC<RankShowcaseProps> = ({ selectedPlayerId, onSelectPlayer }) => {
  const player: PlayerRankProfile =
    PRO_PROFILES.find((p) => p.playerId === selectedPlayerId) || PRO_PROFILES[0];

  const [activeModeKey, setActiveModeKey] = useState<string>('soloDuo');
  const [seasonIndex, setSeasonIndex] = useState<number>(0);

  const selectedMode: GameModeRank =
    player.gameModes.find((m) => m.modeKey === activeModeKey) || player.gameModes[0];

  const selectedSeason: SeasonRankHistory = player.seasonHistory[seasonIndex] || player.seasonHistory[0];

  return (
    <div className="space-y-6">
      {/* Player Header Card */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={player.avatarUrl}
                alt={player.proName}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-400/50 shadow-md"
              />
              <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-slate-900 border border-sky-400/40 text-[10px] font-mono font-bold text-sky-400">
                {player.region}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-white tracking-wide font-heading">
                  {player.proName}
                </h1>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-xs font-mono font-bold text-sky-300">
                  {player.team}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {player.summonerName}#{player.tagline}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1 font-mono">
                <span className="text-amber-400 font-bold">#{player.currentRank.ladderRank} {player.region}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{player.currentRank.winRate}% WR</span>
                <span>•</span>
                <span className="text-amber-400 flex items-center gap-0.5">
                  <Flame className="w-3.5 h-3.5" /> {player.currentRank.streak} Streak
                </span>
              </div>
            </div>
          </div>

          {/* Player Switcher */}
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 overflow-x-auto">
            {PRO_PROFILES.map((p) => (
              <button
                key={p.playerId}
                onClick={() => onSelectPlayer(p.playerId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedPlayerId === p.playerId
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{p.proName}</span>
                <span className="text-[10px] opacity-75 font-mono">[{p.team}]</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary 3-Column Rank Overview with Real Riot Emblems */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Live Solo/Duo Rank */}
        <div className="glass-card rounded-2xl p-5 border border-sky-500/30 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-400">
              Live Solo/Duo
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] text-emerald-300 font-semibold font-mono">
              Season 14
            </span>
          </div>

          <div className="flex items-center gap-4 my-3">
            <img
              src={getRankEmblemUrl(player.currentRank.tier)}
              alt={player.currentRank.tier}
              className="w-16 h-16 object-contain drop-shadow-lg"
            />
            <div>
              <div className="text-xl font-black font-heading text-amber-400">
                {player.currentRank.tier}
              </div>
              <div className="text-lg font-mono font-bold text-white">
                {player.currentRank.lp.toLocaleString()} LP
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Rank #{player.currentRank.ladderRank} KR
              </div>
            </div>
          </div>

          <div className="space-y-1.5 pt-3 border-t border-white/5 text-xs font-mono">
            <div className="flex justify-between text-slate-300 text-[11px]">
              <span>{player.currentRank.winRate}% WR</span>
              <span>
                <strong className="text-emerald-400">{player.currentRank.wins}W</strong>{' '}
                <strong className="text-rose-400">{player.currentRank.losses}L</strong>
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
              <div className="bg-emerald-500 h-full" style={{ width: `${player.currentRank.winRate}%` }} />
              <div className="bg-rose-500 h-full" style={{ width: `${100 - player.currentRank.winRate}%` }} />
            </div>
          </div>
        </div>

        {/* Card 2: Peak Rank */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/30 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Career Peak
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] text-amber-300 font-mono font-bold">
              #{player.peakCareerRank.ladderRank} Global
            </span>
          </div>

          <div className="flex items-center gap-4 my-3">
            <img
              src={getRankEmblemUrl(player.peakCareerRank.tier)}
              alt={player.peakCareerRank.tier}
              className="w-16 h-16 object-contain drop-shadow-lg"
            />
            <div>
              <div className="text-xl font-black font-heading text-amber-400">
                {player.peakCareerRank.tier}
              </div>
              <div className="text-lg font-mono font-bold text-white">
                {player.peakCareerRank.lp.toLocaleString()} LP
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {player.peakCareerRank.season}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Peak Standing</span>
            <span className="text-amber-400 font-bold">Rank #1 Global</span>
          </div>
        </div>

        {/* Card 3: All-Time Record */}
        <div className="glass-card rounded-2xl p-5 border border-purple-500/30 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400">
              All-Time Milestone
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-[10px] text-purple-300 font-mono">
              Certified
            </span>
          </div>

          <div className="flex items-center gap-4 my-3">
            <img
              src={getRankEmblemUrl(player.highestRankEver.tier)}
              alt={player.highestRankEver.tier}
              className="w-16 h-16 object-contain drop-shadow-lg"
            />
            <div>
              <div className="text-xl font-black font-heading text-purple-400">
                {player.highestRankEver.tier}
              </div>
              <div className="text-lg font-mono font-bold text-white">
                {player.highestRankEver.lp.toLocaleString()} LP
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                {player.highestRankEver.date}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Ladder Record</span>
            <span className="text-purple-300 font-bold">Rank #{player.highestRankEver.ladderRank} KR</span>
          </div>
        </div>
      </div>

      {/* Feature 1: Game Mode Slider & Quick Emblems */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-base font-bold text-white font-heading">
            Game Mode Ranks
          </h2>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
            {player.gameModes.map((mode) => (
              <button
                key={mode.modeKey}
                onClick={() => setActiveModeKey(mode.modeKey)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeModeKey === mode.modeKey
                    ? 'bg-sky-500 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode.modeName}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Mode Detail Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-black/40 rounded-xl p-5 border border-white/5">
          <div className="lg:col-span-2 flex items-center gap-4">
            <img
              src={getRankEmblemUrl(selectedMode.tier)}
              alt={selectedMode.tier}
              className="w-16 h-16 object-contain drop-shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-slate-400">{selectedMode.modeName}</span>
                <span className="px-1.5 py-0.2 rounded bg-sky-950 text-sky-400 text-[10px] font-mono border border-sky-500/30">
                  {selectedMode.topRankPercentile}
                </span>
              </div>
              <h3 className="text-2xl font-black font-heading text-amber-400">
                {selectedMode.tier} {selectedMode.division || ''}
              </h3>
              <p className="text-sm font-mono font-bold text-white">
                {formatRankRating(selectedMode)}
                <span className="text-xs text-slate-400 font-normal ml-2">
                  (Peak: {selectedMode.peakRating.toLocaleString()})
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center border-l border-white/5 pl-4">
            <span className="text-[11px] text-slate-400 font-mono">Win Rate</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {selectedMode.winRate}%
            </span>
            <span className="text-xs text-slate-400 font-mono mt-0.5">
              {selectedMode.wins}W / {selectedMode.losses}L
            </span>
          </div>

          <div className="flex flex-col justify-center border-l border-white/5 pl-4">
            <span className="text-[11px] text-slate-400 font-mono">Leaderboard</span>
            <span className="text-xl font-black font-mono text-amber-400">
              {selectedMode.leaderboardPosition ? `#${selectedMode.leaderboardPosition} KR` : 'Top Tier'}
            </span>
            <span className="text-xs text-slate-400 font-mono mt-0.5">
              {selectedMode.topRankPercentile}
            </span>
          </div>
        </div>

        {/* Quick Grid of all mode ranks with real rank emblems */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {player.gameModes.map((mode) => {
            const isSelected = activeModeKey === mode.modeKey;
            return (
              <button
                key={mode.modeKey}
                onClick={() => setActiveModeKey(mode.modeKey)}
                className={`p-3 rounded-xl text-left transition-all cursor-pointer border flex flex-col items-center text-center ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-400 text-white shadow-md'
                    : 'bg-black/30 border-white/5 hover:border-white/20'
                }`}
              >
                <img
                  src={getRankEmblemUrl(mode.tier)}
                  alt={mode.tier}
                  className="w-10 h-10 object-contain mb-1 drop-shadow"
                />
                <span className="text-[10px] text-slate-400 block truncate w-full">{mode.modeName}</span>
                <span className="text-xs font-bold text-amber-400 block mt-0.5">{mode.tier}</span>
                <span className="text-xs font-mono text-white block font-bold">
                  {mode.lpOrRating.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono block">{mode.winRate}% WR</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature 2: Previous Season History with Timeline Slider */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-white font-heading">
              Career Splits & Seasons
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setSeasonIndex((prev) => Math.min(player.seasonHistory.length - 1, prev + 1))}
              disabled={seasonIndex >= player.seasonHistory.length - 1}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300">
              {selectedSeason.season} ({seasonIndex + 1}/{player.seasonHistory.length})
            </span>
            <button
              onClick={() => setSeasonIndex((prev) => Math.max(0, prev - 1))}
              disabled={seasonIndex <= 0}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 disabled:opacity-30 border border-white/10 text-white transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={player.seasonHistory.length - 1}
            value={seasonIndex}
            onChange={(e) => setSeasonIndex(Number(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            {player.seasonHistory.map((s, idx) => (
              <span
                key={s.season}
                onClick={() => setSeasonIndex(idx)}
                className={`cursor-pointer transition-colors ${
                  idx === seasonIndex ? 'text-amber-400 font-bold' : 'hover:text-slate-300'
                }`}
              >
                {s.season}
              </span>
            ))}
          </div>
        </div>

        {/* Selected Season Card with Real Rank Emblem & Champions */}
        <div className="p-5 rounded-xl bg-black/40 border border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-5 flex items-center gap-4">
            <img
              src={getRankEmblemUrl(selectedSeason.tier)}
              alt={selectedSeason.tier}
              className="w-16 h-16 object-contain drop-shadow-md"
            />
            <div>
              <span className="text-xs font-mono text-slate-400 block">{selectedSeason.season}</span>
              <h3 className="text-xl font-black font-heading text-amber-400">
                {selectedSeason.tier}
              </h3>
              <div className="text-xs font-mono text-slate-200">
                Final: <strong>{selectedSeason.lp} LP</strong> • Peak:{' '}
                <strong className="text-amber-400">{selectedSeason.peakLp} LP</strong>
              </div>
              <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                {selectedSeason.wins}W {selectedSeason.losses}L (
                {Math.round((selectedSeason.wins / (selectedSeason.wins + selectedSeason.losses)) * 100)}% WR)
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
              Top Champions in {selectedSeason.season}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {selectedSeason.topChampions.map((champ) => (
                <div
                  key={champ.championId}
                  className="p-2 rounded-lg bg-black/30 border border-white/5 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-white">{champ.championName}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{champ.winRate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

