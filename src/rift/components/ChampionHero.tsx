import React from 'react';
import { TrendingUp, Shield } from 'lucide-react';
import { ChampionMeta, Role } from '../types/league';
import { CHAMPIONS_METADATA } from '../data/mockLeagueData';

interface ChampionHeroProps {
  champion: ChampionMeta;
  onSelectChampion: (id: string) => void;
  onSelectRole: (role: Role) => void;
}

export const ChampionHero: React.FC<ChampionHeroProps> = ({ champion, onSelectChampion }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden glass-card border border-white/10 shadow-2xl">
      {/* Dynamic Champion Splash Art Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={champion.splashUrl}
          alt={champion.name}
          className="w-full h-full object-cover object-top scale-105 filter blur-xs opacity-25 brightness-75 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080a10]/60 via-[#080a10]/40 to-transparent backdrop-blur-md" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a10]/70 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-5 md:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left: Champion Profile & Identity */}
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Champion Icon with Neon Tier Ring */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 shadow-lg">
              <img
                src={champion.iconUrl}
                alt={champion.name}
                className="w-full h-full rounded-[14px] object-cover"
              />
            </div>
            <span className="absolute -top-1.5 -right-1.5 px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] font-heading shadow border border-yellow-200">
              {champion.tier}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide font-heading">
                {champion.name}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-300 font-mono font-semibold">
                {champion.role}
              </span>
              <span className="text-xs text-slate-400 font-serif italic hidden sm:inline">
                {champion.title}
              </span>
            </div>

            {/* In-Game Abilities Bar with Spell Symbols */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {(['P', 'Q', 'W', 'E', 'R'] as const).map((key) => {
                const ability = champion.abilities[key];
                return (
                  <div
                    key={key}
                    title={`${ability.name} (${key}): ${ability.description}`}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-black/60 border border-white/10 hover:border-sky-400/50 transition-all cursor-default"
                  >
                    <div className="w-6 h-6 rounded overflow-hidden border border-white/20">
                      <img
                        src={ability.icon}
                        alt={ability.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold pr-0.5">
                      {ability.symbol}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Champion Switcher */}
            <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar max-w-md">
              {CHAMPIONS_METADATA.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectChampion(c.id)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    champion.id === c.id
                      ? 'bg-sky-500 text-white font-bold shadow'
                      : 'bg-black/40 text-slate-400 hover:text-white'
                  }`}
                >
                  <img src={c.iconUrl} alt={c.name} className="w-3.5 h-3.5 rounded-full" />
                  <span className="text-[11px]">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Clean Metric Badges (Minimal Words, Big Numbers) */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Win Rate */}
          <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 min-w-[85px] text-center flex-1 sm:flex-none">
            <span className="text-lg font-black font-mono text-emerald-400 block">
              {champion.winRate}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Win Rate</span>
          </div>

          {/* Pick Rate */}
          <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 min-w-[85px] text-center flex-1 sm:flex-none">
            <span className="text-lg font-black font-mono text-sky-400 block">
              {champion.pickRate}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Pick Rate</span>
          </div>

          {/* Ban Rate */}
          <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 min-w-[85px] text-center flex-1 sm:flex-none">
            <span className="text-lg font-black font-mono text-rose-400 block">
              {champion.banRate}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono uppercase block">Ban Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

