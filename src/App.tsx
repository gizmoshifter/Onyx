import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, ChevronDown, CircleHelp, Crosshair, Layers3, Search, Shield, Sparkles, Swords, Zap, RefreshCw } from "lucide-react";
import { championIconUrl, getChampionCatalog, type ChampionCatalog } from "./lib/riotData";

type Tab = "Overview" | "Pregame Prep" | "Build Lab";
const tabs: Tab[] = ["Overview", "Pregame Prep", "Build Lab"];

function App() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("Jinx");
  const [showDetails, setShowDetails] = useState(true);
  const [catalog, setCatalog] = useState<ChampionCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCatalog() {
    setLoading(true);
    setError(null);
    try {
      const result = await getChampionCatalog();
      setCatalog(result);
      if (!result.champions.some(champion => champion.id === selected)) {
        setSelected(result.champions[0]?.id ?? "");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Champion data could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCatalog();
  }, []);

  const filtered = useMemo(() => {
    if (!catalog) return [];
    const normalized = query.trim().toLocaleLowerCase();
    return catalog.champions
      .filter(champion => !normalized || champion.name.toLocaleLowerCase().includes(normalized) || champion.title.toLocaleLowerCase().includes(normalized))
      .slice(0, normalized ? 12 : 8);
  }, [catalog, query]);

  const selectedChampion = catalog?.champions.find(champion => champion.id === selected) ?? catalog?.champions[0];

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">O</div><div><strong>onyx</strong><span>LEAGUE COMPANION</span></div></div>
      <div className="side-label">WORKSPACE</div>
      <nav>{tabs.map((item, i) => <button key={item} className={tab === item ? "nav-item active" : "nav-item"} onClick={() => setTab(item)}>
        {i === 0 ? <Layers3 size={17}/> : i === 1 ? <Crosshair size={17}/> : <Swords size={17}/>}<span>{item}</span>
      </button>)}</nav>
      <div className="sidebar-bottom"><div className="connection"><span className="status-dot"/><div><b>Patch data</b><small>{loading ? "Connecting to Riot…" : error ? "Unavailable" : "Riot Data Dragon"}</small></div><CircleHelp size={15}/></div><div className="version">ONYX PREVIEW <span>v0.1.0</span></div></div>
    </aside>

    <section className="content">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> {tab}</div><div className="top-actions"><div className="patch"><span className="status-dot"/> {catalog ? `PATCH ${catalog.patch}` : loading ? "LOADING PATCH" : "PATCH OFFLINE"} <b>RIOT DATA</b></div><div className="avatar">O</div></div></header>
      <div className="page">
        <div className="eyebrow"><span className="eyebrow-line"/> PREPARE WITH CLARITY</div>
        <div className="hero-row"><div><h1>{tab === "Overview" ? "Play with a plan." : tab === "Pregame Prep" ? "Prepare your pick." : "Compare builds."}</h1><p className="subhead">{tab === "Overview" ? "Clear options and useful explanations in one focused companion." : tab === "Pregame Prep" ? "Explore champion information before a match. You make the choice." : "Item comparisons are the next data layer to connect."}</p></div><div className="hero-icon"><Sparkles size={21}/></div></div>

        <div className="status-banner"><div className="status-icon"><Activity size={18}/></div><div><b>{error ? "Riot data unavailable" : catalog ? "Official static champion data connected" : "Connecting to Riot Data Dragon"}</b><span>{error ?? (catalog ? `Champion catalog loaded for patch ${catalog.patch}. Win rates and matchup statistics are not provided by Data Dragon.` : "Loading the current published patch and champion catalog.")}</span></div><span className="coming">{catalog ? "PATCH SYNCED" : error ? "OFFLINE" : "CONNECTING"}</span></div>

        <div className="section-heading"><div><span className="eyebrow">RIOT DATA DRAGON</span><h2>{tab === "Build Lab" ? "Champion catalog · item data next" : "Champion explorer"}</h2></div><button className="text-button" onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Hide details" : "Show details"} <ChevronDown size={15}/></button></div>
        <div className="recommendation-layout">
          <div className="panel champion-panel">
            <div className="panel-head"><div><span className="panel-kicker">{catalog ? `PATCH ${catalog.patch} · OFFICIAL STATIC DATA` : "PATCH DATA"}</span><h3>Browse champions</h3></div><span className="subtle-icon"><Zap size={16}/></span></div>
            <div className="search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search all champions"/></div>
            <div className="pick-list">
              {loading && <div className="empty">Loading champion catalog…</div>}
              {error && <div className="empty error-state">{error}<button className="retry-button" onClick={() => void loadCatalog()}><RefreshCw size={13}/> Retry</button></div>}
              {!loading && !error && filtered.map((champion) => <button key={champion.id} onClick={() => setSelected(champion.id)} className={selected === champion.id ? "pick selected" : "pick"}>
                <img className="champion-token champion-art" src={championIconUrl(catalog!.patch, champion)} alt="" loading="lazy"/>
                <div className="pick-info"><b>{champion.name}</b><span>{champion.tags.join(" · ")} <i>·</i> {champion.title}</span></div><ArrowUpRight size={15} className="pick-arrow"/>
              </button>)}
              {!loading && !error && filtered.length === 0 && <div className="empty">No champion matches that search.</div>}
            </div>
            <div className="panel-foot">Official champion names, titles, tags, and portraits. No fabricated win rates.</div>
          </div>

          <div className="panel why-panel">
            <div className="panel-head"><div><span className="panel-kicker">CHAMPION DETAILS</span><h3>{selectedChampion?.name ?? "Select a champion"} <span className="role-tag">{selectedChampion?.tags[0] ?? "RIOT DATA"}</span></h3></div><div className="score"><Shield size={17}/></div></div>
            <div className="why-content">
              {selectedChampion ? <><div className="why-title"><Sparkles size={15}/> {selectedChampion.title.toLocaleUpperCase()}</div><p>{selectedChampion.blurb}</p></> : <p>Select a champion to inspect its official static details.</p>}
              {showDetails && <div className="reason-list"><div><span className="reason-check">+</span><div><b>Patch-aware catalog</b><small>{catalog ? `Loaded from Riot Data Dragon patch ${catalog.patch}.` : "Waiting for the published patch catalog."}</small></div></div><div><span className="reason-check">+</span><div><b>Statistics kept honest</b><small>Data Dragon does not publish win rates, matchup rates, or pick rates. Those require a separate verified data source.</small></div></div><div><span className="reason-check">+</span><div><b>Pregame-first design</b><small>Onyx will show multiple explainable options and leave the final decision to you.</small></div></div></div>}
            </div>
            <div className="why-foot"><Shield size={14}/> Static game data only · no live game-state access.</div>
          </div>
        </div>
        <div className="bottom-note"><span><Sparkles size={14}/> NO LIVE GAME FEED · NO IN-MATCH INSTRUCTIONS</span><span>RIOT STATIC DATA <i/> NO ADS <i/> NO TRACKERS</span></div>
        <footer className="legal-note">Onyx is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</footer>
      </div>
    </section>
  </main>;
}

export default App;
