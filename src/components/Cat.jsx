import { CAT_SHEETS } from "../assets.js";

const SPEED = { idle: "1.2s", sad: "1.5s", think: "1.4s", happy: ".8s", celebrate: "1s", jump: ".8s", point: "1s" };

/**
 * Animated cat from an 8-frame sprite sheet.
 * mood: "ok" | "needy" | "sad"  — the looping state
 * anim: one-shot animation that overrides mood ("happy", "jump", "point", "celebrate")
 */
export default function Cat({ mood = "ok", anim = "", dirty = false, onTap, className = "", label }) {
  const key = anim || (mood === "sad" ? "sad" : mood === "needy" ? "think" : "idle");
  return (
    <div className={"catbox " + className} onClick={onTap} role="img" aria-label={label}>
      <div key={key} className="sprite"
        style={{ backgroundImage: `url(${CAT_SHEETS[key]})`, animationDuration: SPEED[key] }} />
      {dirty && <div className="mud"><i /><i /><i /></div>}
    </div>
  );
}
