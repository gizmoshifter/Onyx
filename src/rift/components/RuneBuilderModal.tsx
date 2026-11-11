import React, { useState } from 'react';
import { Sparkles, Check, Copy, Info } from 'lucide-react';
import { RUNES, STAT_SHARDS, RUNE_TREES } from '../data/mockLeagueData';
import { RuneInfo, StatShard } from '../types/league';

export const RuneBuilderModal: React.FC = () => {
  const treeKeys = ['Domination', 'Precision', 'Sorcery', 'Resolve', 'Inspiration'] as const;
  type TreeType = (typeof treeKeys)[number];

  const [primaryTree, setPrimaryTree] = useState<TreeType>('Domination');
  const [secondaryTree, setSecondaryTree] = useState<TreeType>('Sorcery');

  // Keystones for primary tree
  const availableKeystones = Object.values(RUNES).filter((r) => r.tree === primaryTree && r.isKeystone);
  const [selectedKeystone, setSelectedKeystone] = useState<RuneInfo>(availableKeystones[0] || RUNES.electrocute);

  // Minor runes for primary tree
  const availablePrimaryMinors = Object.values(RUNES).filter((r) => r.tree === primaryTree && !r.isKeystone);
  const primaryRow1 = availablePrimaryMinors.slice(0, 3);
  const primaryRow2 = availablePrimaryMinors.slice(3, 6);
  const primaryRow3 = availablePrimaryMinors.slice(6, 9);

  const [selectedPrimaryMinors, setSelectedPrimaryMinors] = useState<string[]>([
    availablePrimaryMinors[0]?.id || '8139',
    availablePrimaryMinors[3]?.id || '8138',
    availablePrimaryMinors[6]?.id || '8106',
  ]);

  // Secondary tree minors
  const availableSecondaryMinors = Object.values(RUNES).filter((r) => r.tree === secondaryTree && !r.isKeystone);
  const secondaryRow1 = availableSecondaryMinors.slice(0, 3);
  const secondaryRow2 = availableSecondaryMinors.slice(3, 6);
  const secondaryRow3 = availableSecondaryMinors.slice(6, 9);

  const [selectedSecondaryMinors, setSelectedSecondaryMinors] = useState<string[]>([
    availableSecondaryMinors[0]?.id || '8226',
    availableSecondaryMinors[3]?.id || '8210',
  ]);

  // Stat Shards
  const [offenseShard, setOffenseShard] = useState(STAT_SHARDS[0].id);
  const [flexShard, setFlexShard] = useState(STAT_SHARDS[3].id);
  const [defenseShard, setDefenseShard] = useState(STAT_SHARDS[6].id);

  const [hoveredRune, setHoveredRune] = useState<RuneInfo | StatShard | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePrimaryChange = (tree: TreeType) => {
    setPrimaryTree(tree);
    if (secondaryTree === tree) {
      setSecondaryTree(tree === 'Domination' ? 'Precision' : 'Domination');
    }
    const newKeystones = Object.values(RUNES).filter((r) => r.tree === tree && r.isKeystone);
    if (newKeystones.length > 0) {
      setSelectedKeystone(newKeystones[0]);
    }
    const newMinors = Object.values(RUNES).filter((r) => r.tree === tree && !r.isKeystone);
    setSelectedPrimaryMinors([newMinors[0]?.id, newMinors[3]?.id, newMinors[6]?.id].filter(Boolean) as string[]);
  };

  const handleSecondaryChange = (tree: TreeType) => {
    setSecondaryTree(tree);
    const newMinors = Object.values(RUNES).filter((r) => r.tree === tree && !r.isKeystone);
    setSelectedSecondaryMinors([newMinors[0]?.id, newMinors[3]?.id].filter(Boolean) as string[]);
  };

  const selectPrimaryMinorRow = (id: string, rowIndex: number) => {
    const updated = [...selectedPrimaryMinors];
    updated[rowIndex] = id;
    setSelectedPrimaryMinors(updated);
  };

  const toggleSecondaryMinor = (id: string) => {
    if (selectedSecondaryMinors.includes(id)) {
      if (selectedSecondaryMinors.length > 1) {
        setSelectedSecondaryMinors(selectedSecondaryMinors.filter((m) => m !== id));
      }
    } else {
      if (selectedSecondaryMinors.length < 2) {
        setSelectedSecondaryMinors([...selectedSecondaryMinors, id]);
      } else {
        setSelectedSecondaryMinors([selectedSecondaryMinors[1], id]);
      }
    }
  };

  const copyBuildCode = () => {
    const code = `ONYX-RUNES:${primaryTree}/${selectedKeystone.name}/${selectedPrimaryMinors.join('+')}/${secondaryTree}/${selectedSecondaryMinors.join('+')}/${offenseShard}/${flexShard}/${defenseShard}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black/60 p-1.5 border border-amber-400/50 shadow flex items-center justify-center">
            <img src={RUNE_TREES[primaryTree].icon} alt="" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-heading">Rune Studio</h2>
              <span className="text-[10px] px-2 py-0.2 rounded font-mono bg-sky-950 text-sky-400 border border-sky-500/30">
                14.23
              </span>
            </div>
            <p className="text-xs text-slate-400">Interactive League Client Constellation Editor</p>
          </div>
        </div>

        <button
          onClick={copyBuildCode}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Export'}</span>
        </button>
      </div>

      {/* Main Client Constellation Layout */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
        {/* Tree Selectors */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          {/* Primary Tree Tabs (5 Circular Crests) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 mr-1">Primary:</span>
            {treeKeys.map((t) => {
              const isSelected = primaryTree === t;
              return (
                <button
                  key={t}
                  onClick={() => handlePrimaryChange(t)}
                  className={`w-9 h-9 rounded-full p-1.5 border transition-all cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-amber-500/30 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)] scale-110'
                      : 'bg-black/40 border-white/10 opacity-40 hover:opacity-100 hover:scale-105'
                  }`}
                  title={`Primary Tree: ${t}`}
                >
                  <img src={RUNE_TREES[t].icon} alt={t} className="w-full h-full object-contain" />
                </button>
              );
            })}
          </div>

          {/* Secondary Tree Tabs (4 Circular Crests) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-sky-400 mr-1">Secondary:</span>
            {treeKeys
              .filter((t) => t !== primaryTree)
              .map((t) => {
                const isSelected = secondaryTree === t;
                return (
                  <button
                    key={t}
                    onClick={() => handleSecondaryChange(t)}
                    className={`w-9 h-9 rounded-full p-1.5 border transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-sky-500/30 border-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.5)] scale-110'
                        : 'bg-black/40 border-white/10 opacity-40 hover:opacity-100 hover:scale-105'
                    }`}
                    title={`Secondary Tree: ${t}`}
                  >
                    <img src={RUNE_TREES[t].icon} alt={t} className="w-full h-full object-contain" />
                  </button>
                );
              })}
          </div>
        </div>

        {/* Constellation Body: Primary (Left) & Secondary / Shards (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative py-4">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-amber-400/30 via-white/10 to-sky-400/30" />

          {/* LEFT: PRIMARY TREE PATH (NO RECTANGLES) */}
          <div className="flex flex-col items-center space-y-5">
            {/* Keystones Row */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-2 font-bold">
                Keystones
              </span>
              <div className="flex items-center gap-4">
                {availableKeystones.map((k) => {
                  const isSelected = selectedKeystone.id === k.id;
                  return (
                    <div
                      key={k.id}
                      onClick={() => setSelectedKeystone(k)}
                      onMouseEnter={() => setHoveredRune(k)}
                      onMouseLeave={() => setHoveredRune(null)}
                      className={`relative rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? 'w-16 h-16 p-1 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 shadow-[0_0_25px_rgba(245,158,11,0.5)] scale-110'
                          : 'w-12 h-12 p-0.5 bg-white/10 opacity-35 hover:opacity-90 hover:scale-105'
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-[#0a0d18] p-1.5 flex items-center justify-center overflow-hidden border border-white/10">
                        <img src={k.icon} alt={k.name} className="w-full h-full object-contain" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-0.5 h-4 bg-gradient-to-b from-amber-400/50 to-amber-400/20" />

            {/* Minor Tier 1 Row */}
            <div className="flex items-center justify-center gap-5 w-full">
              {primaryRow1.map((r) => {
                const isSelected = selectedPrimaryMinors.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => selectPrimaryMinorRow(r.id, 0)}
                    onMouseEnter={() => setHoveredRune(r)}
                    onMouseLeave={() => setHoveredRune(null)}
                    className={`relative rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'w-11 h-11 p-0.5 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.45)] scale-110'
                        : 'w-9 h-9 p-0.5 bg-white/10 opacity-30 hover:opacity-85 hover:scale-105'
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                      <img src={r.icon} alt={r.name} className="w-full h-full object-contain" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-0.5 h-3 bg-gradient-to-b from-amber-400/30 to-amber-400/20" />

            {/* Minor Tier 2 Row */}
            <div className="flex items-center justify-center gap-5 w-full">
              {primaryRow2.map((r) => {
                const isSelected = selectedPrimaryMinors.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => selectPrimaryMinorRow(r.id, 1)}
                    onMouseEnter={() => setHoveredRune(r)}
                    onMouseLeave={() => setHoveredRune(null)}
                    className={`relative rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'w-11 h-11 p-0.5 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.45)] scale-110'
                        : 'w-9 h-9 p-0.5 bg-white/10 opacity-30 hover:opacity-85 hover:scale-105'
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                      <img src={r.icon} alt={r.name} className="w-full h-full object-contain" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-0.5 h-3 bg-gradient-to-b from-amber-400/30 to-amber-400/20" />

            {/* Minor Tier 3 Row */}
            <div className="flex items-center justify-center gap-5 w-full">
              {primaryRow3.map((r) => {
                const isSelected = selectedPrimaryMinors.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => selectPrimaryMinorRow(r.id, 2)}
                    onMouseEnter={() => setHoveredRune(r)}
                    onMouseLeave={() => setHoveredRune(null)}
                    className={`relative rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'w-11 h-11 p-0.5 bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.45)] scale-110'
                        : 'w-9 h-9 p-0.5 bg-white/10 opacity-30 hover:opacity-85 hover:scale-105'
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                      <img src={r.icon} alt={r.name} className="w-full h-full object-contain" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: SECONDARY TREE & STAT SHARDS */}
          <div className="flex flex-col items-center space-y-5">
            <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest font-bold">
              Secondary (Select 2)
            </span>

            {/* Secondary Row 1 */}
            <div className="flex items-center justify-center gap-5 w-full">
              {secondaryRow1.map((r) => {
                const isSelected = selectedSecondaryMinors.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => toggleSecondaryMinor(r.id)}
                    onMouseEnter={() => setHoveredRune(r)}
                    onMouseLeave={() => setHoveredRune(null)}
                    className={`relative rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'w-11 h-11 p-0.5 bg-gradient-to-b from-sky-400 to-indigo-500 shadow-[0_0_15px_rgba(14,165,233,0.45)] scale-110'
                        : 'w-9 h-9 p-0.5 bg-white/10 opacity-30 hover:opacity-85 hover:scale-105'
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                      <img src={r.icon} alt={r.name} className="w-full h-full object-contain" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-0.5 h-3 bg-gradient-to-b from-sky-400/30 to-sky-400/20" />

            {/* Secondary Row 2 */}
            <div className="flex items-center justify-center gap-5 w-full">
              {secondaryRow2.map((r) => {
                const isSelected = selectedSecondaryMinors.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => toggleSecondaryMinor(r.id)}
                    onMouseEnter={() => setHoveredRune(r)}
                    onMouseLeave={() => setHoveredRune(null)}
                    className={`relative rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'w-11 h-11 p-0.5 bg-gradient-to-b from-sky-400 to-indigo-500 shadow-[0_0_15px_rgba(14,165,233,0.45)] scale-110'
                        : 'w-9 h-9 p-0.5 bg-white/10 opacity-30 hover:opacity-85 hover:scale-105'
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                      <img src={r.icon} alt={r.name} className="w-full h-full object-contain" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-0.5 h-3 bg-gradient-to-b from-sky-400/30 to-sky-400/20" />

            {/* Secondary Row 3 */}
            <div className="flex items-center justify-center gap-5 w-full">
              {secondaryRow3.map((r) => {
                const isSelected = selectedSecondaryMinors.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => toggleSecondaryMinor(r.id)}
                    onMouseEnter={() => setHoveredRune(r)}
                    onMouseLeave={() => setHoveredRune(null)}
                    className={`relative rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'w-11 h-11 p-0.5 bg-gradient-to-b from-sky-400 to-indigo-500 shadow-[0_0_15px_rgba(14,165,233,0.45)] scale-110'
                        : 'w-9 h-9 p-0.5 bg-white/10 opacity-30 hover:opacity-85 hover:scale-105'
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-[#0a0d18] p-1 flex items-center justify-center overflow-hidden">
                      <img src={r.icon} alt={r.name} className="w-full h-full object-contain" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* STAT SHARDS (3 Tiers of Circular Nodes) */}
            <div className="w-full pt-4 border-t border-white/10 space-y-2.5">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block text-center font-bold">
                Stat Shards
              </span>

              {/* Offense */}
              <div className="flex items-center justify-center gap-3">
                {STAT_SHARDS.filter((s) => s.slot === 'offense').map((s) => {
                  const isSelected = offenseShard === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setOffenseShard(s.id)}
                      onMouseEnter={() => setHoveredRune(s)}
                      onMouseLeave={() => setHoveredRune(null)}
                      className={`relative rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? 'w-8 h-8 p-0.5 bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_0_10px_rgba(52,211,153,0.4)] scale-110'
                          : 'w-7 h-7 p-0.5 bg-white/10 opacity-30 hover:opacity-85 hover:scale-105'
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-[#0a0d18] p-0.5 flex items-center justify-center overflow-hidden">
                        <img src={s.icon} alt={s.name} className="w-full h-full object-contain" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Flex */}
              <div className="flex items-center justify-center gap-3">
                {STAT_SHARDS.filter((s) => s.slot === 'flex').map((s) => {
                  const isSelected = flexShard === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setFlexShard(s.id)}
                      onMouseEnter={() => setHoveredRune(s)}
                      onMouseLeave={() => setHoveredRune(null)}
                      className={`relative rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? 'w-8 h-8 p-0.5 bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_0_10px_rgba(52,211,153,0.4)] scale-110'
                          : 'w-7 h-7 p-0.5 bg-white/10 opacity-30 hover:opacity-85 hover:scale-105'
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-[#0a0d18] p-0.5 flex items-center justify-center overflow-hidden">
                        <img src={s.icon} alt={s.name} className="w-full h-full object-contain" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Defense */}
              <div className="flex items-center justify-center gap-3">
                {STAT_SHARDS.filter((s) => s.slot === 'defense').map((s) => {
                  const isSelected = defenseShard === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setDefenseShard(s.id)}
                      onMouseEnter={() => setHoveredRune(s)}
                      onMouseLeave={() => setHoveredRune(null)}
                      className={`relative rounded-full transition-all cursor-pointer ${
                        isSelected
                          ? 'w-8 h-8 p-0.5 bg-gradient-to-b from-emerald-400 to-teal-600 shadow-[0_0_10px_rgba(52,211,153,0.4)] scale-110'
                          : 'w-7 h-7 p-0.5 bg-white/10 opacity-30 hover:opacity-85 hover:scale-105'
                      }`}
                    >
                      <div className="w-full h-full rounded-full bg-[#0a0d18] p-0.5 flex items-center justify-center overflow-hidden">
                        <img src={s.icon} alt={s.name} className="w-full h-full object-contain" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Hovered Rune Tooltip Card */}
        <div className="min-h-[50px] p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-3">
          {hoveredRune ? (
            <>
              <div className="w-7 h-7 rounded-full bg-slate-900 p-1 border border-white/20 flex items-center justify-center flex-shrink-0">
                <img src={hoveredRune.icon} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-amber-300 mr-2">{hoveredRune.name}</span>
                <span className="text-[11px] text-slate-300 leading-tight">{hoveredRune.description}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Info className="w-3.5 h-3.5" />
              <span>Click nodes to build rune page • Hover for details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

