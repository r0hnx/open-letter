/*
  sound.js
  Subtle audio feedback for Open Letter.
  Uses Web Audio API for paper/ink-inspired sounds.
*/
const OpenLetterSound = (() => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let isMuted = false;

  // Check if audio is available and not blocked
  function audioAvailable() {
    return ctx.state !== 'suspended' || 'ontouchstart' in window;
  }

  function mute(val) {
    isMuted = val;
  }

  function toggleMute() {
    isMuted = !isMuted;
    return isMuted;
  }

  // Play a subtle paper rustle / seal break sound
  function playSealBreak() {
    if (isMuted || !audioAvailable()) return Promise.resolve();

    return new Promise((resolve) => {
      const now = ctx.currentTime;

      // Brown noise base (paper-like texture)
      const noise = ctx.createBufferSource();
      const noiseBuffer = ctx.createBuffer(1, 0.3 * ctx.sampleRate, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1;
      }
      noise.buffer = noiseBuffer;

      // Filter to shape the noise into a paper rustle
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.3);

      // Envelope for quick attack, longer release
      const envelope = ctx.createGain();
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(0.15, now + 0.02);
      envelope.gain.linearRampToValueAtTime(0, now + 0.3);

      noise.connect(filter);
      filter.connect(envelope);
      envelope.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.3);

      // Add a subtle low-end thud for the seal break
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      oscGain.gain.setValueAtTime(0.08, now);
      oscGain.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);

      envelope.onended = resolve;
    });
  }

  // Play a gentle paper unfold / page reveal sound
  function playPaperUnfold() {
    if (isMuted || !audioAvailable()) return Promise.resolve();

    return new Promise((resolve) => {
      const now = ctx.currentTime;

      // White noise with high-pass filter (paper unfolding)
      const noise = ctx.createBufferSource();
      const noiseBuffer = ctx.createBuffer(1, 0.5 * ctx.sampleRate, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1;
      }
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(4000, now + 0.4);

      const envelope = ctx.createGain();
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(0.12, now + 0.05);
      envelope.gain.linearRampToValueAtTime(0.08, now + 0.2);
      envelope.gain.linearRampToValueAtTime(0, now + 0.5);

      noise.connect(filter);
      filter.connect(envelope);
      envelope.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.5);

      envelope.onended = resolve;
    });
  }

  // Play a soft click for UI interactions (theme selection, etc.)
  function playClick() {
    if (isMuted || !audioAvailable()) return Promise.resolve();

    return new Promise((resolve) => {
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);

      gain.onended = resolve;
    });
  }

  // Play a subtle fountain pen scratch for writing start
  function playPenScratch() {
    if (isMuted || !audioAvailable()) return Promise.resolve();

    return new Promise((resolve) => {
      const now = ctx.currentTime;

      // High-frequency noise for pen on paper
      const noise = ctx.createBufferSource();
      const noiseBuffer = ctx.createBuffer(1, 0.15 * ctx.sampleRate, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(4000, now);
      filter.Q.setValueAtTime(2, now);

      const envelope = ctx.createGain();
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(0.1, now + 0.01);
      envelope.gain.linearRampToValueAtTime(0.05, now + 0.08);
      envelope.gain.linearRampToValueAtTime(0, now + 0.15);

      noise.connect(filter);
      filter.connect(envelope);
      envelope.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.15);

      envelope.onended = resolve;
    });
  }

  // Initialize - handle mobile audio unlock
  function init() {
    if ('ontouchstart' in window) {
      // On mobile, we need user interaction to unlock audio
      document.addEventListener('touchstart', () => {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }, { once: true, passive: true });
    }
  }

  // Resume audio context after user interaction
  function resume() {
    if (ctx.state === 'suspended') {
      return ctx.resume().catch(() => {});
    }
    return Promise.resolve();
  }

  return {
    init,
    resume,
    mute,
    toggleMute,
    playSealBreak,
    playPaperUnfold,
    playClick,
    playPenScratch,
  };
})();

// Initialize on load
OpenLetterSound.init();
