import { useState } from "react";
import Cat from "./Cat.jsx";
import { LANGS } from "../i18n.js";

export default function Intro({ onStart, lang, setLang, t }) {
  const [n, setN] = useState("");
  const name = n.trim() || t.defaultName;
  return (
    <div className="intro">
      <div className="langs">
        {Object.entries(LANGS).map(([code, label]) => (
          <button key={code} className={lang === code ? "on" : ""} onClick={() => setLang(code)}>{label}</button>
        ))}
      </div>
      <Cat anim="happy" className="mini" label={t.catLabel} />
      <h1>{t.introTitle}</h1>
      <p>{t.introText}</p>
      <input className="field" value={n} onChange={(e) => setN(e.target.value)} maxLength={20}
        aria-label={t.catName} placeholder={t.defaultName} />
      <button className="primary intro-btn" onClick={() => onStart(name)}>{t.takeHome}</button>
    </div>
  );
}
