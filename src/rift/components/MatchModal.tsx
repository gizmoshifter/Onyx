import React, { useState } from 'react';
import { X, Trophy, Swords, Clock, Coins, Flame, Shield, ArrowRight, Check } from 'lucide-react';
import { ProMatch, MatchPlayer } from '../types/league';
import { aggregateTeamStats } from '../utils/buildCalculations';

interface MatchModalProps {
  match: ProMatch | null;
  onClose: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ match, onClose }) => {
  if (!match) return null;

  const [activeTab, setActiveTab] = useState<'scoreboard' | 'timeline' | 'runes'>('scoreboard');

  // Compute team totals
  const blueStats = aggregateTeamStats(match.blueTeam);
  const redStats = aggregateTeamStats(match.redTeam);

  // Maximum damage for comparative bar charts
  const maxDamage = Math.max(
    ...match.blueTeam.map((p) => p.damage),
    ...match.redTeam.map((p) => p.damage),
    35000
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-2xl glass-card border border-sky-500/30 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-sky-950/60 via-slate-900/60 to-slate-950/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-10 rounded-full ${
                match.win ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-rose-500 shadow-[0_0_12px_#ef4444]'
              }`}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-bold text-white font-heading">
                  {match.proPlayerName} ({match.teamTag})
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    match.win
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {match.win ? 'VICTORY' : 'DEFEAT'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {match.region} Solo Queue • {match.gameDurationMinutes}m • {match.timeAgo}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Match Inspection & Telemetry • Game #{match.id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Sub-tabs */}
        <div className="px-5 py-2.5 bg-[#090c16]/90 border-b border-white/5 flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setActiveTab('scoreboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'scoreboard'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            10-Player Team Scoreboard
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Item Purchase Timeline
          </button>
          <button
            onClick={() => setActiveTab('runes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'runes'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Match Runes & Shards
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'scoreboard' && (
            <div className="space-y-6">
              {/* Blue Team Scoreboard */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono px-2">
                  <span className="font-bold text-sky-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                    BLUE TEAM ({match.win ? 'VICTORY' : 'DEFEAT'})
                  </span>
                  <span className="text-slate-400">
                    Total Kills: <strong className="text-white">{blueStats.totalKills}</strong> • Total Gold:{' '}
                    <strong className="text-amber-400">{(blueStats.totalGold).toLocaleString()}g</strong>
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sky-500/20 bg-[#080d1a]/80">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] bg-sky-950/20">
                        <th className="py-2.5 px-3">Champion / Summoner</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">KDA</th>
                        <th className="py-2.5 px-3">Damage</th>
                        <th className="py-2.5 px-3">CS</th>
                        <th className="py-2.5 px-3">Gold</th>
                        <th className="py-2.5 px-3">Items</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {match.blueTeam.map((p, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-sky-500/10 transition-colors ${
                            p.isCurrentUserOrPro ? 'bg-sky-500/15 font-semibold' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 flex items-center gap-2.5">
                            <img src={p.championIcon} alt={p.championName} className="w-8 h-8 rounded-lg border border-slate-700" />
                            <div>
                              <span className="font-bold text-white block">
                                {p.summonerName} {p.proTag ? `(${p.proTag})` : ''}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{p.championName} • {p.rankTier}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{p.role}</td>
                          <td className="py-2.5 px-3 font-mono">
                            <span className="text-white font-bold">{p.kills}</span> /{' '}
                            <span className="text-rose-400">{p.deaths}</span> /{' '}
                            <span className="text-white">{p.assists}</span>
                          </td>
                          <td className="py-2.5 px-3 w-36">
                            <div className="space-y-1">
                              <span className="font-mono text-[11px] text-slate-300">{p.damage.toLocaleString()}</span>
                              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-sky-400 rounded-full"
                                  style={{ width: `${Math.min(100, (p.damage / maxDamage) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{p.cs}</td>
                          <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">{p.gold.toLocaleString()}g</td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1">
                              {p.items.map((it, i) =>
                                it ? (
                                  <img key={i} src={it.icon} alt={it.name} className="w-6 h-6 rounded border border-slate-700" title={it.name} />
                                ) : (
                                  <div key={i} className="w-6 h-6 rounded bg-slate-900/60 border border-white/5" />
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Red Team Scoreboard */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono px-2">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    RED TEAM ({!match.win ? 'VICTORY' : 'DEFEAT'})
                  </span>
                  <span className="text-slate-400">
                    Total Kills: <strong className="text-white">{redStats.totalKills}</strong> • Total Gold:{' '}
                    <strong className="text-amber-400">{(redStats.totalGold).toLocaleString()}g</strong>
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-rose-500/20 bg-[#12080f]/80">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] bg-rose-950/20">
                        <th className="py-2.5 px-3">Champion / Summoner</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3">KDA</th>
                        <th className="py-2.5 px-3">Damage</th>
                        <th className="py-2.5 px-3">CS</th>
                        <th className="py-2.5 px-3">Gold</th>
                        <th className="py-2.5 px-3">Items</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {match.redTeam.map((p, idx) => (
                        <tr key={idx} className="hover:bg-rose-500/10 transition-colors">
                          <td className="py-2.5 px-3 flex items-center gap-2.5">
                            <img src={p.championIcon} alt={p.championName} className="w-8 h-8 rounded-lg border border-slate-700" />
                            <div>
                              <span className="font-bold text-white block">
                                {p.summonerName} {p.proTag ? `(${p.proTag})` : ''}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">{p.championName} • {p.rankTier}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{p.role}</td>
                          <td className="py-2.5 px-3 font-mono">
                            <span className="text-white font-bold">{p.kills}</span> /{' '}
                            <span className="text-rose-400">{p.deaths}</span> /{' '}
                            <span className="text-white">{p.assists}</span>
                          </td>
                          <td className="py-2.5 px-3 w-36">
                            <div className="space-y-1">
                              <span className="font-mono text-[11px] text-slate-300">{p.damage.toLocaleString()}</span>
                              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-rose-400 rounded-full"
                                  style={{ width: `${Math.min(100, (p.damage / maxDamage) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">{p.cs}</td>
                          <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">{p.gold.toLocaleString()}g</td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1">
                              {p.items.map((it, i) =>
                                it ? (
                                  <img key={i} src={it.icon} alt={it.name} className="w-6 h-6 rounded border border-slate-700" title={it.name} />
                                ) : (
                                  <div key={i} className="w-6 h-6 rounded bg-slate-900/60 border border-white/5" />
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Item Purchase Timeline & Power Spike History
              </span>

              {match.timeline.length === 0 ? (
                <p className="text-xs text-slate-400 p-4">Detailed minute-by-minute timeline not recorded for this match.</p>
              ) : (
                <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-500/30">
                  {match.timeline.map((event, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className="absolute left-2.5 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-slate-900" />
                      <div className="p-3.5 rounded-xl bg-[#0a0d18] border border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-bold text-sky-400">{event.minute}:00</span>
                          <span className="text-[11px] text-slate-400">{event.items.join(', ')}</span>
                        </div>
                        <p className="text-xs text-slate-200">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'runes' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#090b14] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-mono">Keystone Active</span>
                  <h4 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                    <span>{match.keystone.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-mono font-normal">
                      {match.keystone.tree}
                    </span>
                  </h4>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-sky-400 p-1 shadow-lg flex items-center justify-center">
                  <img src={match.keystone.icon} alt={match.keystone.name} className="w-full h-full object-contain" />
                </div>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Primary Runes ({match.keystone.tree})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {match.primaryRunes.map((r, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#0c1020] border border-white/5 text-center flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-900 p-1 mb-1 border border-white/10 flex items-center justify-center">
                        <img src={r.icon} alt={r.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-bold text-white block truncate w-full">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Secondary Runes ({match.secondaryTree})
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {match.secondaryRunes.map((r, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-[#0c1020] border border-white/5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 p-1 border border-white/10 flex-shrink-0 flex items-center justify-center">
                        <img src={r.icon} alt={r.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-bold text-white truncate">{r.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

