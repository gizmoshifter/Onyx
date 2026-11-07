import { Search } from "lucide-react";

const dataDragonVersion = "16.22.1";
const championImage = (id: string) =>
  "https://ddragon.leagueoflegends.com/cdn/" + dataDragonVersion + "/img/champion/" + id + ".png";
const itemImage = (id: string) =>
  "https://ddragon.leagueoflegends.com/cdn/" + dataDragonVersion + "/img/item/" + id + ".png";

type Match = {
  championId: string;
  champion: string;
  mode: string;
  result: "Victory" | "Defeat";
  duration: string;
  kda: string;
  kdaRatio: string;
  goldAt15: string;
  cs: number;
  csPerMinute: string;
  towers: number;
  firstBlood: boolean;
  firstTower: boolean;
  items: { id: string; name: string }[];
  tip: string;
};

const matches: Match[] = [
  {
    championId: "Jinx",
    champion: "Jinx",
    mode: "Ranked Solo / Duo",
    result: "Victory",
    duration: "28:14",
    kda: "9 / 2 / 7",
    kdaRatio: "8.0 KDA",
    goldAt15: "+1.3k",
    cs: 242,
    csPerMinute: "8.6",
    towers: 3,
    firstBlood: true,
    firstTower: true,
    items: [
      { id: "3031", name: "Infinity Edge" },
      { id: "3085", name: "Runaan's Hurricane" },
      { id: "3006", name: "Berserker's Greaves" }
    ],
    tip: "First blood to first tower. Strong snowball; reset before your next push."
  },
  {
    championId: "Kaisa",
    champion: "Kai'Sa",
    mode: "Ranked Solo / Duo",
    result: "Defeat",
    duration: "31:08",
    kda: "3 / 6 / 5",
    kdaRatio: "1.3 KDA",
    goldAt15: "-0.9k",
    cs: 208,
    csPerMinute: "6.7",
    towers: 1,
    firstBlood: false,
    firstTower: false,
    items: [
      { id: "3124", name: "Guinsoo's Rageblade" },
      { id: "3115", name: "Nashor's Tooth" },
      { id: "3006", name: "Berserker's Greaves" }
    ],
    tip: "Down 900 gold at 15. Catch the next safe wave before forcing another fight."
  },
  {
    championId: "Caitlyn",
    champion: "Caitlyn",
    mode: "Ranked Solo / Duo",
    result: "Victory",
    duration: "25:22",
    kda: "7 / 3 / 8",
    kdaRatio: "5.0 KDA",
    goldAt15: "+0.9k",
    cs: 205,
    csPerMinute: "8.1",
    towers: 2,
    firstBlood: true,
    firstTower: false,
    items: [
      { id: "3031", name: "Infinity Edge" },
      { id: "3094", name: "Rapid Firecannon" },
      { id: "3006", name: "Berserker's Greaves" }
    ],
    tip: "You found first blood. Carry that tempo into plates for the first tower."
  }
];

function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">O</div>
          <strong>ONYX</strong>
        </div>

        <div className="sidebar-profile">
          <span className="eyebrow">PLAYER</span>
          <strong>Sin <small>#O00</small></strong>
          <span className="sidebar-region">North America</span>
        </div>

        <div className="sidebar-bottom">
          <span className="demo-dot" />
          <span>Preview mode</span>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <span className="topbar-label">PLAYER OVERVIEW</span>
          <span className="preview-pill"><i /> SAMPLE DATA</span>
        </header>

        <div className="page">
          <section className="profile-heading">
            <div>
              <span className="eyebrow">NORTH AMERICA · LEAGUE OF LEGENDS</span>
              <h1>Sin <small>#O00</small></h1>
            </div>
            <p className="profile-note">Example matches · Riot data not connected</p>
          </section>

          <section className="summary-grid" aria-label="Recent performance sample">
            <div className="summary-card">
              <span>LAST 3 GAMES</span>
              <strong>2W <i>–</i> 1L</strong>
            </div>
            <div className="summary-card">
              <span>AVG KDA</span>
              <strong>4.8</strong>
            </div>
            <div className="summary-card">
              <span>CS / MIN</span>
              <strong>7.8</strong>
            </div>
            <div className="summary-card">
              <span>GOLD @ 15</span>
              <strong className="positive">+0.4k</strong>
            </div>
          </section>

          <section className="recent-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">MATCH HISTORY</span>
                <h2>Recent matches</h2>
              </div>
              <span className="sample-count">3 SAMPLE GAMES</span>
            </div>

            <div className="match-list">
              {matches.map((match, index) => (
                <article
                  className={match.result === "Victory" ? "match-card victory" : "match-card defeat"}
                  key={match.championId}
                >
                  <div className="match-identity">
                    <img
                      className="match-champion"
                      src={championImage(match.championId)}
                      alt={match.champion}
                      loading="lazy"
                    />
                    <span className="match-result">{match.result}</span>
                    <strong>{match.champion}</strong>
                    <small>{match.mode} · {match.duration}</small>
                    <span className="game-number">SAMPLE GAME {index + 1}</span>
                  </div>

                  <div className="match-performance">
                    <div className="kda-line">
                      <strong>{match.kda}</strong>
                      <span>{match.kdaRatio}</span>
                    </div>

                    <div className="match-stats">
                      <div>
                        <span>GOLD @ 15</span>
                        <strong className={match.goldAt15.startsWith("+") ? "positive" : "negative"}>
                          {match.goldAt15}
                        </strong>
                      </div>
                      <div>
                        <span>CS</span>
                        <strong>{match.cs} <small>· {match.csPerMinute}/m</small></strong>
                      </div>
                      <div>
                        <span>TOWERS</span>
                        <strong>{match.towers}</strong>
                      </div>
                    </div>

                    <div className="objective-row">
                      <span className={match.firstBlood ? "objective secured" : "objective"}>
                        <i /> First blood
                      </span>
                      <span className={match.firstTower ? "objective secured" : "objective"}>
                        <i /> First tower
                      </span>
                    </div>
                  </div>

                  <div className="match-notes">
                    <div className="match-items" aria-label="Items">
                      {match.items.map(item => (
                        <img key={item.id} src={itemImage(item.id)} alt={item.name} title={item.name} loading="lazy" />
                      ))}
                    </div>
                    <div className="quick-tip">
                      <span>QUICK TIP</span>
                      <p>{match.tip}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <footer className="page-foot">
            Sample match data only. Connect an approved Riot data source to load your real history.
          </footer>
        </div>
      </section>
    </main>
  );
}

export default App;
