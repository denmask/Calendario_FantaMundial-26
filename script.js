const { useState, useEffect, useRef } = React;

const MANAGERS = [
  { id: 1, name: "Denis Mascherin" },
  { id: 2, name: "Kevin Di Bernardo" },
  { id: 3, name: "Mattia Beltrame" },
  { id: 4, name: "Federico Burello" },
  { id: 5, name: "Alex Beltrame" },
  { id: 6, name: "Cristian Tartaro" },
  { id: 7, name: "Kevin Sandri" },
  { id: 8, name: "Andrea Campagnolo" },
  { id: 9, name: "Lorenzo Moro" },
  { id: 10, name: "Nicola Marano" },
  { id: 11, name: "Aidan Conti" },
  { id: 12, name: "Valentina Pozzi" },
];
const NATS = [
  {
    code: "ARG",
    name: "Argentina",
    flag: "https://flagcdn.com/w80/ar.png",
  },
  {
    code: "BRA",
    name: "Brasile",
    flag: "https://flagcdn.com/w80/br.png",
  },
  { code: "BEL", name: "Belgio", flag: "https://flagcdn.com/w80/be.png" },
  {
    code: "CRO",
    name: "Croazia",
    flag: "https://flagcdn.com/w80/hr.png",
  },
  {
    code: "FRA",
    name: "Francia",
    flag: "https://flagcdn.com/w80/fr.png",
  },
  {
    code: "ENG",
    name: "Inghilterra",
    flag: "https://flagcdn.com/w80/gb-eng.png",
  },
  {
    code: "NOR",
    name: "Norvegia",
    flag: "https://flagcdn.com/w80/no.png",
  },
  {
    code: "MAR",
    name: "Marocco",
    flag: "https://flagcdn.com/w80/ma.png",
  },
  { code: "NED", name: "Olanda", flag: "https://flagcdn.com/w80/nl.png" },
  {
    code: "POR",
    name: "Portogallo",
    flag: "https://flagcdn.com/w80/pt.png",
  },
  { code: "ESP", name: "Spagna", flag: "https://flagcdn.com/w80/es.png" },
  {
    code: "GER",
    name: "Germania",
    flag: "https://flagcdn.com/w80/de.png",
  },
];
const ROUNDS = [
  {
    label: "Giornata 1",
    matches: [
      { id: "g1-1", h: "BRA", a: "MAR" },
      { id: "g1-2", h: "GER", a: "POR" },
      { id: "g1-3", h: "NED", a: "BEL" },
      { id: "g1-4", h: "ESP", a: "NOR" },
      { id: "g1-5", h: "ENG", a: "CRO" },
      { id: "g1-6", h: "ARG", a: "FRA" },
    ],
  },
  {
    label: "Giornata 2",
    matches: [
      { id: "g2-1", h: "BRA", a: "ESP" },
      { id: "g2-2", h: "ENG", a: "MAR" },
      { id: "g2-3", h: "GER", a: "NED" },
      { id: "g2-4", h: "BEL", a: "CRO" },
      { id: "g2-5", h: "NOR", a: "ARG" },
      { id: "g2-6", h: "FRA", a: "POR" },
    ],
  },
  {
    label: "Giornata 3",
    matches: [
      { id: "g3-1", h: "GER", a: "BRA" },
      { id: "g3-2", h: "MAR", a: "CRO" },
      { id: "g3-3", h: "ARG", a: "ENG" },
      { id: "g3-4", h: "NED", a: "ESP" },
      { id: "g3-5", h: "NOR", a: "FRA" },
      { id: "g3-6", h: "POR", a: "BEL" },
    ],
  },
];
const KO_STAGE_LABELS = {
  r16: "Sedicesimi",
  r8: "Ottavi",
  qf: "Quarti",
  sf: "Semifinale",
  final: "Finale",
};
const KO_STAGES = [
  {
    id: "r16",
    label: "Sedicesimi",
    badge: "r16",
    icon: "⚡",
    matches: [
      { id: "r16-1" },
      { id: "r16-2" },
      { id: "r16-3" },
      { id: "r16-4" },
      { id: "r16-5" },
      { id: "r16-6" },
      { id: "r16-7" },
      { id: "r16-8" },
    ],
  },
  {
    id: "r8",
    label: "Ottavi",
    badge: "r8",
    icon: "🔥",
    matches: [
      { id: "r8-1" },
      { id: "r8-2" },
      { id: "r8-3" },
      { id: "r8-4" },
      { id: "r8-5" },
      { id: "r8-6" },
      { id: "r8-7" },
      { id: "r8-8" },
    ],
  },
  {
    id: "qf",
    label: "Quarti",
    badge: "r8",
    icon: "💥",
    matches: [{ id: "qf-1" }, { id: "qf-2" }, { id: "qf-3" }, { id: "qf-4" }],
  },
  {
    id: "sf",
    label: "Semifinali",
    badge: "r4",
    icon: "⭐",
    matches: [{ id: "sf-1" }, { id: "sf-2" }],
  },
  {
    id: "final",
    label: "Finale",
    badge: "final",
    icon: "🏆",
    matches: [{ id: "final-1" }],
  },
];
const KO_CSS = {
  r16: "ko-r16",
  r8: "ko-r16",
  qf: "ko-qf",
  sf: "ko-sf",
  final: "ko-final",
};

const sv = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};
const ld = (k, d) => {
  try {
    const v = localStorage.getItem(k);
    return v !== null ? JSON.parse(v) : d;
  } catch {
    return d;
  }
};
const gn = (c) =>
  NATS.find((n) => n.code === c) || { code: c, name: c, flag: "" };
const gm = (assign, c) => {
  const id = Object.entries(assign).find(([, v]) => v === c)?.[0];
  return MANAGERS.find((m) => m.id == id);
};

// Calcola eliminazioni automatiche: restituisce { managerId: "NomeFase" }
function computeKoElim(scores, koSlots, assign) {
  const map = {};
  KO_STAGES.forEach((stage) => {
    stage.matches.forEach((match) => {
      const sc = scores[match.id];
      const slot = koSlots[match.id] || {};
      if (!sc || sc.hs === sc.as) return;
      const loserCode = sc.hs > sc.as ? slot.a : slot.h;
      if (!loserCode) return;
      const mgr = gm(assign, loserCode);
      if (mgr && !map[mgr.id])
        map[mgr.id] = KO_STAGE_LABELS[stage.id] || stage.label;
    });
  });
  return map;
}

function CD() {
  const tgt = new Date("2026-06-11T18:00:00");
  const [diff, setDiff] = useState(Math.max(0, tgt - Date.now()));
  useEffect(() => {
    const t = setInterval(() => setDiff(Math.max(0, tgt - Date.now())), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.floor(diff / 86400000),
    h = Math.floor((diff % 86400000) / 3600000),
    m = Math.floor((diff % 3600000) / 60000),
    s = Math.floor((diff % 60000) / 1000);
  return (
    <div className="countdown">
      {[
        ["Giorni", d],
        ["Ore", h],
        ["Min", m],
        ["Sec", s],
      ].map(([l, v], i) => (
        <React.Fragment key={l}>
          {i > 0 && <div className="cd-sep">:</div>}
          <div className="cd-unit">
            <span className="cd-val">{String(v).padStart(2, "0")}</span>
            <div className="cd-lbl">{l}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function MatchCard({
  base,
  scores,
  assign,
  setModal,
  koClass,
  label,
  slotH,
  slotA,
  onSlotChange,
  isKo,
}) {
  const sc = scores[base.id];
  const has = sc !== undefined;
  let nH, nA, mH, mA;
  if (isKo) {
    nH = slotH ? gn(slotH) : { code: "", name: "?", flag: "" };
    nA = slotA ? gn(slotA) : { code: "", name: "?", flag: "" };
    mH = slotH ? gm(assign, slotH) : null;
    mA = slotA ? gm(assign, slotA) : null;
  } else {
    nH = gn(base.h);
    nA = gn(base.a);
    mH = gm(assign, base.h);
    mA = gm(assign, base.a);
  }
  const wH = has && sc.hs > sc.as,
    wA = has && sc.as > sc.hs,
    dr = has && sc.hs === sc.as;
  const loserIsH = has && wA && !dr,
    loserIsA = has && wH && !dr;
  const ph = (
    <div
      style={{
        width: 44,
        height: 30,
        borderRadius: 4,
        background: "var(--card3)",
        margin: "0 auto 5px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
      }}
    >
      ?
    </div>
  );
  return (
    <div className={`mcard2 ci${koClass ? " " + koClass : ""}`}>
      <div className="mlabel">{label || base.id.toUpperCase()}</div>
      {isKo && (
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <select
            className="ko-slot-select"
            value={slotH || ""}
            onChange={(e) => onSlotChange("h", e.target.value)}
          >
            <option value="">— Casa —</option>
            {NATS.map((n) => (
              <option key={n.code} value={n.code}>
                {n.name}
              </option>
            ))}
          </select>
          <select
            className="ko-slot-select"
            value={slotA || ""}
            onChange={(e) => onSlotChange("a", e.target.value)}
          >
            <option value="">— Ospite —</option>
            {NATS.map((n) => (
              <option key={n.code} value={n.code}>
                {n.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="mbody">
        <div className={`mteam${loserIsH ? " is-loser" : ""}`}>
          {loserIsH && <span className="loser-x">❌</span>}
          {nH.flag && nH.name !== "?" ? (
            <img
              src={nH.flag}
              className="mflag"
              alt={nH.name}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            ph
          )}
          <div className="mnat">{nH.name}</div>
          <div className="mmgr">{mH?.name || "—"}</div>
        </div>
        <div className="mcenter">
          {has ? (
            <>
              <div className="score-box">
                <span className={wH ? "sw" : wA ? "sl" : "sd"}>{sc.hs}</span>
                <span className="sdash">—</span>
                <span className={wA ? "sw" : wH ? "sl" : "sd"}>{sc.as}</span>
              </div>
              <div className={`wpill ${dr ? "pd" : "pw"}`}>
                {dr
                  ? "Pareggio"
                  : wH
                    ? nH.name.split(" ")[0]
                    : nA.name.split(" ")[0]}
              </div>
            </>
          ) : (
            <>
              <div className="vs-tag">VS</div>
              <div className="ptag">Da giocare</div>
            </>
          )}
        </div>
        <div className={`mteam${loserIsA ? " is-loser" : ""}`}>
          {loserIsA && <span className="loser-x">❌</span>}
          {nA.flag && nA.name !== "?" ? (
            <img
              src={nA.flag}
              className="mflag"
              alt={nA.name}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            ph
          )}
          <div className="mnat">{nA.name}</div>
          <div className="mmgr">{mA?.name || "—"}</div>
        </div>
      </div>
      <button
        className="mbtn2"
        onClick={() =>
          setModal({ ...base, _nH: nH, _nA: nA, _mH: mH, _mA: mA })
        }
      >
        ⚽ {has ? "Aggiorna Risultato" : "Inserisci Risultato"}
      </button>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("home");
  const [rnd, setRnd] = useState(0);
  const [koTab, setKoTab] = useState("r16");
  const [assign, setAssign] = useState(() => ld("fm26_assign", {}));
  const [manualElim, setManualElim] = useState(() => ld("fm26_elim", []));
  const [scores, setScores] = useState(() => ld("fm26_scores", {}));
  const [koSlots, setKoSlots] = useState(() => ld("fm26_koslots", {}));
  const [modal, setModal] = useState(null);
  const hsR = useRef(),
    asR = useRef();

  useEffect(() => sv("fm26_assign", assign), [assign]);
  useEffect(() => sv("fm26_elim", manualElim), [manualElim]);
  useEffect(() => sv("fm26_scores", scores), [scores]);
  useEffect(() => sv("fm26_koslots", koSlots), [koSlots]);

  const koElimMap = computeKoElim(scores, koSlots, assign);
  const isElim = (mId) => manualElim.includes(mId) || !!koElimMap[mId];
  const elimLabel = (mId) =>
    koElimMap[mId] || (manualElim.includes(mId) ? "Gironi" : null);
  const toggleManualElim = (id) =>
    setManualElim((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const saveScore = () => {
    const hs = parseInt(hsR.current.value),
      as = parseInt(asR.current.value);
    if (isNaN(hs) || isNaN(as)) return;
    setScores((p) => ({ ...p, [modal.id]: { hs, as } }));
    setModal(null);
  };
  const setKoSlot = (matchId, side, val) =>
    setKoSlots((p) => ({
      ...p,
      [matchId]: { ...p[matchId], [side]: val },
    }));

  const standings = MANAGERS.map((m) => {
    let pts = 0,
      gf = 0,
      gs = 0,
      v = 0,
      n = 0,
      p = 0;
    const nat = assign[m.id];
    ROUNDS.flatMap((r) => r.matches).forEach((match) => {
      const sc = scores[match.id];
      if (!sc || !nat) return;
      if (match.h === nat) {
        gf += sc.hs;
        gs += sc.as;
        if (sc.hs > sc.as) {
          pts += 3;
          v++;
        } else if (sc.hs === sc.as) {
          pts++;
          n++;
        } else p++;
      } else if (match.a === nat) {
        gf += sc.as;
        gs += sc.hs;
        if (sc.as > sc.hs) {
          pts += 3;
          v++;
        } else if (sc.hs === sc.as) {
          pts++;
          n++;
        } else p++;
      }
    });
    KO_STAGES.forEach((stage) => {
      stage.matches.forEach((match) => {
        const sc = scores[match.id];
        const slot = koSlots[match.id] || {};
        if (!sc || !nat) return;
        const wCode = sc.hs > sc.as ? slot.h : sc.as > sc.hs ? slot.a : null;
        if (wCode === nat) {
          const bonus =
            { r16: 2, r8: 3, qf: 5, sf: 8, final: 13 }[stage.id] || 0;
          pts += bonus;
          v++;
        }
      });
    });
    return {
      ...m,
      pts,
      gf,
      gs,
      dr: gf - gs,
      v,
      n,
      p,
      isE: isElim(m.id),
      eLabel: elimLabel(m.id),
    };
  }).sort((a, b) => b.pts - a.pts || b.dr - a.dr);

  const finalMatch = KO_STAGES.find((s) => s.id === "final").matches[0];
  const finalSc = scores[finalMatch.id];
  const finalSlot = koSlots[finalMatch.id] || {};
  const winnerCode = finalSc
    ? finalSc.hs > finalSc.as
      ? finalSlot.h
      : finalSc.as > finalSc.hs
        ? finalSlot.a
        : null
    : null;
  const winnerNat = winnerCode ? gn(winnerCode) : null;
  const winnerMgr = winnerCode ? gm(assign, winnerCode) : null;
  const currentKoStage = KO_STAGES.find((s) => s.id === koTab);

  const NAV = [
    { id: "home", label: "🏠 Home" },
    { id: "sorteggio", label: "🎲 Sorteggio" },
    { id: "gironi", label: "⚽ Fase a Gironi" },
    { id: "knockout", label: "🏆 Fase a Eliminazione" },
    { id: "classifica", label: "📊 Classifica" },
  ];

  return (
    <div>
      <div className="header">
        <div className="eyebrow">🏆 Fantapazz League · Season 2026</div>
        <h1>FantaMundial 2026</h1>
        <div className="header-sub">
          USA · Canada · Messico — 11 Giugno 2026
        </div>
        <CD />
      </div>
      <nav className="nav">
        {NAV.map((t) => (
          <button
            key={t.id}
            className={`nav-btn${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
      <main className="main">
        {tab === "home" && (
          <div>
            <div className="stitle">🏆 Fantallenatori</div>
            <div className="ssub">Le 12 squadre del FantaMundial 2026</div>
            <div className="mgrid">
              {MANAGERS.map((m, i) => {
                const nat = assign[m.id] ? gn(assign[m.id]) : null;
                const elim = isElim(m.id);
                const lbl = elimLabel(m.id);
                return (
                  <div
                    key={m.id}
                    className={`mcard ci${elim ? " eliminated" : ""}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="mcard-num">{i + 1}</div>
                    {elim && (
                      <div className="mcard-elim">❌ {lbl || "Elim."}</div>
                    )}
                    {nat?.flag ? (
                      <img
                        src={nat.flag}
                        className="mcard-flag"
                        alt={nat.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="mcard-icon">🎽</span>
                    )}
                    <div className="mcard-name">{m.name}</div>
                    <div className={`mcard-nat${nat ? "" : " none"}`}>
                      {nat ? nat.name : "Da assegnare"}
                    </div>
                  </div>
                );
              })}
            </div>
            {winnerNat && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg,rgba(255,215,0,.08),rgba(255,165,0,.05))",
                  border: "1px solid rgba(255,215,0,.35)",
                  borderRadius: "var(--radius)",
                  padding: "1.5rem",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: ".4rem" }}>
                  🏆
                </div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: "1.6rem",
                    letterSpacing: "3px",
                    color: "var(--gold)",
                  }}
                >
                  Campione del Mondo
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    marginTop: ".8rem",
                  }}
                >
                  {winnerNat.flag && (
                    <img
                      src={winnerNat.flag}
                      style={{
                        width: 40,
                        height: 27,
                        objectFit: "cover",
                        borderRadius: 4,
                        boxShadow: "0 2px 8px rgba(0,0,0,.4)",
                      }}
                      alt=""
                    />
                  )}
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed',sans-serif",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "var(--text)",
                    }}
                  >
                    {winnerNat.name}
                  </span>
                </div>
                {winnerMgr && (
                  <div
                    style={{
                      color: "var(--gold2)",
                      fontFamily: "'Barlow Condensed',sans-serif",
                      fontWeight: 600,
                      marginTop: ".3rem",
                      fontSize: ".9rem",
                    }}
                  >
                    Fantallenatore: {winnerMgr.name}
                  </div>
                )}
              </div>
            )}
            <div className="notice">
              <span style={{ fontSize: "2rem" }}>📅</span>
              <p>
                Sorteggio nazionali: <strong>Venerdì 3 Aprile 2026</strong> —
                Vai in <strong>Sorteggio</strong> per abbinare le nazionali ai
                fantallenatori.
              </p>
            </div>
          </div>
        )}

        {tab === "sorteggio" && (
          <div>
            <div className="stitle">🎲 Sorteggio Nazionali</div>
            <div className="ssub">
              Abbina ogni fantallenatore · le eliminazioni knockout avvengono
              automaticamente · qui puoi segnare le uscite ai gironi
            </div>
            <div className="agrid">
              {MANAGERS.map((m, i) => {
                const elim = isElim(m.id);
                const lbl = elimLabel(m.id);
                const isAutoElim = !!koElimMap[m.id];
                const nat = assign[m.id] ? gn(assign[m.id]) : null;
                return (
                  <div
                    key={m.id}
                    className={`arow ci${elim ? " is-elim" : ""}`}
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    {nat?.flag ? (
                      <img
                        src={nat.flag}
                        className="aflag"
                        alt=""
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="aicon">🎽</span>
                    )}
                    <div className="aname">
                      {m.name}
                      {nat && <small>{nat.name}</small>}
                      {elim && (
                        <span className="elim-label">
                          ❌ Eliminato — {lbl}
                          {isAutoElim ? " (automatico)" : ""}
                        </span>
                      )}
                    </div>
                    <select
                      className="aselect"
                      value={assign[m.id] || ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setAssign((p) => {
                          const n = { ...p };
                          if (v) n[m.id] = v;
                          else delete n[m.id];
                          return n;
                        });
                      }}
                    >
                      <option value="">— Scegli —</option>
                      {NATS.map((n) => (
                        <option key={n.code} value={n.code}>
                          {n.name}
                        </option>
                      ))}
                    </select>
                    {isAutoElim ? (
                      <div className="auto-elim-badge">❌ Auto</div>
                    ) : (
                      <button
                        className={`btn-elim${manualElim.includes(m.id) ? " active" : ""}`}
                        onClick={() => toggleManualElim(m.id)}
                      >
                        {manualElim.includes(m.id)
                          ? "✅ Riammetti"
                          : "❌ Elimina"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "gironi" && (
          <div>
            <div className="stitle">⚽ Fase a Gironi</div>
            <div className="tab-list">
              {ROUNDS.map((r, i) => (
                <button
                  key={i}
                  className={`tab-btn${rnd === i ? " active" : ""}`}
                  onClick={() => setRnd(i)}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <div className="match-grid">
              {ROUNDS[rnd].matches.map((base, i) => {
                const sc = scores[base.id];
                const has = sc !== undefined;
                const nH = gn(base.h),
                  nA = gn(base.a),
                  mH = gm(assign, base.h),
                  mA = gm(assign, base.a);
                const wH = has && sc.hs > sc.as,
                  wA = has && sc.as > sc.hs,
                  dr = has && sc.hs === sc.as;
                return (
                  <div
                    key={base.id}
                    className="mcard2 ci"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    <div className="mlabel">{base.id.toUpperCase()}</div>
                    <div className="mbody">
                      <div className="mteam">
                        {nH.flag && (
                          <img
                            src={nH.flag}
                            className="mflag"
                            alt={nH.name}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className="mnat">{nH.name}</div>
                        <div className="mmgr">{mH?.name || "CPU"}</div>
                      </div>
                      <div className="mcenter">
                        {has ? (
                          <>
                            <div className="score-box">
                              <span className={wH ? "sw" : wA ? "sl" : "sd"}>
                                {sc.hs}
                              </span>
                              <span className="sdash">—</span>
                              <span className={wA ? "sw" : wH ? "sl" : "sd"}>
                                {sc.as}
                              </span>
                            </div>
                            <div className={`wpill ${dr ? "pd" : "pw"}`}>
                              {dr
                                ? "Pareggio"
                                : wH
                                  ? nH.name.split(" ")[0]
                                  : nA.name.split(" ")[0]}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="vs-tag">VS</div>
                            <div className="ptag">Da giocare</div>
                          </>
                        )}
                      </div>
                      <div className="mteam">
                        {nA.flag && (
                          <img
                            src={nA.flag}
                            className="mflag"
                            alt={nA.name}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className="mnat">{nA.name}</div>
                        <div className="mmgr">{mA?.name || "CPU"}</div>
                      </div>
                    </div>
                    <button
                      className="mbtn2"
                      onClick={() =>
                        setModal({
                          ...base,
                          _nH: nH,
                          _nA: nA,
                          _mH: mH,
                          _mA: mA,
                        })
                      }
                    >
                      ⚽ {has ? "Aggiorna Risultato" : "Inserisci Risultato"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === "knockout" && (
          <div>
            <div className="stitle">🏆 Fase a Eliminazione</div>
            <div className="ssub">
              Inserisci il risultato → la squadra perdente e il suo
              fantallenatore vengono eliminati automaticamente
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: "1.8rem",
              }}
            >
              {[
                ["Sedicesimi", "+2"],
                ["Ottavi", "+3"],
                ["Quarti", "+5"],
                ["Semifinali", "+8"],
                ["Finale", "+13"],
              ].map(([l, b]) => (
                <div
                  key={l}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "6px 14px",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Barlow Condensed',sans-serif",
                      fontWeight: 700,
                      fontSize: ".8rem",
                      color: "var(--text2)",
                    }}
                  >
                    {l}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Bebas Neue',sans-serif",
                      fontSize: "1rem",
                      color: "var(--gold)",
                    }}
                  >
                    {b}
                  </span>
                  <span style={{ fontSize: ".7rem", color: "var(--muted)" }}>
                    pt
                  </span>
                </div>
              ))}
            </div>
            <div className="tab-list">
              {KO_STAGES.map((s) => (
                <button
                  key={s.id}
                  className={`tab-btn${koTab === s.id ? " active" : ""}`}
                  onClick={() => setKoTab(s.id)}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            {currentKoStage && (
              <div>
                <div className="ko-phase-header">
                  <div className={`ko-phase-badge ${currentKoStage.badge}`}>
                    {currentKoStage.icon} {currentKoStage.label}
                  </div>
                  <div className="ko-phase-line" />
                </div>
                {currentKoStage.id === "final" && winnerNat && (
                  <div className="trophy-wrap">
                    <div className="trophy-icon">🏆</div>
                    <div className="trophy-label">Campione del Mondo</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      {winnerNat.flag && (
                        <img
                          src={winnerNat.flag}
                          style={{
                            width: 36,
                            height: 24,
                            objectFit: "cover",
                            borderRadius: 3,
                          }}
                          alt=""
                        />
                      )}
                      <span
                        style={{
                          fontFamily: "'Barlow Condensed',sans-serif",
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "var(--text)",
                        }}
                      >
                        {winnerNat.name}
                      </span>
                    </div>
                    {winnerMgr && (
                      <div className="trophy-name">
                        Fantallenatore: {winnerMgr.name}
                      </div>
                    )}
                  </div>
                )}
                <div className="match-grid">
                  {currentKoStage.matches.map((base, i) => {
                    const slot = koSlots[base.id] || {};
                    return (
                      <MatchCard
                        key={base.id}
                        base={base}
                        scores={scores}
                        assign={assign}
                        setModal={setModal}
                        koClass={KO_CSS[currentKoStage.id]}
                        label={`${currentKoStage.label} · Partita ${i + 1}`}
                        slotH={slot.h}
                        slotA={slot.a}
                        onSlotChange={(side, val) =>
                          setKoSlot(base.id, side, val)
                        }
                        isKo={true}
                      />
                    );
                  })}
                </div>
                {/* Riepilogo eliminati in questa fase */}
                {(() => {
                  const label = KO_STAGE_LABELS[currentKoStage.id];
                  const elimInStage = MANAGERS.filter(
                    (m) => koElimMap[m.id] === label,
                  );
                  if (!elimInStage.length) return null;
                  return (
                    <div
                      style={{
                        marginTop: "2rem",
                        background: "rgba(230,57,70,.04)",
                        border: "1px solid rgba(230,57,70,.2)",
                        borderRadius: "var(--radius)",
                        padding: "1.2rem 1.5rem",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Barlow Condensed',sans-serif",
                          fontWeight: 800,
                          fontSize: ".8rem",
                          letterSpacing: "2px",
                          color: "var(--accent)",
                          marginBottom: ".8rem",
                          textTransform: "uppercase",
                        }}
                      >
                        ❌ Eliminati ai {label}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {elimInStage.map((m) => {
                          const nat = assign[m.id] ? gn(assign[m.id]) : null;
                          return (
                            <div
                              key={m.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                background: "rgba(230,57,70,.08)",
                                border: "1px solid rgba(230,57,70,.2)",
                                borderRadius: 8,
                                padding: "5px 10px",
                              }}
                            >
                              {nat?.flag && (
                                <img
                                  src={nat.flag}
                                  style={{
                                    width: 22,
                                    height: 15,
                                    objectFit: "cover",
                                    borderRadius: 2,
                                    opacity: 0.6,
                                    filter: "grayscale(.5)",
                                  }}
                                  alt=""
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              )}
                              <span
                                style={{
                                  fontFamily: "'Barlow Condensed',sans-serif",
                                  fontWeight: 700,
                                  fontSize: ".82rem",
                                  color: "var(--text2)",
                                }}
                              >
                                {m.name}
                              </span>
                              {nat && (
                                <span
                                  style={{
                                    fontSize: ".7rem",
                                    color: "var(--muted)",
                                  }}
                                >
                                  {nat.name}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {tab === "classifica" && (
          <div>
            <div className="stitle">📊 Classifica FantaMundial</div>
            <div className="ssub">
              Gironi: V+3 · P+1 · Knockout: Sed.+2 · Ott.+3 · Qrt.+5 · Semi+8 ·
              Finale+13
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="sttable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fantallenatore</th>
                    <th>Nazionale</th>
                    <th className="r">PT</th>
                    <th className="r">V</th>
                    <th className="r">N</th>
                    <th className="r">P</th>
                    <th className="r">DR</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, i) => {
                    const nat = assign[s.id] ? gn(assign[s.id]) : null;
                    return (
                      <tr key={s.id} className={s.isE ? "er" : ""}>
                        <td>
                          <span
                            className={`rn${i === 0 ? " g" : i === 1 ? " s" : i === 2 ? " b" : ""}`}
                          >
                            {i + 1}
                          </span>
                        </td>
                        <td
                          style={{
                            fontWeight: 700,
                            fontFamily: "'Barlow Condensed',sans-serif",
                            fontSize: ".95rem",
                          }}
                        >
                          {s.name}
                          {s.isE && (
                            <span className="epill">
                              ❌ {s.eLabel || "Elim."}
                            </span>
                          )}
                        </td>
                        <td>
                          {nat ? (
                            <span>
                              <img
                                src={nat.flag}
                                className="nflag"
                                alt=""
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                              <span
                                style={{
                                  fontSize: ".82rem",
                                  color: "var(--text2)",
                                }}
                              >
                                {nat.name}
                              </span>
                            </span>
                          ) : (
                            <span style={{ color: "var(--muted)" }}>—</span>
                          )}
                        </td>
                        <td className="pts">{s.pts}</td>
                        <td className="nc" style={{ color: "var(--green)" }}>
                          {s.v}
                        </td>
                        <td className="nc">{s.n}</td>
                        <td className="nc" style={{ color: "var(--accent)" }}>
                          {s.p}
                        </td>
                        <td
                          className={`nc${s.dr > 0 ? " dpos" : s.dr < 0 ? " dneg" : ""}`}
                        >
                          {s.dr > 0 ? "+" : ""}
                          {s.dr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {modal &&
        (() => {
          const nH = modal._nH || gn(modal.h || "");
          const nA = modal._nA || gn(modal.a || "");
          const mH = modal._mH || (modal.h ? gm(assign, modal.h) : null);
          const mA = modal._mA || (modal.a ? gm(assign, modal.a) : null);
          const ex = scores[modal.id];
          const isKoMatch = !modal.h; // le partite KO non hanno .h fisso
          return (
            <div
              className="moverlay"
              onClick={(e) => {
                if (e.target === e.currentTarget) setModal(null);
              }}
            >
              <div className="modal">
                <div className="mtitle">📋 Inserisci Risultato</div>
                <div className="mteams">
                  <div className="mt">
                    {nH.flag && nH.name !== "?" && (
                      <img
                        src={nH.flag}
                        className="mfl"
                        alt=""
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="mtn">{nH.name || "?"}</div>
                    {mH && <div className="mmn">{mH.name}</div>}
                  </div>
                  <div className="mvs">VS</div>
                  <div className="mt">
                    {nA.flag && nA.name !== "?" && (
                      <img
                        src={nA.flag}
                        className="mfl"
                        alt=""
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    <div className="mtn">{nA.name || "?"}</div>
                    {mA && <div className="mmn">{mA.name}</div>}
                  </div>
                </div>
                {/* Avviso solo per partite KO con entrambe le squadre selezionate */}
                {nH.name !== "?" && nA.name !== "?" && nH.name && nA.name && (
                  <div
                    style={{
                      background: "rgba(230,57,70,.06)",
                      border: "1px solid rgba(230,57,70,.15)",
                      borderRadius: 8,
                      padding: "8px 12px",
                      marginBottom: "1rem",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: ".72rem",
                        color: "var(--accent)",
                        fontFamily: "'Barlow Condensed',sans-serif",
                        fontWeight: 700,
                        letterSpacing: "1px",
                      }}
                    >
                      ⚠️ La squadra perdente verrà eliminata automaticamente
                    </span>
                  </div>
                )}
                <div className="rlbl">Risultato</div>
                <div className="sinputs">
                  <input
                    ref={hsR}
                    type="number"
                    min="0"
                    max="99"
                    className="sinput"
                    defaultValue={ex?.hs ?? 0}
                  />
                  <span className="sds">—</span>
                  <input
                    ref={asR}
                    type="number"
                    min="0"
                    max="99"
                    className="sinput"
                    defaultValue={ex?.as ?? 0}
                  />
                </div>
                <div className="mactions">
                  <button
                    className="mbtn cancel"
                    onClick={() => setModal(null)}
                  >
                    Annulla
                  </button>
                  <button className="mbtn save" onClick={saveScore}>
                    Salva ✓
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
