import { keyOf, fromKey } from "../dates.js";
import Icon from "./Icon.jsx";

export default function Calendar({ month, setMonth, marks, start, today, onPick, t }) {
  const y = month.getFullYear(), m = month.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const offset = (new Date(y, m, 1).getDay() + 6) % 7; // week starts on Monday
  const nice = (k) => fromKey(k).toLocaleDateString(t.locale, { day: "numeric", month: "long" });

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(<div key={"b" + i} />);
  for (let d = 1; d <= days; d++) {
    const k = keyOf(new Date(y, m, d));
    const v = marks[k];
    const off = k > today || k < start;
    cells.push(
      <button key={k} disabled={off}
        className={"day " + (v || (off ? "" : "on")) + (k === today ? " today" : "")}
        onClick={() => onPick(k)}
        aria-label={nice(k) + (v === "sober" ? `, ${t.legendSober}` : v === "drank" ? `, ${t.legendDrank}` : "")}>
        {d}
        {v && <em><Icon n={v === "sober" ? "paw" : "drop"} s={12} /></em>}
      </button>
    );
  }

  return (
    <section className="cal">
      <div className="calhead">
        <button aria-label={t.prevMonth} onClick={() => setMonth(new Date(y, m - 1, 1))}><Icon n="left" s={22} /></button>
        <h3>{month.toLocaleDateString(t.locale, { month: "long", year: "numeric" })}</h3>
        <button aria-label={t.nextMonth} onClick={() => setMonth(new Date(y, m + 1, 1))}><Icon n="right" s={22} /></button>
      </div>
      <div className="grid">
        {t.weekdays.map((w) => <div className="wd" key={w}>{w}</div>)}
        {cells}
      </div>
      <div className="legend">
        <span className="lg"><Icon n="paw" s={14} /> {t.legendSober}</span>
        <span className="lg"><Icon n="drop" s={14} /> {t.legendDrank}</span>
        <span>{t.legendHint}</span>
      </div>
    </section>
  );
}
