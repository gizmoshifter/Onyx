import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { LogicalSize } from "@tauri-apps/api/dpi";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  Activity,
  ArrowUpRight,
  Award,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  CircleHelp,
  Crosshair,
  Flame,
  Gauge,
  Gem,
  Hammer,
  History,
  Layers3,
  LayoutDashboard,
  Library,
  LockKeyhole,
  MonitorUp,
  MousePointer2,
  RefreshCw,
  Search,
  Settings2,
  Shield,
  Sparkles,
  Swords,
  Target,
  Timer,
  Trophy,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { championIconUrl, getChampionCatalog, type Champion, type ChampionCatalog } from "./lib/riotData";
import RiftDashboard from "./rift/RiftDashboard";

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

type Mode = "standalone" | "pregame" | "overlay";
type PregameTab = "builds" | "matchups" | "runes";
type IconType = typeof LayoutDashboard;

type LiveItem = { id: string; name: string };
type LiveGame = {
  riotId: string;
  champion: string;
  gameMode: string;
  gameTime: number;
  level: number;
  currentGold: number;
  kills: number;
  deaths: number;
  assists: number;
  cs: number;
  csPerMinute: number;
  towers: number;
  firstBlood: string | null;
  firstTower: string | null;
  items: LiveItem[];
};

const CDN = "https://ddragon.leagueoflegends.com/cdn";
const PATCH_FALLBACK = "16.22.1";
const modes: { id: Mode; label: string; hint: string; icon: IconType }[] = [
  { id: "standalone", label: "Home", hint: "Out of game", icon: LayoutDashboard },
  { id: "pregame", label: "Prep", hint: "Before match", icon: Crosshair },
  { id: "overlay", label: "Overlay", hint: "In game", icon: MonitorUp },
];
const pregameTabs: { id: PregameTab; label: string; icon: IconType }[] = [
  { id: "builds", label: "Build", icon: Hammer },
  { id: "matchups", label: "Matchup", icon: Swords },
  { id: "runes", label: "Runes", icon: WandSparkles },
];
const roles = [
  { label: "ALL", icon: Layers3 }, { label: "TOP", icon: Shield }, { label: "JUNGLE", icon: Target },
  { label: "MID", icon: Sparkles }, { label: "BOT", icon: Crosshair }, { label: "SUPPORT", icon: Award },
];
const matchHistory = [
  { champion: "Jinx", result: "WIN", kda: "9 / 2 / 7", cs: "8.6", duration: "28:14", tone: "win", note: "Tempo carried through first tower." },
  { champion: "Kai'Sa", result: "LOSS", kda: "3 / 6 / 5", cs: "6.7", duration: "31:08", tone: "loss", note: "Stabilize the next wave before forcing." },
  { champion: "Caitlyn", result: "WIN", kda: "7 / 3 / 8", cs: "8.1", duration: "25:22", tone: "win", note: "Plates converted into clean resets." },
];
const buildItems = [
  { id: "1055", name: "Doran's Blade", meta: "START", tone: "violet" },
  { id: "3006", name: "Berserker's Greaves", meta: "CORE", tone: "cyan" },
  { id: "3031", name: "Infinity Edge", meta: "CORE", tone: "gold" },
  { id: "3085", name: "Runaan's Hurricane", meta: "CORE", tone: "pink" },
];
const matchupCards = [
  { champion: "Zed", role: "MID", score: "EVEN", detail: "Respect level 6. Hold escape for shadow return.", color: "cyan" },
  { champion: "Syndra", role: "MID", score: "FAVORED", detail: "Trade after Q misses. Push before reset.", color: "violet" },
  { champion: "Fizz", role: "MID", score: "CAUTION", detail: "Keep wave close. Deny the river angle.", color: "gold" },
];
const runeCards = [
  { name: "Lethal Tempo", tree: "PRECISION", icon: "◆", color: "gold" },
  { name: "Presence of Mind", tree: "PRECISION", icon: "◈", color: "violet" },
  { name: "Legend: Alacrity", tree: "PRECISION", icon: "✦", color: "cyan" },
  { name: "Cut Down", tree: "PRECISION", icon: "＋", color: "pink" },
];
const saleCards = [
  { champion: "Ahri", skin: "Spirit Blossom", price: "975 RP", discount: "-40%", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg", tone: "violet" },
  { champion: "Jinx", skin: "Cafe Cuties", price: "810 RP", discount: "-30%", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg", tone: "pink" },
  { champion: "Yasuo", skin: "Nightbringer", price: "975 RP", discount: "-35%", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg", tone: "cyan" },
  { champion: "Ekko", skin: "True Damage", price: "1,350 RP", discount: "-20%", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ekko_0.jpg", tone: "gold" },
  { champion: "Kai'Sa", skin: "Star Guardian", price: "1,350 RP", discount: "-25%", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Kaisa_0.jpg", tone: "violet" },
  { champion: "Thresh", skin: "High Noon", price: "1,350 RP", discount: "-30%", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Thresh_0.jpg", tone: "gold" },
];
const splashCards = [
  { champion: "Jinx", title: "Arcane spark", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg" },
  { champion: "Ahri", title: "Nine-tailed grace", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg" },
  { champion: "Yone", title: "The unforgotten", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yone_0.jpg" },
  { champion: "Senna", title: "The redeemer", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Senna_0.jpg" },
];
const mythicCards = [
  { skin: "Prestige K/DA Ahri", cost: "150 ME", champion: "Ahri", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Ahri_0.jpg", chromas: ["Aurora", "Rose Quartz", "Moonlit"] },
  { skin: "Prestige Nightbringer Yasuo", cost: "150 ME", champion: "Yasuo", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg", chromas: ["Obsidian", "Solar", "Amethyst"] },
  { skin: "Mythmaker Irelia", cost: "125 ME", champion: "Irelia", image: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Irelia_0.jpg", chromas: ["Jade", "Vermilion", "Pearl"] },
];
const esportsNews = [
  { tag: "LCK", title: "Regional power rankings updated", time: "12m" },
  { tag: "LEC", title: "Playoffs bracket locked", time: "38m" },
  { tag: "WORLDS", title: "Patch read: the carry meta", time: "1h" },
];
const itemUrl = (patch: string, id: string) => `${CDN}/${patch}/img/item/${id}.png`;

function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function identityList(player: Record<string, unknown>): string[] {
  const composedRiotId = [player.riotIdGameName, player.riotIdTagLine].filter(Boolean).join("#");
  return [player.riotId, composedRiotId, player.summonerName, player.riotIdGameName]
    .filter(Boolean).map(value => String(value).toLocaleLowerCase());
}

function normalizeLiveGame(data: unknown): LiveGame | null {
  if (!data || typeof data !== "object") return null;
  const payload = data as Record<string, any>;
  if (!payload.activePlayer || !Array.isArray(payload.allPlayers)) return null;
  const active = payload.activePlayer as Record<string, any>;
  const players = payload.allPlayers as Record<string, any>[];
  const activeIds = identityList(active);
  const player = players.find(candidate => identityList(candidate).some(id => activeIds.includes(id)));
  if (!player) return null;
  const playerTeam = String(player.team || "");
  const events: Record<string, any>[] = Array.isArray(payload.events?.Events) ? payload.events.Events : [];
  const eventTeam = (event: Record<string, any>): string | null => {
    const actors = [event.KillerName, ...(Array.isArray(event.Assisters) ? event.Assisters : [])].filter(Boolean).map(value => String(value).toLocaleLowerCase());
    if (actors.some(actor => activeIds.includes(actor))) return "You";
    const teams = actors.map(actor => players.find(candidate => identityList(candidate).includes(actor))?.team).filter(Boolean).map(String);
    if (teams.includes(playerTeam)) return "Your team";
    if (teams.length > 0) return "Enemy team";
    return null;
  };
  const firstKill = events.find(event => event.EventName === "ChampionKill");
  const firstTower = events.find(event => event.EventName === "FirstBrick");
  const gameTime = Number(payload.gameData?.gameTime || 0);
  const cs = Number(player.scores?.creepScore || 0);
  const riotId = String(active.riotId || player.riotId || [active.riotIdGameName, active.riotIdTagLine].filter(Boolean).join("#") || active.summonerName || player.summonerName || "Sin#O00");
  return {
    riotId, champion: String(player.championName || "League"), gameMode: String(payload.gameData?.gameMode || "Live game"), gameTime,
    level: Number(active.level || player.level || 1), currentGold: Number(active.currentGold || 0), kills: Number(player.scores?.kills || 0),
    deaths: Number(player.scores?.deaths || 0), assists: Number(player.scores?.assists || 0), cs,
    csPerMinute: gameTime > 0 ? cs / (gameTime / 60) : 0,
    towers: events.filter(event => event.EventName === "TurretKilled" && ["You", "Your team"].includes(eventTeam(event) || "")).length,
    firstBlood: firstKill ? eventTeam(firstKill) : null, firstTower: firstTower ? eventTeam(firstTower) : null,
    items: (Array.isArray(player.items) ? player.items : []).filter((item: Record<string, any>) => Number(item.itemID) > 0).map((item: Record<string, any>) => ({ id: String(item.itemID), name: String(item.displayName || "Item") })),
  };
}

async function readLiveGame(): Promise<LiveGame | null> {
  try {
    if (window.__TAURI_INTERNALS__) return normalizeLiveGame(await invoke<unknown>("get_live_game_data"));
    const response = await fetch("/liveclient/liveclientdata/allgamedata", { signal: AbortSignal.timeout(1200) });
    if (!response.ok) return null;
    return normalizeLiveGame(await response.json());
  } catch { return null; }
}

async function configureOverlay(enabled: boolean): Promise<void> {
  if (!window.__TAURI_INTERNALS__) return;
  try {
    const appWindow = getCurrentWindow();
    await appWindow.setAlwaysOnTop(enabled);
    await appWindow.setDecorations(!enabled);
    await appWindow.setResizable(!enabled);
    await appWindow.setSize(new LogicalSize(enabled ? 420 : 1180, enabled ? 240 : 780));
  } catch { /* Browser preview and older desktop builds keep the normal window. */ }
}

function App() {
  const [mode, setMode] = useState<Mode>("standalone");
  const [pregameTab, setPregameTab] = useState<PregameTab>("builds");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("ALL");
  const [catalog, setCatalog] = useState<ChampionCatalog | null>(null);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [selectedChampionId, setSelectedChampionId] = useState("Jinx");
  const [live, setLive] = useState<LiveGame | null>(null);
  const [liveChecked, setLiveChecked] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => {
    let alive = true;
    void getChampionCatalog().then(result => { if (alive) setCatalog(result); }).catch(error => { if (alive) setCatalogError(error instanceof Error ? error.message : "Patch data unavailable"); });
    return () => { alive = false; };
  }, []);
  useEffect(() => { void configureOverlay(mode === "overlay"); return () => { if (mode === "overlay") void configureOverlay(false); }; }, [mode]);
  useEffect(() => {
    let alive = true;
    const poll = async () => { const result = await readLiveGame(); if (alive) { setLive(result); setLiveChecked(true); } };
    void poll();
    const timer = window.setInterval(() => void poll(), mode === "overlay" ? 2500 : 8000);
    return () => { alive = false; window.clearInterval(timer); };
  }, [mode]);

  const patch = catalog?.patch ?? PATCH_FALLBACK;
  const fallbackChampion: Champion = { id: selectedChampionId, key: "0", name: selectedChampionId, title: "The spark in the dark", blurb: "Choose a champion to explore current static details and a clear pregame plan.", tags: [role === "ALL" ? "MID" : role], image: { full: `${selectedChampionId}.png` } };
  const selectedChampion = catalog?.champions.find(champion => champion.id === selectedChampionId) ?? catalog?.champions[0] ?? fallbackChampion;
  const filteredChampions = useMemo(() => {
    if (!catalog) return [];
    const normalized = query.trim().toLocaleLowerCase();
    return catalog.champions.filter(champion => !normalized || champion.name.toLocaleLowerCase().includes(normalized) || champion.title.toLocaleLowerCase().includes(normalized)).slice(0, normalized ? 12 : 8);
  }, [catalog, query]);

  if (mode === "overlay") return <OverlayView live={live} checked={liveChecked} patch={patch} onExit={() => setMode("standalone")} />;
  if (mode === "standalone") return <RiftDashboardShell onModeChange={setMode} />;
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand-lockup"><div className="brand-mark">◈</div><div className="brand-copy"><b>onyx</b><span>LEAGUE COMPANION</span></div></div>
      <div className="side-kicker">WORKSPACE</div>
      <nav className="mode-nav" aria-label="Workspace modes">{modes.map(item => { const Icon = item.icon; return <button key={item.id} className={`mode-button ${mode === item.id ? "active" : ""}`} onClick={() => setMode(item.id)} title={`${item.label} · ${item.hint}`}><Icon size={17}/><span>{item.label}</span><small>{item.hint}</small></button>; })}</nav>
      <div className="sidebar-spacer" />
      <div className="connection-card"><span className={`signal ${live ? "live" : ""}`} /><div><b>{live ? "League connected" : liveChecked ? "Ready when you are" : "Checking League"}</b><small>{live ? `${live.champion} · ${formatClock(live.gameTime)}` : "Local client data"}</small></div><CircleHelp size={15}/></div>
      <div className="sidebar-foot"><span><LockKeyhole size={12}/> NO ADS · NO TRACKERS</span><span>v0.1.0</span></div>
    </aside>
    <section className="content">
      <header className="topbar"><div className="breadcrumb"><span>ONYX</span><ChevronRight size={13}/><b>PREGAME</b></div><div className="topbar-actions"><div className="patch-pill"><span className="signal live"/> PATCH {patch} <i>RIOT DATA</i></div><button className="icon-button" title="Settings"><Settings2 size={16}/></button><button className="profile-orb" title="Sin · North America">S</button></div></header>
      <main className="page"><PregameView patch={patch} catalog={catalog} catalogError={catalogError} filteredChampions={filteredChampions} selectedChampion={selectedChampion} selectedChampionId={selectedChampionId} onSelectChampion={setSelectedChampionId} query={query} onQuery={setQuery} role={role} onRole={setRole} tab={pregameTab} onTab={setPregameTab} detailsOpen={detailsOpen} onToggleDetails={() => setDetailsOpen(value => !value)} /></main>
    </section>
  </div>;
}

function RiftDashboardShell({ onModeChange }: { onModeChange: (mode: Mode) => void }) {
  return <div className="rift-shell"><RiftDashboard /><nav className="rift-mode-dock" aria-label="Onyx modes">{modes.map(item => { const Icon = item.icon; return <button key={item.id} className={item.id === "standalone" ? "active" : ""} onClick={() => onModeChange(item.id)} title={`${item.label} · ${item.hint}`}><Icon size={15}/><span>{item.label}</span></button>; })}</nav></div>;
}

function StandaloneView({ patch, live, selectedChampion, onOpenOverlay }: { patch: string; live: LiveGame | null; selectedChampion: Champion; onOpenOverlay: () => void }) {
  return <div className="page-stack">
    <div className="eyebrow"><span className="eyebrow-line"/> STAY IN FLOW</div>
    <div className="hero-row"><div><h1>Play with a plan<span className="hero-dot">.</span></h1><p className="subhead">Your clean surface for the match, the moment, and the review.</p></div><button className="primary-button" onClick={onOpenOverlay}><MonitorUp size={16}/> Open overlay <ArrowUpRight size={14}/></button></div>
    <div className="glass-panel status-panel"><div className="status-icon"><Activity size={18}/></div><div className="status-copy"><b>{live ? "Live game connected" : "Ready for your next game"}</b><span>{live ? `${live.champion} · ${live.gameMode} · ${formatClock(live.gameTime)}` : `Patch ${patch} · static data synced · local client waiting`}</span></div><div className="status-trail"><span className={`signal ${live ? "live" : ""}`}/><span>{live ? "LIVE" : "READY"}</span></div></div>
    <div className="overview-grid">
      <section className="glass-panel profile-panel"><div className="panel-head"><div><span className="panel-kicker">PLAYER</span><h2>Sin <span className="muted">#O00</span></h2></div><button className="icon-button"><Settings2 size={15}/></button></div><div className="profile-row"><div className="avatar-large">S</div><div><b>Emerald I</b><span>65 LP <i>·</i> North America</span></div><div className="rank-gem"><Gem size={21}/></div></div><div className="metric-row"><Metric icon={Trophy} value="62.4%" label="WIN RATE" tone="violet"/><Metric icon={Gauge} value="8.1" label="CS / MIN" tone="cyan"/><Metric icon={Flame} value="+4" label="STREAK" tone="gold"/></div></section>
      <section className="glass-panel focus-panel"><div className="panel-head"><div><span className="panel-kicker">NEXT FOCUS</span><h2>{selectedChampion.name}</h2></div><div className="champion-mini"><img src={championIconUrl(patch, selectedChampion)} alt=""/></div></div><p className="focus-copy">Build tempo first. Keep your next reset simple. Let the clean choice win.</p><div className="focus-actions"><span><Sparkles size={14}/> EXPLAINABLE</span><span><Shield size={14}/> PATCH AWARE</span></div></section>
    </div>
    <div className="section-heading"><div><span className="panel-kicker">RECENT FORM</span><h2>Small signals. Better decisions.</h2></div><button className="text-button">VIEW ALL <ArrowUpRight size={14}/></button></div>
    <div className="history-grid">{matchHistory.map(match => <MatchCard key={match.champion} match={match} patch={patch}/>)}</div>
    <LiveHub />
    <div className="bottom-note"><span><History size={14}/> POST-GAME REVIEW</span><span><Library size={14}/> SOURCE-BACKED STATIC DATA</span><span><MousePointer2 size={14}/> YOUR CALL</span></div>
  </div>;
}

function LiveHub() {
  const [tab, setTab] = useState<"sales" | "splash" | "mythic" | "esports">("sales");
  const tabs = [
    { id: "sales" as const, label: "SALE", icon: Flame },
    { id: "splash" as const, label: "SPLASH", icon: Sparkles },
    { id: "mythic" as const, label: "MYTHIC", icon: Gem },
    { id: "esports" as const, label: "ESPORTS", icon: Trophy },
  ];
  return <section className="glass-panel live-hub">
    <div className="hub-head"><div><span className="panel-kicker">LIVE HUB</span><h2>More game. Less hunting.</h2></div><div className="hub-tabs">{tabs.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? "selected" : ""} onClick={() => setTab(item.id)} title={item.label}><Icon size={13}/><span>{item.label}</span></button>; })}</div></div>
    {tab === "sales" && <div className="sale-scroller">{saleCards.map(card => <article className={`sale-card ${card.tone}`} key={card.skin}><img src={card.image} alt="" loading="lazy"/><div className="sale-shade"/><div className="sale-copy"><div><span>{card.champion}</span><b>{card.skin}</b></div><div className="sale-meta"><strong>{card.discount}</strong><span>{card.price}</span></div></div></article>)}</div>}
    {tab === "splash" && <div className="splash-scroller">{splashCards.map(card => <article className="splash-card" key={card.champion}><img src={card.image} alt="" loading="lazy"/><div><b>{card.champion}</b><span>{card.title}</span></div></article>)}</div>}
    {tab === "mythic" && <div className="mythic-layout"><div className="mythic-scroller">{mythicCards.map(card => <article className="mythic-card" key={card.skin}><img src={card.image} alt="" loading="lazy"/><div className="mythic-copy"><span>{card.champion} · {card.cost}</span><b>{card.skin}</b><div className="chroma-row">{card.chromas.map(chroma => <i key={chroma} title={chroma}/>)}</div></div></article>)}</div><div className="chroma-note"><Gem size={15}/><span><b>CHROMAS</b><small>Hover a dot to inspect the Mythic variants.</small></span></div></div>}
    {tab === "esports" && <div className="esports-layout"><div className="news-list">{esportsNews.map(item => <div className="news-row" key={item.title}><span>{item.tag}</span><b>{item.title}</b><small>{item.time}</small><ChevronRight size={14}/></div>)}</div><div className="esports-side"><Trophy size={18}/><span><b>PEAK RANK</b><small>Watch the climb beside the feed.</small></span><ArrowUpRight size={14}/></div></div>}
  </section>;
}

function PregameView({ patch, catalog, catalogError, filteredChampions, selectedChampion, selectedChampionId, onSelectChampion, query, onQuery, role, onRole, tab, onTab, detailsOpen, onToggleDetails }: {
  patch: string; catalog: ChampionCatalog | null; catalogError: string | null; filteredChampions: Champion[]; selectedChampion: Champion; selectedChampionId: string; onSelectChampion: (id: string) => void; query: string; onQuery: (value: string) => void; role: string; onRole: (value: string) => void; tab: PregameTab; onTab: (value: PregameTab) => void; detailsOpen: boolean; onToggleDetails: () => void;
}) {
  return <div className="page-stack">
    <div className="eyebrow"><span className="eyebrow-line"/> PREPARE WITH CLARITY</div><div className="hero-row"><div><h1>Choose your edge<span className="hero-dot">.</span></h1><p className="subhead">A quieter surface for sharper choices.</p></div><div className="hero-icon"><Crosshair size={21}/></div></div>
    <div className="pregame-tabs">{pregameTabs.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? "selected" : ""} onClick={() => onTab(item.id)}><Icon size={15}/>{item.label}</button>; })}</div>
    {tab === "builds" && <div className="recommendation-layout">
      <section className="glass-panel champion-panel"><div className="panel-head"><div><span className="panel-kicker">PATCH {patch} · OFFICIAL STATIC DATA</span><h2>Champion library</h2></div><Zap size={16} className="icon-tint"/></div><div className="search-field"><Search size={16}/><input value={query} onChange={event => onQuery(event.target.value)} placeholder="Search champions"/><span>{filteredChampions.length || "—"}</span></div><div className="role-row">{roles.map(item => { const Icon = item.icon; return <button key={item.label} className={role === item.label ? "active" : ""} onClick={() => onRole(item.label)} title={item.label}><Icon size={13}/><span>{item.label === "JUNGLE" ? "JG" : item.label === "SUPPORT" ? "SUP" : item.label}</span></button>; })}</div><div className="pick-list">{!catalog && !catalogError && <div className="empty-state"><RefreshCw size={15}/> Syncing patch data…</div>}{catalogError && <div className="empty-state error"><CircleHelp size={15}/> {catalogError}</div>}{filteredChampions.map(champion => <button key={champion.id} className={`champion-pick ${selectedChampionId === champion.id ? "selected" : ""}`} onClick={() => onSelectChampion(champion.id)}><img src={championIconUrl(patch, champion)} alt="" loading="lazy"/><span><b>{champion.name}</b><small>{champion.tags.slice(0, 2).join(" · ")} <i>·</i> {champion.title}</small></span><ChevronRight size={15}/></button>)}</div><div className="panel-foot">No fabricated rates. No noise.</div></section>
      <section className="glass-panel detail-panel"><div className="detail-hero"><div><span className="panel-kicker">SELECTED CHAMPION</span><h2>{selectedChampion.name}</h2><span className="detail-title">{selectedChampion.title}</span></div><img src={championIconUrl(patch, selectedChampion)} alt=""/></div><p className="detail-blurb">{selectedChampion.blurb}</p><div className="detail-line"><span><Shield size={14}/> PATCH {patch}</span><span><Sparkles size={14}/> {selectedChampion.tags[0] ?? "FLEXIBLE"}</span><span><Check size={14}/> STATIC</span></div><div className="section-heading compact"><div><span className="panel-kicker">RECOMMENDED PATH</span><h3>Build with intent</h3></div><button className="text-button" onClick={onToggleDetails}>{detailsOpen ? "LESS" : "MORE"} <ChevronRight size={14}/></button></div>{detailsOpen && <div className="build-strip">{buildItems.map(item => <ItemChip key={item.id} item={item} patch={patch}/>)}</div>}<div className="why-box"><div className="why-icon"><Bot size={17}/></div><div><b>Why this path</b><span>Simple first reset. Stable damage curve. One clear reason per choice.</span></div></div></section>
    </div>}
    {tab === "matchups" && <section className="glass-panel wide-panel"><div className="panel-head"><div><span className="panel-kicker">LANE READ</span><h2>{selectedChampion.name} matchup map</h2></div><BarChart3 size={17} className="icon-tint"/></div><div className="matchup-grid">{matchupCards.map(card => <div key={card.champion} className={`matchup-card ${card.color}`}><div className="matchup-top"><div className="champion-token placeholder">{card.champion.slice(0, 1)}</div><span>{card.role}</span><b>{card.score}</b></div><h3>{card.champion}</h3><p>{card.detail}</p><div className="meter"><span style={{ width: card.score === "FAVORED" ? "76%" : card.score === "EVEN" ? "52%" : "36%" }}/></div></div>)}</div><div className="data-note"><Shield size={14}/> Matchup rates stay hidden until a verified current-patch source is connected.</div></section>}
    {tab === "runes" && <section className="glass-panel wide-panel"><div className="panel-head"><div><span className="panel-kicker">RUNE STUDIO</span><h2>One clean page</h2></div><WandSparkles size={17} className="icon-tint"/></div><div className="rune-layout"><div className="rune-tree"><div className="tree-orb">◆</div><span>PRECISION</span><b>Lethal Tempo</b><small>Scale through sustained fights.</small></div><div className="rune-list">{runeCards.map(rune => <div className={`rune-row ${rune.color}`} key={rune.name}><span className="rune-symbol">{rune.icon}</span><span><b>{rune.name}</b><small>{rune.tree}</small></span><Check size={14}/></div>)}</div></div><div className="data-note"><Sparkles size={14}/> Alternatives stay visible. The final call stays yours.</div></section>}
  </div>;
}

function OverlayView({ live, checked, patch, onExit }: { live: LiveGame | null; checked: boolean; patch: string; onExit: () => void }) {
  const itemList = live?.items.slice(0, 6) ?? [];
  return <div className="overlay-shell"><div className="overlay-top"><div className="overlay-brand"><span className="brand-mark small">◈</span><b>ONYX</b><span className="overlay-live"><span className={`signal ${live ? "live" : ""}`}/>{live ? "LIVE" : "READY"}</span></div><div className="overlay-actions"><button title="Pin overlay"><LockKeyhole size={13}/></button><button title="Return to Onyx" onClick={onExit}><X size={15}/></button></div></div>{live ? <><div className="overlay-main"><div className="overlay-champion"><div className="overlay-avatar">{live.champion.slice(0, 1)}</div><div><b>{live.champion}</b><span>{live.gameMode}</span></div></div><div className="overlay-clock"><Timer size={13}/><b>{formatClock(live.gameTime)}</b><span>LV {live.level}</span></div></div><div className="overlay-stats"><div><b>{live.kills}</b><span>K</span></div><i>/</i><div><b>{live.deaths}</b><span>D</span></div><i>/</i><div><b>{live.assists}</b><span>A</span></div><div className="overlay-stat-divider"/><div><b>{live.cs}</b><span>CS</span></div><div><b>{Math.round(live.csPerMinute * 10) / 10}</b><span>CS/M</span></div><div><b>{live.currentGold.toLocaleString()}</b><span>GOLD</span></div></div><div className="overlay-bottom"><div className="overlay-items">{itemList.length ? itemList.map(item => <img key={item.id} src={itemUrl(patch, item.id)} alt={item.name} title={item.name}/>) : <span className="muted-inline">NO ITEMS</span>}</div><div className="overlay-tip"><Sparkles size={13}/><span>{live.firstTower ? "First tower secured. Reset clean." : live.firstBlood ? `${live.firstBlood} first blood.` : "Hold the next safe wave."}</span></div></div></> : <div className="overlay-empty"><Activity size={22}/><b>{checked ? "Waiting for League" : "Connecting"}</b><span>Start a match to wake the overlay.</span></div>}<div className="overlay-footer"><span>PATCH {patch}</span><span><MousePointer2 size={12}/> ALWAYS ON TOP</span></div></div>;
}

function Metric({ icon: Icon, value, label, tone }: { icon: IconType; value: string; label: string; tone: string }) { return <div className={`metric ${tone}`}><Icon size={14}/><b>{value}</b><span>{label}</span></div>; }
function MatchCard({ match, patch }: { match: typeof matchHistory[number]; patch: string }) { return <button className="match-card"><div className="match-top"><div className={`result-dot ${match.tone}`}><Check size={12}/></div><div><b>{match.champion}</b><span>{match.duration} <i>·</i> {match.result}</span></div><ArrowUpRight size={14}/></div><div className="match-stats"><span>{match.kda}</span><span>{match.cs} CS/M</span><span>PATCH {patch}</span></div><p>{match.note}</p></button>; }
function ItemChip({ item, patch }: { item: typeof buildItems[number]; patch: string }) { return <div className={`item-chip ${item.tone}`}><img src={itemUrl(patch, item.id)} alt=""/><span><b>{item.name}</b><small>{item.meta}</small></span></div>; }

export default App;
