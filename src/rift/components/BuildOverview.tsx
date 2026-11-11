import React, { useState } from 'react';
import { Shield, Zap, ArrowRight, FastForward, Info } from 'lucide-react';
import { ChampionMeta, ItemInfo, RuneInfo, BuildVariant, StatShard } from '../types/league';
import { RUNE_TREES, RUNES, STAT_SHARDS } from '../data/mockLeagueData';

interface BuildOverviewProps {
  champion: ChampionMeta;
}

export const BuildOverview: React.FC<BuildOverviewProps> = ({ champion }) => {
  const [hoveredItem, setHoveredItem] = useState<ItemInfo | null>(null);
  const [hoveredRune, setHoveredRune] = useState<RuneInfo | StatShard | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    champion.buildVariants?.[0]?.id || 'standard'
  );

  const activeVariant: BuildVariant | undefined =
    champion.buildVariants?.find((v) => v.id === selectedVariantId) ||
    champion.buildVariants?.[0];

  const runes = activeVariant ? activeVariant.recommendedRunes : champion.recommendedRunes;
  const coreBuild = activeVariant ? activeVariant.coreBuild : champion.coreBuild;
  const startingItems = activeVariant ? activeVariant.startingItems : champion.startingItems;
  const boots = activeVariant ? activeVariant.boots : champion.boots;
  const situationalItems = activeVariant ? activeVariant.situationalItems : champion.situationalItems;
  const maxOrder = activeVariant ? activeVariant.maxOrder : champion.skillOrder.maxOrder;

  const totalCoreCost = coreBuild.reduce((sum, item) => sum + item.cost, 0);

  const primaryTreeMeta = RUNE_TREES[runes.primaryTree] || RUNE_TREES.Domination;
  const secondaryTreeMeta = RUNE_TREES[runes.secondaryTree] || RUNE_TREES.Sorcery;

  // Get all runes for primary and secondary tree to show client-accurate rows with dim unselected runes
  const primaryKeystones = Object.values(RUNES).filter((r) => r.tree === runes.primaryTree && r.isKeystone);
  const primaryMinors = Object.values(RUNES).filter((r) => r.tree === runes.primaryTree && !r.isKeystone);

  // Split primary minors into 3 rows of 3 (standard League rune tree architecture)
  const primaryRow1 = primaryMinors.slice(0, 3);
  const primaryRow2 = primaryMinors.slice(3, 6);
  const primaryRow3 = primaryMinors.slice(6, 9);

  // Secondary tree minors
  const secondaryMinors = Object.values(RUNES).filter((r) => r.tree === runes.secondaryTree && !r.isKeystone);
  const secondaryRow1 = secondaryMinors.slice(0, 3);
  const secondaryRow2 = secondaryMinors.slice(3, 6);
  const secondaryRow3 = secondaryMinors.slice(6, 9);

  const selectedPrimaryIds = [
    runes.primarySlot1.id,
    runes.primarySlot2.id,
    runes.primarySlot3.id,
  ];

  const selectedSecondaryIds = [
    runes.secondarySlot1.id,
    runes.secondarySlot2.id,
  ];

  return (
    <div className="space-y-6">
      {/* Build Variant Switcher */}
      {champion.buildVariants && champion.buildVariants.length > 0 && (
        <div className="p-2.5 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase text-slate-200">
              Build Variant
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {champion.buildVariants.map((variant) => {
              const isSelected = variant.id === (activeVariant?.id || champion.buildVariants[0].id);
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500/30 text-white border border-sky-400/80 shadow-md shadow-sky-500/20'
                      : 'bg-[#141b30]/40 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  <span>{variant.icon}</span>
                  <span>{variant.title}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isSelected ? 'bg-sky-950 text-sky-300 border border-sky-400/30' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {variant.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Grid: League Client Constellation Rune Tree (5 cols) & Items/Progression (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: AUTHENTIC LEAGUE CLIENT CIRCULAR RUNE TREE */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Tree Crest Headers */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black/60 p-1.5 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)] flex items-center justify-center">
                  <img src={primaryTreeMeta.icon} alt={runes.primaryTree} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-heading">{runes.primaryTree}</div>
                  <div className="text-[10px] text-amber-400 font-mono">Primary</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-white font-heading">{runes.secondaryTree}</div>
                  <div className="text-[10px] text-sky-400 font-mono">Secondary</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-black/60 p-1.5 border border-sky-400/40 shadow-[0_0_12px_rgba(14,165,233,0.25)] flex items-center justify-center">
                  <img src={secondaryTreeMeta.icon} alt={runes.secondaryTree} className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* League Client Layout: Primary Path (Left) | Secondary & Shards (Right) */}
            <div className="grid grid-cols-2 gap-6 pt-5 relative">
              {/* Vertical Divider Line with energy glow */}
              <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-amber-400/30 via-white/10 to-sky-400/30" />

              {/* PRIMARY PATH (Constellation Layout - NO RECTANGLES) */}
              <div className="flex flex-col items-center space-y-4 relative z-10">
                {/* Keystone: Big circular socket with glowing golden ring */}
                <div className="flex flex-col items-center">
                  <div
                    onMouseEnter={() => setHoveredRune(runes.keystone)}
                    onMouseLeave={() => setHoveredRune(null)}
                    className="relative w-16 h-16 rounded-full p-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer group transition-transform hover:scale-105"
                  >
                    <div className="w-full h-full rounded-full bg-[#0a0d18] p-2 flex items-center justify-center overflow-hidden border border-amber-300/60">
                      <img
                        src={runes.keystone.icon}
                        alt={runes.keystone.name}
                        className="w-full h-full object-contain filter group-hover:brightness-110"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-300 mt-1.5 font-heading text-center">
                    {runes.keystone.name}
                  </span>
                </div>

                {/* Vertical Energy Conduit Line */}
                <div className="w-0.5 h-4 bg-gradient-to-b from-amber-400/60 to-amber-400/20" />

                {/* Tier 1 Minor Runes Row */}
                <div className="flex items-center justify-center gap-3.5 w-full">
                  {primaryRow1.map((rune) => {
                    const isSelected = selectedPrimaryIds.includes(rune.id);
                    return (
                      <div
                        key={rune.id}
                        onMouseEnter={() => setHoveredRune(rune)}
                        onMouseLeave={() => setHoveredRune(null)}
                        className={`relative rounded-full transition-all cursor-pointer ${
                          isSelected
                            ? 'w-10 h-10 p-0.5 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.45)] scale-110'
                            : 'w-8 h-8 p-0.5 bg-white/10 opacity-30 hover:opacity-80 hover:scale-105'
                        }`}
                      >
                        <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                          <img src={rune.icon} alt={rune.name} className="w-full h-full object-contain" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vertical Energy Conduit Line */}
                <div className="w-0.5 h-3 bg-gradient-to-b from-amber-400/30 to-amber-400/20" />

                {/* Tier 2 Minor Runes Row */}
                <div className="flex items-center justify-center gap-3.5 w-full">
                  {primaryRow2.map((rune) => {
                    const isSelected = selectedPrimaryIds.includes(rune.id);
                    return (
                      <div
                        key={rune.id}
                        onMouseEnter={() => setHoveredRune(rune)}
                        onMouseLeave={() => setHoveredRune(null)}
                        className={`relative rounded-full transition-all cursor-pointer ${
                          isSelected
                            ? 'w-10 h-10 p-0.5 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.45)] scale-110'
                            : 'w-8 h-8 p-0.5 bg-white/10 opacity-30 hover:opacity-80 hover:scale-105'
                        }`}
                      >
                        <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                          <img src={rune.icon} alt={rune.name} className="w-full h-full object-contain" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Vertical Energy Conduit Line */}
                <div className="w-0.5 h-3 bg-gradient-to-b from-amber-400/30 to-amber-400/20" />

                {/* Tier 3 Minor Runes Row */}
                <div className="flex items-center justify-center gap-3.5 w-full">
                  {primaryRow3.map((rune) => {
                    const isSelected = selectedPrimaryIds.includes(rune.id);
                    return (
                      <div
                        key={rune.id}
                        onMouseEnter={() => setHoveredRune(rune)}
                        onMouseLeave={() => setHoveredRune(null)}
                        className={`relative rounded-full transition-all cursor-pointer ${
                          isSelected
                            ? 'w-10 h-10 p-0.5 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.45)] scale-110'
                            : 'w-8 h-8 p-0.5 bg-white/10 opacity-30 hover:opacity-80 hover:scale-105'
                        }`}
                      >
                        <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                          <img src={rune.icon} alt={rune.name} className="w-full h-full object-contain" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECONDARY PATH & STAT SHARDS (Right Side) */}
              <div className="flex flex-col items-center space-y-4 relative z-10">
                {/* Secondary Minor Row 1 */}
                <div className="flex items-center justify-center gap-3.5 w-full pt-3">
                  {secondaryRow1.map((rune) => {
                    const isSelected = selectedSecondaryIds.includes(rune.id);
                    return (
                      <div
                        key={rune.id}
                        onMouseEnter={() => setHoveredRune(rune)}
                        onMouseLeave={() => setHoveredRune(null)}
                        className={`relative rounded-full transition-all cursor-pointer ${
                          isSelected
                            ? 'w-10 h-10 p-0.5 bg-gradient-to-b from-sky-400 to-indigo-500 shadow-[0_0_15px_rgba(14,165,233,0.45)] scale-110'
                            : 'w-8 h-8 p-0.5 bg-white/10 opacity-30 hover:opacity-80 hover:scale-105'
                        }`}
                      >
                        <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                          <img src={rune.icon} alt={rune.name} className="w-full h-full object-contain" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="w-0.5 h-3 bg-gradient-to-b from-sky-400/30 to-sky-400/20" />

                {/* Secondary Minor Row 2 */}
                <div className="flex items-center justify-center gap-3.5 w-full">
                  {secondaryRow2.map((rune) => {
                    const isSelected = selectedSecondaryIds.includes(rune.id);
                    return (
                      <div
                        key={rune.id}
                        onMouseEnter={() => setHoveredRune(rune)}
                        onMouseLeave={() => setHoveredRune(null)}
                        className={`relative rounded-full transition-all cursor-pointer ${
                          isSelected
                            ? 'w-10 h-10 p-0.5 bg-gradient-to-b from-sky-400 to-indigo-500 shadow-[0_0_15px_rgba(14,165,233,0.45)] scale-110'
                            : 'w-8 h-8 p-0.5 bg-white/10 opacity-30 hover:opacity-80 hover:scale-105'
                        }`}
                      >
                        <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                          <img src={rune.icon} alt={rune.name} className="w-full h-full object-contain" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="w-0.5 h-3 bg-gradient-to-b from-sky-400/30 to-sky-400/20" />

                {/* Secondary Minor Row 3 */}
                <div className="flex items-center justify-center gap-3.5 w-full">
                  {secondaryRow3.map((rune) => {
                    const isSelected = selectedSecondaryIds.includes(rune.id);
                    return (
                      <div
                        key={rune.id}
                        onMouseEnter={() => setHoveredRune(rune)}
                        onMouseLeave={() => setHoveredRune(null)}
                        className={`relative rounded-full transition-all cursor-pointer ${
                          isSelected
                            ? 'w-10 h-10 p-0.5 bg-gradient-to-b from-sky-400 to-indigo-500 shadow-[0_0_15px_rgba(14,165,233,0.45)] scale-110'
                            : 'w-8 h-8 p-0.5 bg-white/10 opacity-30 hover:opacity-80 hover:scale-105'
                        }`}
                      >
                        <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                          <img src={rune.icon} alt={rune.name} className="w-full h-full object-contain" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* STAT SHARDS (3 Rows of 3 Circles, Client accurate) */}
                <div className="w-full pt-4 border-t border-white/10 space-y-2">
                  {(['offense', 'flex', 'defense'] as const).map((slotKey) => {
                    const rowShards = STAT_SHARDS.filter((s) => s.slot === slotKey);
                    const activeShard = runes.shards.find((s) => s.slot === slotKey) || rowShards[0];

                    return (
                      <div key={slotKey} className="flex items-center justify-center gap-3">
                        {rowShards.map((shard) => {
                          const isSelected = shard.name === activeShard.name;
                          return (
                            <div
                              key={shard.id}
                              onMouseEnter={() => setHoveredRune(shard)}
                              onMouseLeave={() => setHoveredRune(null)}
                              className={`relative rounded-full transition-all cursor-pointer ${
                                isSelected
                                  ? 'w-7 h-7 p-0.5 bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_0_10px_rgba(52,211,153,0.4)] scale-110'
                                  : 'w-6 h-6 p-0.5 bg-white/10 opacity-30 hover:opacity-80 hover:scale-105'
                              }`}
                            >
                              <div className="w-full h-full rounded-full bg-[#0a0d18] p-0.5 flex items-center justify-center overflow-hidden">
                                <img src={shard.icon} alt={shard.name} className="w-full h-full object-contain" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Floating Tooltip Info Display (Clean & Minimal) */}
            <div className="mt-5 min-h-[52px] p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
              {hoveredRune ? (
                <>
                  <div className="w-7 h-7 rounded-full bg-slate-900 p-1 border border-white/20 flex-shrink-0 flex items-center justify-center">
                    <img src={hoveredRune.icon} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-300 truncate">{hoveredRune.name}</span>
                      {'tree' in hoveredRune && (
                        <span className="text-[10px] text-slate-400 font-mono">({hoveredRune.tree})</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 truncate leading-tight mt-0.5">
                      {hoveredRune.description}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hover any rune or stat shard for in-game stats</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ITEMS & LEVEL PROGRESSION */}
        <div className="lg:col-span-7 space-y-6">
          {/* Core Build & Starting */}
          <div className="glass-card rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white font-heading">Item Path</h2>
              </div>
              <span className="text-xs font-mono text-slate-300">
                Cost: <strong className="text-amber-400">{totalCoreCost.toLocaleString()}g</strong>
              </span>
            </div>

            {/* Starting Items */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Starting
              </span>
              <div className="flex items-center gap-2.5 flex-wrap">
                {startingItems.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/30 border border-white/10 hover:border-sky-400/50 transition-all cursor-pointer"
                  >
                    <img src={item.icon} alt={item.name} className="w-7 h-7 rounded-lg border border-slate-700" />
                    <div>
                      <span className="text-xs font-semibold text-white block">{item.name}</span>
                      <span className="text-[10px] font-mono text-amber-400">{item.cost}g</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Core Power Spike Items */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Core 3-Item Rush
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {coreBuild.map((item, idx) => (
                  <div
                    key={item.id}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="p-3 rounded-xl bg-gradient-to-b from-black/40 to-black/20 border border-white/10 hover:border-emerald-400/60 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <span className="absolute top-2 right-2 text-[9px] font-mono font-bold px-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-10 h-10 rounded-xl border border-slate-700 shadow"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{item.name}</span>
                        <span className="text-[11px] font-mono text-amber-400 font-bold block">{item.cost}g</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 line-clamp-1">{item.stats}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Boots & Situational */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
                  Boots
                </span>
                <div className="flex items-center gap-2">
                  {boots.map((item) => (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-black/30 border border-white/10 hover:border-sky-400/50 transition-all cursor-pointer flex-1"
                    >
                      <img src={item.icon} alt={item.name} className="w-8 h-8 rounded-lg border border-slate-700" />
                      <div>
                        <span className="text-xs font-semibold text-white block">{item.name}</span>
                        <span className="text-[10px] text-amber-400 font-mono">{item.cost}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1.5">
                  Situational
                </span>
                <div className="flex items-center gap-2">
                  {situationalItems.map((item) => (
                    <div
                      key={item.id}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="p-1 rounded-lg bg-black/30 border border-white/10 hover:border-sky-400/50 transition-all cursor-pointer"
                      title={item.name}
                    >
                      <img src={item.icon} alt={item.name} className="w-8 h-8 rounded-md border border-slate-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hovered Item Tooltip */}
            {hoveredItem && (
              <div className="p-3 rounded-xl bg-[#090d1a]/95 border border-sky-400/50 text-xs animate-fadeIn space-y-1 shadow-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-300 text-xs">{hoveredItem.name}</span>
                  <span className="font-mono text-amber-400 font-bold">{hoveredItem.cost} Gold</span>
                </div>
                <p className="text-emerald-400 font-mono text-[10px]">{hoveredItem.stats}</p>
                <p className="text-slate-300 text-[11px] leading-relaxed">{hoveredItem.description}</p>
              </div>
            )}
          </div>

          {/* Skill Order Flow & Level Matrix (1-18) */}
          <div className="glass-card rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FastForward className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white font-heading">Skill Priority</h2>
              </div>

              <div className="flex items-center gap-2 bg-black/40 px-3 py-1 rounded-xl border border-sky-500/20">
                {maxOrder.map((key, i) => {
                  const ability = champion.abilities[key];
                  return (
                    <React.Fragment key={key}>
                      <div className="flex items-center gap-1" title={ability.name}>
                        <div className="w-5 h-5 rounded overflow-hidden border border-sky-400/40">
                          <img src={ability.icon} alt={ability.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-sky-300 font-mono">
                          {ability.symbol}
                        </span>
                      </div>
                      {i < maxOrder.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-slate-500" />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Level Progression Matrix (1-18) */}
            <div className="space-y-1.5 overflow-x-auto pb-1">
              {(['Q', 'W', 'E', 'R'] as const).map((skillKey) => {
                const ability = champion.abilities[skillKey];
                return (
                  <div key={skillKey} className="flex items-center gap-2 min-w-[500px]">
                    <div
                      className="w-8 h-8 rounded-lg overflow-hidden border border-white/20 bg-black/40 relative flex-shrink-0"
                      title={ability.name}
                    >
                      <img src={ability.icon} alt={ability.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-black/80 px-1 text-[7px] font-mono text-amber-300 font-bold rounded-tl">
                        {ability.symbol}
                      </span>
                    </div>

                    <div className="grid grid-cols-18 gap-1 flex-1">
                      {champion.skillOrder.progression.map((levelSkill, levelIdx) => {
                        const isAllocated = levelSkill === skillKey;
                        return (
                          <div
                            key={levelIdx}
                            className={`h-7 rounded flex items-center justify-center text-[9px] font-mono font-bold transition-all ${
                              isAllocated
                                ? skillKey === 'R'
                                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                                  : 'bg-sky-500 text-white font-bold shadow'
                                : 'bg-black/30 text-slate-600 border border-white/5'
                            }`}
                          >
                            {isAllocated ? levelIdx + 1 : ''}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 1-18 scale */}
            <div className="flex items-center gap-2 min-w-[500px] text-[9px] font-mono text-slate-500 pt-0.5">
              <span className="w-8 text-center">Lvl</span>
              <div className="grid grid-cols-18 gap-1 flex-1 text-center">
                {Array.from({ length: 18 }).map((_, idx) => (
                  <span key={idx}>{idx + 1}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

