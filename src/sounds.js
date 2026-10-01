let ctx = null;
const audio = () => {
  try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); return ctx; }
  catch { return null; }
};

export function meow(sad = false) {
  const c = audio(); if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
  o.type = "sawtooth"; f.type = "bandpass"; f.frequency.value = 1100; f.Q.value = 3;
  const base = sad ? 520 : 650;
  o.frequency.setValueAtTime(base, t);
  o.frequency.linearRampToValueAtTime(base * 1.45, t + 0.18);
  o.frequency.linearRampToValueAtTime(base * (sad ? 0.6 : 0.85), t + (sad ? 0.9 : 0.5));
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.25, t + 0.05);
  g.gain.linearRampToValueAtTime(0, t + (sad ? 0.95 : 0.55));
  o.connect(f); f.connect(g); g.connect(c.destination);
  o.start(t); o.stop(t + 1);
}

export function purr() {
  const c = audio(); if (!c) return;
  const t = c.currentTime, len = 1.4;
  const buf = c.createBuffer(1, c.sampleRate * len, c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
  const src = c.createBufferSource(); src.buffer = buf;
  const g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain(), m = c.createGain();
  lfo.frequency.value = 24; lg.gain.value = 0.5; lfo.connect(lg); lg.connect(g.gain);
  g.gain.value = 0.5;
  m.gain.setValueAtTime(0.9, t); m.gain.linearRampToValueAtTime(0, t + len);
  src.connect(g); g.connect(m); m.connect(c.destination);
  src.start(t); lfo.start(t); lfo.stop(t + len);
}
