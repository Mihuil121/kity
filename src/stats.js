// How many points each stat loses per hour.
export const RATES = { food: 5, wash: 2.2, tray: 3, joy: 3 };
export const clamp = (v) => Math.max(0, Math.min(100, v));

export function liveStats(state, now) {
  const hours = (now - state.t) / 3.6e6;
  const s = {};
  for (const k in RATES) s[k] = clamp(state.stats[k] - RATES[k] * hours);
  return s;
}

export function stageIndex(soberDays) {
  if (soberDays < 7) return 0;
  if (soberDays < 30) return 1;
  if (soberDays < 90) return 2;
  return 3;
}
