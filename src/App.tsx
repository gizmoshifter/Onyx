import { useState } from "react";
import { Search } from "lucide-react";

type Tab = "Overview" | "Champions" | "Builds";
type Item = { id: string; name: string };
type Champion = {
  id: string;
  name: string;
  role: string;
  items: Item[];
};

const dataDragonVersion = "16.22.1";
const championImage = (id: string) =>
  "https://ddragon.leagueoflegends.com/cdn/" + dataDragonVersion + "/img/champion/" + id + ".png";
const championSplash = (id: string) =>
  "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + id + "_0.jpg";
const itemImage = (id: string) =>
  "https://ddragon.leagueoflegends.com/cdn/" + dataDragonVersion + "/img/item/" + id + ".png";

const champions: Champion[] = [
  {
    id: "Jinx",
    name: "Jinx",
    role: "ADC",
    items: [
      { id: "3031", name: "Infinity Edge" },
      { id: "3085", name: "Runaan's Hurricane" },
      { id: "3006", name: "Berserker's Greaves" }
    ]
  },
  {
    id: "Kaisa",
    name: "Kai'Sa",
    role: "ADC",
    items: [
      { id: "3124", name: "Guinsoo's Rageblade" },
      { id: "3115", name: "Nashor's Tooth" },
      { id: "3006", name: "Berserker's Greaves" }
    ]
  },
  {
    id: "Caitlyn",
    name: "Caitlyn",
    role: "ADC",
    items: [
      { id: "3031", name: "Infinity Edge" },
      { id: "3094", name: "Rapid Firecannon" },
      { id: "3006", name: "Berserker's Greaves" }
    ]
  }
];

const tabs: Tab[] = ["Overview", "Champions", "Builds"];

function App() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("Jinx");
  const selected = champions.find(champion => champion.id === selectedId) ?? champions[0];
  const filtered = champions.filter(champion =>
    champion.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">O</div>
          <strong>ONYX</strong>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {tabs.map(item => (
            <button
              key={item}
              className={tab === item ? "nav-item active" : "nav-item"}
              onClick={() => setTab(item)}
              aria-current={tab === item ? "page" : undefined}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <span className="demo-dot" />
          <span>Preview</span>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <span className="topbar-label">{tab}</span>
          <span className="preview-pill"><i /> DEMO DATA</span>
        </header>

        <div className="page">
          <div className="page-heading">
            <div>
              <span className="eyebrow">LEAGUE OF LEGENDS</span>
              <h1>{tab === "Builds" ? "Builds" : "Champions"}</h1>
            </div>
            {tab !== "Builds" && (
              <label className="search">
                <Search size={17} aria-hidden="true" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Find a champion"
                  aria-label="Find a champion"
                />
              </label>
            )}
          </div>

          {tab !== "Builds" && (
            <section className="champion-grid" aria-label="Champion selection">
              {filtered.map(champion => (
                <button
                  key={champion.id}
                  className={selected.id === champion.id ? "champion-card selected" : "champion-card"}
                  onClick={() => setSelectedId(champion.id)}
                  aria-pressed={selected.id === champion.id}
                >
                  <img
                    className="champion-art"
                    src={championSplash(champion.id)}
                    alt={champion.name}
                    loading="lazy"
                  />
                  <span className="art-shade" />
                  <span className="champion-caption">
                    <span>{champion.role}</span>
                    <strong>{champion.name}</strong>
                  </span>
                  <img
                    className="champion-portrait"
                    src={championImage(champion.id)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                  />
                </button>
              ))}
              {filtered.length === 0 && <p className="empty">No champions found.</p>}
            </section>
          )}

          {tab !== "Champions" && (
            <section className="build-panel" aria-label={selected.name + " example build"}>
              <div className="build-heading">
                <div className="selected-champion">
                  <img src={championImage(selected.id)} alt="" />
                  <div>
                    <span className="eyebrow">EXAMPLE BUILD · {selected.role}</span>
                    <h2>{selected.name}</h2>
                  </div>
                </div>
                <span className="sample-label">SAMPLE ITEMS</span>
              </div>

              <div className="item-grid">
                {selected.items.map(item => (
                  <div className="item-card" key={item.id}>
                    <img src={itemImage(item.id)} alt={item.name} loading="lazy" />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <footer className="page-foot">
            Artwork and item icons from Riot Data Dragon <span>·</span> Example data only
          </footer>
        </div>
      </section>
    </main>
  );
}

export default App;
