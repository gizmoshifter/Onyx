import { useState } from "react";
import { Activity, ArrowUpRight, ChevronDown, CircleHelp, Crosshair, Layers3, Search, Shield, Sparkles, Swords, Zap } from "lucide-react";

type Tab = "Overview" | "Champion Select" | "Build Lab";
const tabs: Tab[] = ["Overview", "Champion Select", "Build Lab"];

const suggestions = [
  { name: "Jinx", role: "ADC", win: "52.4%", note: "Strong scaling · reliable teamfight range", tone: "blue" },
  { name: "Kai'Sa", role: "ADC", win: "51.8%", note: "Flexible damage profile · strong follow-up", tone: "violet" },
  { name: "Caitlyn", role: "ADC", win: "50.9%", note: "Lane pressure · punishes short range", tone: "slate" }
];

function App() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("Jinx");
  const [showDetails, setShowDetails] = useState(true);
  const filtered = suggestions.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));

  return <main className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">O</div><div><strong>onyx</strong><span>LEAGUE COMPANION</span></div></div>
      <div className="side-label">WORKSPACE</div>
      <nav>{tabs.map((item, i) => <button key={item} className={tab === item ? "nav-item active" : "nav-item"} onClick={() => setTab(item)}>
        {i === 0 ? <Layers3 size={17}/> : i === 1 ? <Crosshair size={17}/> : <Swords size={17}/>}<span>{item}</span>{item === "Champion Select" && <i className="live-dot"/>}
      </button>)}</nav>
      <div className="sidebar-bottom"><div className="connection"><span className="status-dot"/><div><b>Local client</b><small>Not connected</small></div><CircleHelp size={15}/></div><div className="version">ONYX PREVIEW <span>v0.1.0</span></div></div>
    </aside>

    <section className="content">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> {tab}</div><div className="top-actions"><div className="patch"><span className="status-dot"/> PATCH DATA <b>Awaiting sync</b></div><div className="avatar">G</div></div></header>
      <div className="page">
        <div className="eyebrow"><span className="eyebrow-line"/> YOUR COMPETITIVE EDGE</div>
        <div className="hero-row"><div><h1>{tab === "Overview" ? "Play with a plan." : tab === "Champion Select" ? "Own champion select." : "Build with purpose."}</h1><p className="subhead">{tab === "Overview" ? "Clear decisions. Better preparation. One focused companion." : tab === "Champion Select" ? "Find the strongest pick for your role, matchup, and team." : "Understand every item choice against the game in front of you."}</p></div><div className="hero-icon"><Sparkles size={21}/></div></div>

        <div className="status-banner"><div className="status-icon"><Activity size={18}/></div><div><b>Foundation is ready to take shape</b><span>Connect the League Client to unlock live game context and personalized recommendations.</span></div><span className="coming">SETUP IN PROGRESS</span></div>

        <div className="section-heading"><div><span className="eyebrow">RECOMMENDATION ENGINE</span><h2>{tab === "Build Lab" ? "Build intelligence" : "Champion insights"}</h2></div><button className="text-button" onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Hide reasoning" : "Show reasoning"} <ChevronDown size={15}/></button></div>
        <div className="recommendation-layout">
          <div className="panel champion-panel">
            <div className="panel-head"><div><span className="panel-kicker">ADC · CURRENT PATCH DATA PENDING</span><h3>Recommended picks</h3></div><span className="subtle-icon"><Zap size={16}/></span></div>
            <div className="search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search champions"/></div>
            <div className="pick-list">{filtered.map((item, index) => <button key={item.name} onClick={() => setSelected(item.name)} className={selected === item.name ? "pick selected" : "pick"}>
              <div className={"champion-token "+item.tone}>{item.name.slice(0,1)}</div><div className="pick-info"><b>{item.name}</b><span>{item.role} <i>·</i> {item.note}</span></div><div className="winrate"><b>{item.win}</b><span>WIN RATE*</span></div><ArrowUpRight size={15} className="pick-arrow"/>
            </button>)}
            {filtered.length === 0 && <div className="empty">No champion matches that search.</div>}</div>
            <div className="panel-foot">*Illustrative interface data — live patch statistics are not connected yet.</div>
          </div>

          <div className="panel why-panel">
            <div className="panel-head"><div><span className="panel-kicker">PICK ANALYSIS</span><h3>{selected} <span className="role-tag">ADC</span></h3></div><div className="score">A<span>−</span></div></div>
            <div className="why-content"><div className="why-title"><Sparkles size={15}/> WHY THIS PICK</div><p>{selected} offers a strong balance of lane pressure, teamfight value, and reliable damage output.</p>
              {showDetails && <div className="reason-list"><div><span className="reason-check">+</span><div><b>Team composition</b><small>Evaluates engage, frontline, and damage balance.</small></div></div><div><span className="reason-check">+</span><div><b>Lane matchup</b><small>Compares current-patch results against the opposing ADC.</small></div></div><div><span className="reason-check">+</span><div><b>Reliability</b><small>Weights sample size and rank range before recommending.</small></div></div></div>}
            </div>
            <div className="why-foot"><Shield size={14}/> Recommendations will show sources, patch, and sample size.</div>
          </div>
        </div>
        <div className="bottom-note"><span><Sparkles size={14}/> Built to explain the decision, not just display a build.</span><span>NO ADS <i/> NO ACCOUNT REQUIRED <i/> LIGHTWEIGHT BY DESIGN</span></div>
      </div>
    </section>
  </main>;
}

export default App;