import React from 'react';
import { UserCheck, RefreshCw, Trophy, Flame, Swords, Shield, ChevronRight } from 'lucide-react';
import { UserSummonerProfile } from '../types/league';
import { getRankEmblemUrl } from '../utils/buildCalculations';

interface UserSummonerCardProps {
  profile: UserSummonerProfile;
  onOpenSwitchModal: () => void;
  onSelectChampion?: (champId: string) => void;
}

export const UserSummonerCard: React.FC<UserSummonerCardProps> = ({
  profile,
  onOpenSwitchModal,
  onSelectChampion,
}) => {
  const winRate = Math.round((profile.soloWins / (profile.soloWins + profile.soloLosses)) * 100);

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6 border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-sky-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          {/* Profile Icon with Level Badge */}
          <div className="relative flex-shrink-0">
            <img
              src={profile.profileIconUrl}
              alt={profile.summonerName}
              className="w-14 h-14 rounded-2xl border-2 border-sky-400/40 object-cover shadow-lg"
            />
            <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.2 rounded-full bg-black/90 border border-white/20 text-[10px] font-mono text-sky-300 font-bold">
              {profile.level}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white font-heading tracking-wide">
                {profile.summonerName}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-sky-950 text-sky-400 font-mono font-semibold border border-sky-500/30">
                #{profile.tagline}
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-mono">
                {profile.region}
              </span>
            </div>

            {/* Solo Tier Emblem & LP */}
            <div className="flex items-center gap-2 mt-1 text-xs">
              <img
                src={getRankEmblemUrl(profile.soloTier)}
                alt={profile.soloTier}
                className="w-7 h-7 object-contain drop-shadow"
              />
              <span className="font-bold text-amber-400 font-heading tracking-wider">
                {profile.soloTier}
              </span>
              <span className="font-mono text-white font-bold">{profile.soloLp.toLocaleString()} LP</span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-emerald-400 font-bold">{winRate}% WR</span>
              <span className="text-slate-400 text-[11px]">
                ({profile.soloWins}W {profile.soloLosses}L)
              </span>
              {profile.streak > 1 && (
                <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono font-bold bg-amber-500/15 px-2 py-0.2 rounded-full border border-amber-500/30">
                  <Flame className="w-3 h-3 text-amber-400" /> {profile.streak} Streak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Change Summoner Button */}
        <button
          onClick={onOpenSwitchModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
          <span>Switch</span>
        </button>
      </div>

      {/* Main Stats Grid: Top Champions & Recent Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4 relative z-10">
        {/* Left: Top Champions Played (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>Most Played</span>
            <span>WR / Games</span>
          </div>

          <div className="space-y-2">
            {profile.topChampions.map((c) => (
              <div
                key={c.championId}
                onClick={() => onSelectChampion?.(c.championId)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 hover:border-sky-400/50 hover:bg-sky-950/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={c.iconUrl}
                    alt={c.championName}
                    className="w-9 h-9 rounded-xl border border-white/10 group-hover:border-sky-400/60 object-cover transition-colors"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block group-hover:text-sky-300 transition-colors truncate">
                      {c.championName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.kda} KDA</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-mono font-bold block ${
                      c.winRate >= 60 ? 'text-emerald-400' : 'text-sky-400'
                    }`}
                  >
                    {c.winRate}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{c.games}G</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Matches Stream (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>Recent Games</span>
            <div className="flex items-center gap-3 text-[10px]">
              <span>CS/M: {profile.averageCsPerMin}</span>
              <span>KP: {profile.averageKp}%</span>
            </div>
          </div>

          <div className="space-y-2">
            {profile.recentMatches.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  m.win
                    ? 'bg-sky-950/20 border-sky-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                {/* Champ & Result */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={m.championIcon}
                      alt={m.championName}
                      className="w-9 h-9 rounded-xl border border-white/15 object-cover"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 text-[8px] font-bold px-1 rounded font-mono ${
                        m.win ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {m.win ? 'W' : 'L'}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{m.championName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.role}</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-200">
                      {m.kills}/{m.deaths}/{m.assists}
                    </span>
                  </div>
                </div>

                {/* Items & Metrics */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1">
                    {m.items.slice(0, 5).map((item, i) =>
                      item ? (
                        <img
                          key={i}
                          src={item.icon}
                          alt={item.name}
                          title={item.name}
                          className="w-6 h-6 rounded-md border border-white/10"
                        />
                      ) : (
                        <div key={i} className="w-6 h-6 rounded-md bg-white/5 border border-white/5" />
                      )
                    )}
                  </div>

                  <div className="text-right text-[10px] font-mono text-slate-400">
                    <div className="text-slate-200 font-semibold">{m.cs} CS ({m.csPerMin}/m)</div>
                    <div>{m.timeAgo}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

