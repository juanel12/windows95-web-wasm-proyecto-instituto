// Sintetizador Web Audio API para sonidos retro de Windows 95
let audioCtx = null;
let isMuted = false;

function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setSoundMuted(muted) {
  isMuted = muted;
}

export function getSoundMuted() {
  return isMuted;
}

/**
 * Reproduce una versión polifónica sintetizada inspirada en el clásico
 * acorde de bienvenida de Windows 95 ("The Microsoft Sound").
 */
export function playStartupSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const playNote = (freq, start, duration, type = 'sine', volume = 0.08) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + start);

    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(volume, now + start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + start);
    osc.stop(now + start + duration + 0.05);
  };

  // Progresión ambiental clásica: Eb -> F -> Bb -> Ab/Eb (cristalino)
  // Pad base suave
  playNote(155.56, 0.0, 2.2, 'triangle', 0.06); // Eb3
  playNote(233.08, 0.0, 2.2, 'sine', 0.05);     // Bb3
  playNote(311.13, 0.0, 1.8, 'sine', 0.05);     // Eb4

  // Arpegio ascendente cálido
  playNote(392.00, 0.05, 0.7, 'sine', 0.07);    // G4
  playNote(466.16, 0.25, 0.7, 'sine', 0.07);    // Bb4
  playNote(622.25, 0.45, 0.9, 'sine', 0.08);    // Eb5
  playNote(783.99, 0.65, 1.1, 'triangle', 0.05);// G5

  // Resolución final luminosa
  playNote(207.65, 1.05, 1.8, 'triangle', 0.06);// Ab3
  playNote(523.25, 1.05, 1.6, 'sine', 0.06);    // C5
  playNote(622.25, 1.15, 1.7, 'sine', 0.07);    // Eb5
  playNote(932.33, 1.25, 1.8, 'sine', 0.04);    // Bb5
}

export function playClickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(900, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.035);
}

export function playErrorSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  [440, 349.23].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now + idx * 0.12);
    gain.gain.setValueAtTime(0.06, now + idx * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 0.2);
  });
}

export function playVictorySound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.1);
    gain.gain.setValueAtTime(0.07, now + idx * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + idx * 0.1);
    osc.stop(now + idx * 0.1 + 0.28);
  });
}
