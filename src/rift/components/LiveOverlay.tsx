import React, { useState } from 'react';
import { Coins, Eye, MapPin, Radio, ShoppingBag, Swords, Timer, TrendingUp } from 'lucide-react';
import { ChampionMeta, ItemInfo, ProMatch } from '../types/league';
import { aggregateTeamStats } from '../utils/buildCalculations';

interface LiveOverlayProps {
  champion: ChampionMeta;
  match: ProMatch;
}

const compactGold = (value: number) => {
  if (value >= 1000) return (value / 1000).toFixed(1) + 'k';
  return value.toLocaleString();
};

export const LiveOverlay: React.FC<LiveOverlayProps> = ({ champion, match }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const current =
    match.blueTeam.find((player) => player.championId.toLowerCase() === champion.id.toLowerCase()) ||
    match.blueTeam.find((player) => player.isCurrentUserOrPro) ||
    match.blueTeam[0];

  const blueStats = aggregateTeamStats(match.blueTeam);
  const redStats = aggregateTeamStats(match.redTeam);
  const goldLead = blueStats.totalGold - redStats.totalGold;
  const totalGold = Math.max(1, blueStats.totalGold + redStats.totalGold);
  const blueGoldWidth = Math.max(35, Math.min(65, 50 + (goldLead / totalGold) * 100));
  const itemsFromCurrent = current.items.filter(Boolean) as ItemInfo[];
  const items = itemsFromCurrent.length > 0 ? itemsFromCurrent : match.items;
  const abilities = Object.values(champion.abilities).filter((ability) => ability.key !== 'P');
  const basicAbilities = abilities.filter((ability) => ability.key !== 'R');
  const ultimate = abilities.find((ability) => ability.key === 'R');
  const hasLongUltimate = Boolean(
    ultimate?.cooldownClass === 'long' ||
      (ultimate?.cooldownSeconds && Math.max(...ultimate.cooldownSeconds) >= 60)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-sky-300">
            <Radio className="h-3 w-3" />
            HUD / PREVIEW
          </div>
          <h2 className="mt-1 text-2xl font-heading font-extrabold text-white">Overlay</h2>
        </div>
        <span className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-mono font-bold text-emerald-300">
          LOW • GPU
        </span>
      </div>

      <div className="overlay-shell overflow-hidden rounded-xl border border-sky-500/30 bg-[#080b14]/95 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between border-b border-white/10 bg-[#0b0f1a] px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-sky-500/20 text-[10px] font-black text-sky-300">
              ◈
            </span>
            <span className="text-[10px] font-mono font-bold tracking-[0.16em] text-slate-200">ONYX</span>
            <span className="flex items-center gap-1 rounded-md border border-emerald-400/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              PREVIEW
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400" title="Game time">
              <Timer className="h-3 w-3" />
              {match.gameDurationMinutes}:00
            </span>
            <button
              type="button"
              onClick={() => setIsExpanded((open) => !open)}
              className="rounded-md border border-white/10 px-1.5 py-0.5 text-[11px] text-slate-400 hover:bg-white/10 hover:text-white"
              aria-label={isExpanded ? 'Collapse overlay' : 'Expand overlay'}
            >
              {isExpanded ? '⌃' : '⌄'}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-3 p-3">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
              <img
                src={current.championIcon || champion.iconUrl}
                alt={current.championName}
                className="h-12 w-12 rounded-lg border border-sky-400/40 object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-bold text-white">{current.summonerName}</span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400">{current.role}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[11px] font-mono">
                  <span className="font-bold text-white" title="Kills / Deaths / Assists">
                    {current.kills}/{current.deaths}/{current.assists}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300" title="Creep score">
                    {current.cs} CS
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-300" title="Current gold">
                    {compactGold(current.gold)}g
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono font-bold uppercase text-slate-500">KP</div>
                <div className="text-lg font-black text-sky-300">{match.killParticipation}%</div>
              </div>
            </div>

            <div className="rounded-lg border border-amber-400/20 bg-amber-500/5 p-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Coins className="h-4 w-4 text-amber-300" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-200">∆G</span>
                  <span
                    className={goldLead >= 0 ? 'text-sm font-black text-emerald-300' : 'text-sm font-black text-rose-300'}
                    title="Blue team gold minus red team gold"
                  >
                    {goldLead >= 0 ? '+' : '-'}{Math.abs(goldLead).toLocaleString()}g
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-500">
                  {match.blueTeam[0]?.teamTag || 'BLUE'} vs {match.redTeam[0]?.teamTag || 'RED'}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-rose-500/40">
                <div className="h-full rounded-full bg-sky-400" style={{ width: blueGoldWidth + '%' }} />
              </div>
              <div className="mt-1 flex items-center justify-between text-[9px] font-mono text-slate-500">
                <span>{compactGold(blueStats.totalGold)}g</span>
                <span>{compactGold(redStats.totalGold)}g</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-2">
              <div className="min-w-0">
                <div className="mb-1 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">ITEMS</div>
                <div className="flex items-center gap-1">
                  {items.slice(0, 6).map((item, index) => (
                    <img
                      key={item.id + '-' + index}
                      src={item.icon}
                      alt={item.name}
                      title={item.name + ' • ' + item.cost + 'g'}
                      className="h-7 w-7 rounded border border-white/10 bg-black/30 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              </div>
              <div className="shrink-0">
                <div className="mb-1 text-right text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500">SPELLS</div>
                <div className="flex items-center gap-1">
                  {basicAbilities.map((ability) => (
                    <img
                      key={ability.key}
                      src={ability.icon}
                      alt={ability.name}
                      title={ability.key + ' • ' + ability.name}
                      className="h-6 w-6 rounded border border-white/10 bg-black/30 object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                  {ultimate && hasLongUltimate && (
                    <img
                      src={ultimate.icon}
                      alt={ultimate.name}
                      title={'R • ' + ultimate.name}
                      className="h-8 w-8 rounded-full border border-amber-300/60 bg-black/30 object-cover shadow-[0_0_10px_rgba(251,191,36,0.25)]"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  {ultimate && !hasLongUltimate && (
                    <div
                      title={'R • ' + ultimate.name + ' • compact cooldown'}
                      className="relative flex h-7 w-7 items-center justify-center rounded-full border border-amber-300/50 bg-amber-500/10 text-[9px] font-black text-amber-200"
                    >
                      <span>R</span>
                      <span className="absolute -bottom-1 -right-1 text-[9px] text-slate-300">◷</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5 border-t border-white/5 pt-2">
              <div className="rounded-md bg-white/[0.03] px-2 py-1.5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500"><Swords className="h-3 w-3" /> KDA</div>
                <div className="mt-0.5 text-[11px] font-bold text-white">{current.kills + current.assists}/{current.deaths}</div>
              </div>
              <div className="rounded-md bg-white/[0.03] px-2 py-1.5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500"><TrendingUp className="h-3 w-3" /> GPM</div>
                <div className="mt-0.5 text-[11px] font-bold text-white">{Math.round(current.gold / Math.max(1, match.gameDurationMinutes))}g</div>
              </div>
              <div className="rounded-md bg-white/[0.03] px-2 py-1.5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500"><Eye className="h-3 w-3" /> WARD</div>
                <div className="mt-0.5 text-[11px] font-bold text-white">{match.trinket.name === 'Stealth Ward' ? '◉' : '—'}</div>
              </div>
              <div className="rounded-md bg-white/[0.03] px-2 py-1.5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500"><ShoppingBag className="h-3 w-3" /> RESET</div>
                <div className="mt-0.5 text-[11px] font-bold text-amber-200">{current.gold >= 900 ? 'OPEN' : 'SAVE'}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1.5 border-t border-white/5 pt-2">
              <div className="rounded-md border border-sky-400/10 bg-sky-500/[0.04] px-2 py-1.5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500"><Swords className="h-3 w-3" /> WAVE</div>
                <div className="mt-0.5 text-[11px] font-bold text-sky-200">HOLD</div>
              </div>
              <div className="rounded-md border border-emerald-400/10 bg-emerald-500/[0.04] px-2 py-1.5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500"><MapPin className="h-3 w-3" /> JGL</div>
                <div className="mt-0.5 text-[11px] font-bold text-emerald-200">SEEN</div>
              </div>
              <div className="rounded-md border border-amber-400/10 bg-amber-500/[0.04] px-2 py-1.5">
                <div className="flex items-center gap-1 text-[9px] font-mono text-slate-500"><Eye className="h-3 w-3" /> READ</div>
                <div className="mt-0.5 text-[11px] font-bold text-amber-200">DEMO</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-2">
          <div className="text-[9px] font-mono text-slate-500">∆G</div>
          <div className="text-xs font-black text-amber-300">{goldLead >= 0 ? '+' : '-'}{compactGold(Math.abs(goldLead))}</div>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-2">
          <div className="text-[9px] font-mono text-slate-500">CS/M</div>
          <div className="text-xs font-black text-white">{(current.cs / Math.max(1, match.gameDurationMinutes)).toFixed(1)}</div>
        </div>
        <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-2">
          <div className="text-[9px] font-mono text-slate-500">PATCH</div>
          <div className="text-xs font-black text-sky-300">14.23</div>
        </div>
      </div>
    </div>
  );
};
