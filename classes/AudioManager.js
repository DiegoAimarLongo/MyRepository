export default class AudioManager {
  constructor({ soundToggleSelector = '#soundToggle' } = {}) {
    // Intent: guarda el estado del sonido y enlaza el botón para activar la interfaz de audio.
    this.audioCtx = null;
    this.soundOn = false;
    this.button = document.querySelector(soundToggleSelector);
    this.init();
  }

  // Intent: crea el contexto de audio solo cuando el usuario lo necesita, evitando inicializaciones innecesarias.
  createAudioContext() {
    if (!this.audioCtx) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (AudioCtor) this.audioCtx = new AudioCtor();
    }
    return this.audioCtx;
  }

  // Intent: emite un beep retro con frecuencia, duración y volumen específicos para feedback de acciones.
  beep(freq = 440, duration = 0.06, type = 'square', vol = 0.05) {
    if (!this.soundOn) return;
    const ctx = this.createAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
  }

  // Intent: sincroniza el toggle del sonido con la UI y activa el primer efecto cuando se habilita.
  init() {
    if (!this.button) return;

    this.button.addEventListener('click', () => {
      this.soundOn = !this.soundOn;
      if (this.soundOn && !this.audioCtx) this.createAudioContext();

      this.button.textContent = this.soundOn ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      if (this.soundOn) this.beep(660, 0.08);
    });
  }
}
