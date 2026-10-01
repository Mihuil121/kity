const KEY = "kotik-state-v1";

export function loadState() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
}
export function clearState() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
