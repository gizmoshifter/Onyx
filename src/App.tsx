import { useState } from "react";
import { Activity, ArrowUpRight, ChevronDown, CircleHelp, Crosshair, Layers3, Search, Shield, Sparkles, Swords, Zap } from "lucide-react";

type Tab = "Overview" | "Pregame Prep" | "Build Lab";
const tabs: Tab[] = ["Overview", "Pregame Prep", "Build Lab"];

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
        {i === 0 ? <Layers3 size={17}/> : i === 1 ? <Crosshair size={17}/> : <Swords size={17}/>}<span>{item}</span>
      </button>)}</nav>
      <div className="sidebar-bottom"><div className="connection"><span className="status-dot"/><div><b>Data mode</b><small>Static examples only</small></div><CircleHelp size={15}/></div><div className="version">ONYX PREVIEW <span>v0.1.0</span></div></div>
    </aside>

    <section className="content">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> {tab}</div><div className="top-actions"><div className="patch"><span className="status-dot"/> PROTOTYPE <b>Demo values</b></div><div className="avatar">O</div></div></header>
      <div className="page">
        <div className="eyebrow"><span className="eyebrow-line"/> PREPARE WITH CLARITY</div>
        <div className="hero-row"><div><h1>{tab === "Overview" ? "Play with a plan." : tab === "Pregame Prep" ? "Prepare your pick." : "Compare builds."}</h1><p className="subhead">{tab === "Overview" ? "Clear options and useful explanations in one focused companion." : tab === "Pregame Prep" ? "Compare several options using pregame context. You make the choice." : "Explore item options before a match and see why each one is suggested."}</p></div><div className="hero-icon"><Sparkles size={21}/></div></div>

        <div className="status-banner"><div className="status-icon"><Activity size={18}/></div><div><b>Static data only</b><span>This prototype uses illustrative examples. It has no live game feed and gives no in-match instructions.</span></div><span className="coming">LIVE FEED OFF</span></div>

        <div className="section-heading"><div><span className="eyebrow">RECOMMENDATION EXAMPLES</span><h2>{tab === "Build Lab" ? "Build comparisons" : "Champion options"}</h2></div><button className="text-button" onClick={() => setShowDetails(!showDetails)}>{showDetails ? "Hide reasoning" : "Show reasoning"} <ChevronDown size={15}/></button></div>
        <div className="recommendation-layout">
          <div className="panel champion-panel">
            <div className="panel-head"><div><span className="panel-kicker">ADC · ILLUSTRATIVE DATA</span><h3>Options to compare</h3></div><span className="subtle-icon"><Zap size={16}/></span></div>
            <div className="search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search champions"/></div>
            <div className="pick-list">{filtered.map((item) => <button key={item.name} onClick={() => setSelected(item.name)} className={selected === item.name ? "pick selected" : "pick"}>
              <div className={"champion-token "+item.tone}>{item.name.slice(0,1)}</div><div className="pick-info"><b>{item.name}</b><span>{item.role} <i>·</i> {item.note}</span></div><div className="winrate"><b>{item.win}</b><span>EXAMPLE</span></div><ArrowUpRight size={15} className="pick-arrow"/>
            </button>)}
            {filtered.length === 0 && <div className="empty">No champion matches that search.</div>}</div>
            <div className="panel-foot">Illustrative prototype values only — no live patch statistics or match data are connected.</div>
          </div>

          <div className="panel why-panel">
            <div className="panel-head"><div><span className="panel-kicker">EXPLANATION PREVIEW</span><h3>{selected} <span className="role-tag">ADC</span></h3></div><div className="score"><Shield size={17}/></div></div>
            <div className="why-content"><div className="why-title"><Sparkles size={15}/> WHY SHOW REASONS</div><p>This prototype demonstrates how Onyx can explain options instead of telling you what to do. Its current content is sample text.</p>
              {showDetails && <div className="reason-list"><div><span className="reason-check">+</span><div><b>Multiple options</b><small>Compare alternatives while keeping the choice with you.</small></div></div><div><span className="reason-check">+</span><div><b>Patch and source</b><small>A future data view will identify its patch, source, and sample size.</small></div></div><div><span className="reason-check">+</span><div><b>Static pregame context</b><small>No opponent scouting or changing live game-state recommendations.</small></div></div></div>}
            </div>
            <div className="why-foot"><Shield size={14}/> No live League Client connection or in-match guidance.</div>
          </div>
        </div>
        <div className="bottom-note"><span><Sparkles size={14}/> NO LIVE GAME FEED · NO IN-MATCH INSTRUCTIONS</span><span>DEMO DATA <i/> NO ADS <i/> NO ACCOUNT REQUIRED</span></div>
        <footer className="legal-note">Onyx is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.</footer>
      </div>
    </section>
  </main>;
}

export default App;
