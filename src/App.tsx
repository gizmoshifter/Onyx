import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

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

function identityList(player: Record<string, any>): string[] {
  const composedRiotId = [player.riotIdGameName, player.riotIdTagLine].filter(Boolean).join("#");
  return [player.riotId, composedRiotId, player.summonerName, player.riotIdGameName]
    .filter(Boolean)
    .map(value => String(value).toLocaleLowerCase());
}

function normalizeLiveGame(data: any): LiveGame | null {
  if (!data || !data.activePlayer || !Array.isArray(data.allPlayers)) return null;

  const active = data.activePlayer as Record<string, any>;
  const players = data.allPlayers as Record<string, any>[];
  const activeIds = identityList(active);
  const player = players.find(candidate =>
    identityList(candidate).some(candidateId => activeIds.includes(candidateId))
  );
  if (!player) return null;

  const playerTeam = String(player.team || "");
  const events: Record<string, any>[] = Array.isArray(data.events?.Events) ? data.events.Events : [];
  const actorStatus = (event: Record<string, any>): string | null => {
    const actors = [event.KillerName, ...(Array.isArray(event.Assisters) ? event.Assisters : [])]
      .filter(Boolean)
      .map(value => String(value).toLocaleLowerCase());
    if (actors.some(actor => activeIds.includes(actor))) return "You";

    const teams = actors
      .map(actor => players.find(candidate => identityList(candidate).includes(actor))?.team)
      .filter(Boolean)
      .map(String);
    if (teams.includes(playerTeam)) return "Your team";
    if (teams.length > 0) return "Enemy team";
    return null;
  };

  const firstKill = events.find(event => event.EventName === "ChampionKill");
  const firstBrick = events.find(event => event.EventName === "FirstBrick");
  const kills = Number(player.scores?.kills || 0);
  const deaths = Number(player.scores?.deaths || 0);
  const assists = Number(player.scores?.assists || 0);
  const cs = Number(player.scores?.creepScore || 0);
  const gameTime = Number(data.gameData?.gameTime || 0);
  const towerEvents = events.filter(event =>
    event.EventName === "TurretKilled" &&
    ["You", "Your team"].includes(actorStatus(event) || "")
  );

  const riotId = String(
    active.riotId ||
    player.riotId ||
    [active.riotIdGameName, active.riotIdTagLine].filter(Boolean).join("#") ||
    [player.riotIdGameName, player.riotIdTagLine].filter(Boolean).join("#") ||
    active.summonerName ||
    player.summonerName ||
    "Sin#O00"
  );

  return {
    riotId,
    champion: String(player.championName || "League"),
    gameMode: String(data.gameData?.gameMode || "Live game"),
    gameTime,
    level: Number(active.level || player.level || 1),
    currentGold: Number(active.currentGold || 0),
    kills,
    deaths,
    assists,
    cs,
    csPerMinute: gameTime > 0 ? cs / (gameTime / 60) : 0,
    towers: towerEvents.length,
    firstBlood: firstKill ? actorStatus(firstKill) : null,
    firstTower: firstBrick ? actorStatus(firstBrick) : null,
    items: (Array.isArray(player.items) ? player.items : [])
      .filter((item: Record<string, any>) => Number(item.itemID) > 0)
      .map((item: Record<string, any>) => ({
        id: String(item.itemID),
        name: String(item.displayName || "Item")
      }))
  };
}

function formatClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return minutes + ":" + remainder;
}

function liveTips(game: LiveGame): string[] {
  const minutes = game.gameTime / 60;
  const tips: string[] = [];

  if (game.firstBlood === "You") {
    tips.push("You were involved in first blood. Use the next safe reset to keep your item tempo.");
  } else if (game.firstBlood === "Your team") {
    tips.push("Your team has first blood. Stay with the lead and avoid isolated trades.");
  } else if (game.firstBlood === "Enemy team") {
    tips.push("Enemy first blood. Stabilize the next wave before taking another trade.");
  }

  if (game.firstTower === "Your team" || game.firstTower === "You") {
    tips.push("First tower is down. Reset, then regroup for the next objective.");
  }

  if (minutes >= 8 && game.csPerMinute < 5.5) {
    tips.push("CS pace is low. Prioritize safe last hits before roaming.");
  }

  if (minutes <= 15 && game.deaths >= 3) {
    tips.push("Three early deaths. Shorten trades and wait for teammate cover.");
  }

  if (game.currentGold >= 1300) {
    tips.push("You have over 1,300 gold. Look for a safe recall to spend it.");
  }

  return tips.length > 0
    ? tips.slice(0, 2)
    : ["Keep CS steady and check your gold before your next reset."];
}

function championAssetId(name: string): string {
  if (name === "Kai'Sa") return "Kaisa";
  return name.replace(/[^A-Za-z0-9]/g, "");
}

function LiveMatchPanel({ game }: { game: LiveGame | null }) {
  return (
    <section className={game ? "live-panel is-live" : "live-panel"}>
      <div className="live-heading">
        <div>
          <span className="eyebrow">LIVE CLIENT</span>
          <h2>{game ? "In game" : "Live match"}</h2>
        </div>
        <span className={game ? "live-status connected" : "live-status"}>
          <i /> {game ? "CONNECTED" : "WAITING"}
        </span>
      </div>

      {game ? (
        <div className="live-content">
          <div className="live-player-row">
            <div className="live-player">
              <img src={championImage(championAssetId(game.champion))} alt={game.champion} />
              <div>
                <strong>{game.champion}</strong>
                <span>{game.riotId}</span>
              </div>
            </div>
            <div className="live-clock">
              <strong>{formatClock(game.gameTime)}</strong>
              <span>{game.gameMode} · Level {game.level}</span>
            </div>
          </div>

          <div className="live-stat-grid">
            <div><span>KDA</span><strong>{game.kills} / {game.deaths} / {game.assists}</strong></div>
            <div><span>CS / MIN</span><strong>{game.csPerMinute.toFixed(1)}</strong></div>
            <div><span>CURRENT GOLD</span><strong>{Math.round(game.currentGold).toLocaleString()}</strong></div>
            <div><span>TEAM TOWERS</span><strong>{game.towers}</strong></div>
          </div>

          <div className="live-objectives">
            <span className={game.firstBlood ? "objective secured" : "objective"}>
              <i /> First blood{game.firstBlood ? " · " + game.firstBlood : ""}
            </span>
            <span className={game.firstTower ? "objective secured" : "objective"}>
              <i /> First tower{game.firstTower ? " · " + game.firstTower : ""}
            </span>
          </div>

          <div className="live-bottom">
            <div className="live-items">
              {game.items.slice(0, 6).map(item => (
                <img key={item.id} src={itemImage(item.id)} alt={item.name} title={item.name} />
              ))}
            </div>
            <div className="live-tips">
              <span>IN-GAME TIPS</span>
              {liveTips(game).map(tip => <p key={tip}>{tip}</p>)}
            </div>
          </div>
        </div>
      ) : (
        <p className="live-empty">Open League and enter a live match. Onyx checks the local game feed automatically.</p>
      )}
    </section>
  );
}

function App() {
  const [liveGame, setLiveGame] = useState<LiveGame | null>(null);

  useEffect(() => {
    let stopped = false;

    const pollLiveGame = async () => {
      try {
        let payload: unknown;
        if (window.__TAURI_INTERNALS__) {
          payload = await invoke<unknown>("get_live_game_data");
        } else {
          const response = await fetch("/liveclient/liveclientdata/allgamedata", { cache: "no-store" });
          if (!response.ok) throw new Error("No live match");
          payload = await response.json();
        }

        if (!stopped) setLiveGame(normalizeLiveGame(payload));
      } catch {
        if (!stopped) setLiveGame(null);
      }
    };

    void pollLiveGame();
    const timer = window.setInterval(() => void pollLiveGame(), 4000);
    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, []);

  const [playerName, playerTag] = (liveGame?.riotId || "Sin#O00").split("#");
  const summary = liveGame
    ? [
        { label: "LIVE KDA", value: liveGame.kills + " / " + liveGame.deaths + " / " + liveGame.assists },
        { label: "CS / MIN", value: liveGame.csPerMinute.toFixed(1) },
        { label: "CURRENT GOLD", value: Math.round(liveGame.currentGold).toLocaleString() },
        { label: "TEAM TOWERS", value: String(liveGame.towers) }
      ]
    : [
        { label: "LAST 3 GAMES", value: "2W – 1L" },
        { label: "AVG KDA", value: "4.8" },
        { label: "CS / MIN", value: "7.8" },
        { label: "GOLD @ 15", value: "+0.4k", positive: true }
      ];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">O</div>
          <strong>ONYX</strong>
        </div>

        <div className="sidebar-profile">
          <span className="eyebrow">PLAYER</span>
          <strong>{playerName} <small>#{playerTag || "O00"}</small></strong>
          <span className="sidebar-region">North America</span>
        </div>

        <div className="sidebar-bottom">
          <span className="demo-dot" />
          <span>{liveGame ? "Live match" : "Local feed ready"}</span>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <span className="topbar-label">PLAYER OVERVIEW</span>
          <span className={liveGame ? "preview-pill live-pill" : "preview-pill"}>
            <i /> {liveGame ? "LIVE MATCH" : "LIVE FEED READY"}
          </span>
        </header>

        <div className="page">
          <section className="profile-heading">
            <div>
              <span className="eyebrow">NORTH AMERICA · LEAGUE OF LEGENDS</span>
              <h1>{playerName} <small>#{playerTag || "O00"}</small></h1>
            </div>
            <p className="profile-note">
              {liveGame ? "Live · " + liveGame.champion + " · " + formatClock(liveGame.gameTime) : "Waiting for a live match"}
            </p>
          </section>

          <LiveMatchPanel game={liveGame} />

          <section className="summary-grid" aria-label={liveGame ? "Live performance" : "Sample performance"}>
            {summary.map(item => (
              <div className="summary-card" key={item.label}>
                <span>{item.label}</span>
                <strong className={"positive" in item && item.positive ? "positive" : ""}>{item.value}</strong>
              </div>
            ))}
          </section>

          <section className="recent-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">SAMPLE HISTORY</span>
                <h2>Recent matches</h2>
              </div>
              <span className="sample-count">EXAMPLE GAMES</span>
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
            Live stats come from League running on this PC. Match history below is sample data.
          </footer>
        </div>
      </section>
    </main>
  );
}

export default App;
