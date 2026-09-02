export default class AudioManager {

  constructor({ soundToggleSelector = '#soundToggle' } = {}) {
    // Intent: guarda el estado del sonido y enlaza el botón
    // para activar la interfaz de audio.
    this.audioCtx = null;
    this.soundOn = true;
    this.button = document.querySelector(soundToggleSelector);
    this.init();
  }

  updateButtonLabel() {
    if (!this.button) return;

    this.button.textContent = this.soundOn ? '🔊 SFX: ON' : '🔇 SFX: OFF';
    this.button.setAttribute('aria-pressed', String(this.soundOn));
    this.button.classList.toggle('is-on', this.soundOn);
  }

  resumeAudioContext() {
    const ctx = this.createAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  beep(freq = 440, duration = 0.06, type = 'square', vol = 0.05) {
  // Intent: emite un beep retro con frecuencia, duración y volumen
  // específicos para feedback de acciones.
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

  createAudioContext() {
  // Intent: crea el contexto de audio solo cuando el usuario lo necesita,
  // evitando inicializaciones innecesarias.
    if (!this.audioCtx) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (AudioCtor) this.audioCtx = new AudioCtor();
    }
    return this.audioCtx;
  }

  init() {
  // Intent: sincroniza el toggle del sonido con la UI y activa
  // el primer efecto cuando se habilita.
    if (!this.button) return;

    this.updateButtonLabel();
    this.resumeAudioContext();

    const unlockAudio = () => {
      this.resumeAudioContext();
      if (this.soundOn) this.beep(660, 0.08);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    this.button.addEventListener('click', () => {
      this.soundOn = !this.soundOn;
      this.updateButtonLabel();

      if (this.soundOn) {
        this.resumeAudioContext();
        this.beep(660, 0.08);
      }
    });

    // Intent: reproduce un beep cada vez que el usuario hace click
    // en cualquier parte de la pantalla si el sonido está activado.
    document.addEventListener('click', () => {
      if (this.soundOn) this.beep();
    });
  }
}
