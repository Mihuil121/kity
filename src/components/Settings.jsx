import { useState } from "react";
import { LANGS } from "../i18n.js";

export default function Settings({ name, lang, setLang, onRename, onReset, onClose, t }) {
  const [n, setN] = useState(name);
  const [confirm, setConfirm] = useState(false);
  return (
    <div>
      <h2>{t.settings}</h2>
      <div className="langs" role="group" aria-label={t.language}>
        {Object.entries(LANGS).map(([code, label]) => (
          <button key={code} className={lang === code ? "on" : ""} onClick={() => setLang(code)}>{label}</button>
        ))}
      </div>
      <input className="field" value={n} onChange={(e) => setN(e.target.value)} maxLength={20} aria-label={t.catName} />
      <button className="primary" onClick={() => n.trim() && onRename(n.trim())}>{t.saveName}</button>
      {confirm
        ? <button className="ghost" style={{ color: "#C0445A" }} onClick={onReset}>{t.resetConfirm}</button>
        : <button className="ghost" onClick={() => setConfirm(true)}>{t.resetAsk}</button>}
      <button className="ghost" onClick={onClose}>{t.close}</button>
    </div>
  );
}
