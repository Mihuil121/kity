import { useEffect, useRef, useState } from "react";
import Cat from "./components/Cat.jsx";
import Icon, { FX_COLOR } from "./components/Icon.jsx";
import { Bowl, Tray } from "./components/Props.jsx";
import Calendar from "./components/Calendar.jsx";
import Settings from "./components/Settings.jsx";
import Intro from "./components/Intro.jsx";
import { BACKGROUNDS, UI } from "./assets.js";
import { T, pick, detectLang } from "./i18n.js";
import { keyOf, addDays } from "./dates.js";
import { liveStats, clamp, stageIndex } from "./stats.js";
import { loadState, saveState, clearState } from "./storage.js";
import { meow, purr } from "./sounds.js";

const REWARDS = [[7, UI.starBronze], [14, UI.starSilver], [30, UI.starGold], [90, UI.trophy]];

export default function App() {
  const [st, setSt] = useState(() => loadState());
  const [lang, setLangState] = useState(() => loadState()?.lang || detectLang());
  const [now, setNow] = useState(Date.now());
  const [anim, setAnim] = useState("");
  const [party, setParty] = useState(0);
  const [fx, setFx] = useState([]);
  const [say, setSay] = useState("");
  const [sheet, setSheet] = useState(null);
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const timers = useRef({});
  const t = T[lang];

  // Stats decay over time: re-render every minute.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = t.title;
  }, [t]);

  const update = (fn) => setSt((prev) => { const next = fn(prev); saveState(next); return next; });
  const setLang = (l) => { setLangState(l); if (st) update((p) => ({ ...p, lang: l })); };

  if (!st) {
    return <Intro lang={lang} setLang={setLangState} t={t} onStart={(name) => {
      const s = { name, lang, start: keyOf(new Date()), marks: {}, stats: { food: 70, wash: 90, tray: 100, joy: 70 }, t: Date.now() };
      saveState(s); setSt(s);
    }} />;
  }

  const today = keyOf(new Date());
  const yest = keyOf(addDays(new Date(), -1));
  const marks = st.marks || {};
  const stats = liveStats(st, now);
  const soberDays = Object.values(marks).filter((v) => v === "sober").length;

  let streak = 0;
  for (let d = marks[today] ? new Date() : addDays(new Date(), -1); marks[keyOf(d)] === "sober"; d = addDays(d, -1)) streak++;

  const sadMode = (marks[today] || marks[yest]) === "drank";
  const needy = Math.min(stats.food, stats.wash, stats.tray) < 25;
  const mood = sadMode ? "sad" : needy ? "needy" : "ok";
  const bg = sadMode ? BACKGROUNDS.night : streak >= 30 ? BACKGROUNDS.beach : streak >= 7 ? BACKGROUNDS.clouds : BACKGROUNDS.day;
  const scale = 0.62 + 0.38 * Math.min(soberDays, 90) / 90;
  const nextReward = REWARDS.find((r) => soberDays < r[0]);

  const later = (name, fn, ms) => { clearTimeout(timers.current[name]); timers.current[name] = setTimeout(fn, ms); };

  const burst = (icons, a = "happy", ms = 1600) => {
    const items = icons.map((e, i) => ({ id: Math.random(), e, x: 30 + Math.random() * 40, d: i * 120 }));
    setFx((f) => [...f, ...items]);
    setTimeout(() => setFx((f) => f.filter((x) => !items.includes(x))), 1800);
    if (a) { setAnim(a); later("anim", () => setAnim(""), ms); }
  };
  const talk = (line) => { setSay(line); later("say", () => setSay(""), 3800); };

  const act = (patch, icons, line, a = "happy") => {
    update((p) => {
      const n = patch(liveStats(p, Date.now()));
      if (sadMode) n.joy = Math.min(n.joy, 30);
      return { ...p, stats: n, t: Date.now() };
    });
    burst(icons, sadMode ? "sad" : a);
    if (line) talk(line);
  };

  const feed = () => { meow(false); act((s) => ({ ...s, food: clamp(s.food + 35), joy: clamp(s.joy + 5) }), ["fish", "heart"], stats.food > 90 ? t.say.full : t.say.yum); };
  const wash = () => act((s) => ({ ...s, wash: 100, joy: clamp(s.joy - 4) }), ["bubbles", "bubbles", "drop"], t.say.wash, "jump");
  const tray = () => act((s) => ({ ...s, tray: 100 }), ["sparkle", "sparkle"], t.say.tray, "point");
  const pet = () => { purr(); act((s) => ({ ...s, joy: clamp(s.joy + 12) }), ["heart", "heart"], sadMode ? t.say.petSad : pick(t.say.pet)); };

  const mark = (k, v) => {
    update((p) => {
      const m = { ...(p.marks || {}) };
      if (v) m[k] = v; else delete m[k];
      const s = liveStats(p, Date.now());
      if (v === "drank" && (k === today || k === yest)) s.joy = 5;
      if (v === "sober") s.joy = clamp(s.joy + 25);
      return { ...p, marks: m, stats: s, t: Date.now() };
    });
    if (v === "drank") {
      meow(true);
      setSheet({ type: "sad", text: pick(t.sad)(st.name) });
    } else if (v === "sober") {
      meow(false);
      const n = Object.values({ ...marks, [k]: "sober" }).filter((x) => x === "sober").length;
      setSheet({ type: "happy", text: pick(t.happy)(st.name), milestone: t.milestones[n] });
      burst([], "celebrate", 3200); setParty(Date.now());
    } else setSheet(null);
  };

  const bars = [
    ["food", stats.food, "#E8A33D"], ["wash", stats.wash, "#4FA9D6"],
    ["tray", stats.tray, "#8C7AC4"], ["joy", stats.joy, "#E26D8C"],
  ];
  const hint = !say && (stats.food < 25 ? t.say.hungry : stats.tray < 25 ? t.say.trayDirty : stats.wash < 25 ? t.say.dirty : "");

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1 className="name">{st.name}</h1>
          <div className="stage">{t.stages[stageIndex(soberDays)]} · {t.soberDays(soberDays)}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="streak"><b>{streak}</b><span>{t.streak(streak)}</span></div>
          <button className="gear" aria-label={t.settings} onClick={() => setSheet({ type: "settings" })}><Icon n="sliders" s={22} /></button>
        </div>
      </header>

      <div className="shelf">
        {REWARDS.map(([n, img]) => (
          <img key={n} src={img} alt={t.reward(n)} title={t.reward(n)} className={soberDays >= n ? "" : "lock"} />
        ))}
        <span>{nextReward ? t.toReward(nextReward[0] - soberDays) : t.allRewards}</span>
      </div>

      <div className="scene" style={{ backgroundImage: `url(${bg})` }}>
        {sadMode && <div className="rain" />}
        {party > 0 && <img key={party} className="confetti" src={UI.confetti} alt="" />}
        <Bowl full={stats.food > 40} />
        <Tray dirty={stats.tray < 40} />
        <div className="catwrap" style={{ transform: `translateX(-50%) scale(${scale})` }}>
          <Cat mood={mood} anim={anim} dirty={stats.wash < 30} onTap={pet} label={t.catLabel} />
        </div>
        {anim === "happy" && !sadMode && <img key={"sp" + fx.length} className="sparkle" src={UI.sparkles} alt="" />}
        {fx.map((f) => (
          <div key={f.id} className="fx" style={{ left: f.x + "%", animationDelay: f.d + "ms", color: FX_COLOR[f.e] }}>
            <Icon n={f.e} s={30} />
          </div>
        ))}
        {(say || hint || sadMode) && <div className="bubble">{say || hint || t.say.sad}</div>}
      </div>

      <div className="stats">
        {bars.map(([k, v, c]) => (
          <div className="stat" key={k}>
            <label><span>{t.stats[k]}</span><span>{Math.round(v)}%</span></label>
            <div className="bar"><i style={{ width: v + "%", background: c }} /></div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="act" onClick={feed}><Icon n="fish" s={28} />{t.actions.feed}</button>
        <button className="act" onClick={wash}><Icon n="bubbles" s={28} />{t.actions.wash}</button>
        <button className="act" onClick={tray}><Icon n="broom" s={28} />{t.actions.tray}</button>
        <button className="act" onClick={pet}><Icon n="heart" s={28} />{t.actions.pet}</button>
      </div>

      <section className="checkin">
        {marks[today] ? (
          <div className="done">
            <div className="em"><Icon n={marks[today] === "sober" ? "check" : "glass"} s={26} /></div>
            <div>
              <h2>{marks[today] === "sober" ? t.todaySober : t.todayDrank}</h2>
              <button className="linkbtn" onClick={() => setSheet({ type: "day", k: today })}>{t.change}</button>
            </div>
          </div>
        ) : (
          <div>
            <h2>{t.howToday}</h2>
            <p>{t.waits(st.name)}</p>
            <div className="row">
              <button className="big yes" onClick={() => mark(today, "sober")}><Icon n="check" s={20} />{t.sober}</button>
              <button className="big no" onClick={() => mark(today, "drank")}><Icon n="glass" s={20} />{t.drank}</button>
            </div>
          </div>
        )}
      </section>

      <Calendar month={month} setMonth={setMonth} marks={marks} start={st.start} today={today} t={t}
        onPick={(k) => setSheet({ type: "day", k })} />

      {sheet && (
        <div className="veil" onClick={(e) => e.target === e.currentTarget && setSheet(null)}>
          <div className="sheet" role="dialog" aria-modal="true">
            {sheet.type === "sad" && (
              <div>
                <Cat mood="sad" className="mini" label={t.catLabel} />
                <h2>{t.cries(st.name)}</h2>
                <p>{sheet.text}</p>
                <p style={{ color: "var(--ink)" }}>{t.tomorrow}</p>
                <button className="primary" onClick={() => { setSheet(null); pet(); }}>{t.hug}</button>
              </div>
            )}
            {sheet.type === "happy" && (
              <div>
                <Cat anim="celebrate" className="mini" label={t.catLabel} />
                <h2>{sheet.milestone || t.wellDone}</h2>
                <p>{sheet.text}</p>
                <button className="primary" onClick={() => { setSheet(null); burst(["heart", "sparkle", "heart"], "celebrate", 2400); setParty(Date.now()); }}>
                  {t.petName(st.name)}
                </button>
              </div>
            )}
            {sheet.type === "day" && (
              <div>
                <h2>{new Date(sheet.k + "T12:00").toLocaleDateString(t.locale, { day: "numeric", month: "long" })}</h2>
                <p>{t.howThisDay}</p>
                <div className="row">
                  <button className="big yes" onClick={() => mark(sheet.k, "sober")}><Icon n="check" s={20} />{t.sober}</button>
                  <button className="big no" onClick={() => mark(sheet.k, "drank")}><Icon n="glass" s={20} />{t.drank}</button>
                </div>
                {marks[sheet.k] && <button className="ghost" onClick={() => mark(sheet.k, null)}>{t.clearMark}</button>}
              </div>
            )}
            {sheet.type === "settings" && (
              <Settings name={st.name} lang={lang} setLang={setLang} t={t}
                onRename={(n) => { update((p) => ({ ...p, name: n })); setSheet(null); }}
                onReset={() => { clearState(); setSt(null); setSheet(null); }}
                onClose={() => setSheet(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
