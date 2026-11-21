// Synthesised sound effects: every sound is built with WebAudio
// oscillators, so the game ships no audio files at all.

let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

// The context can only start after a user gesture, so it is created
// lazily on the first sound and then reused.
function context() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone(freq, startAt, dur, type, vol, slideTo) {
  const ctx = context();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + startAt + dur);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + dur + 0.05);
}

// Bright two-note chime when a difference is found.
export function playFind() {
  tone(880, 0, 0.16, 'sine', 0.22);
  tone(1318, 0.09, 0.24, 'sine', 0.18);
}

// Dull low thud for a wrong click.
export function playMiss() {
  tone(160, 0, 0.18, 'square', 0.12, 70);
}

// Short tick when the timer drops under ten seconds.
export function playTick() {
  tone(1200, 0, 0.05, 'square', 0.06);
}

// Rising arpeggio for a finished level.
export function playFanfare() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => tone(n, i * 0.12, 0.3, 'triangle', 0.2));
  tone(1318, 0.5, 0.5, 'triangle', 0.18);
}

// Soft shimmer for a hint.
export function playHint() {
  tone(1568, 0, 0.2, 'sine', 0.1, 2093);
}
