export default class AudioManager {

  constructor({
    soundToggleSelector = '#soundToggle',
    musicToggleSelector = '#musicToggle',
    eventBus
  } = {}) {
    // Intent: guarda el estado del sonido y enlaza el botón
    // para activar la interfaz de audio.
    this.audioCtx = null;
    this.soundOn = true;
    this.musicOn = true;
    this.eventBus = eventBus;
    this.button = document.querySelector(soundToggleSelector);
    this.musicButton = document.querySelector(musicToggleSelector);
    this.backgroundMusic = new Audio('assets/audio/global.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.preload = 'auto';
    this.init();
  }

  updateButtonLabel() {
    if (!this.button) return;

    this.button.textContent = this.soundOn ? '🔊 SFX: ON' : '🔇 SFX: OFF';
    this.button.setAttribute('aria-pressed', String(this.soundOn));
    this.button.classList.toggle('is-on', this.soundOn);
  }

  updateMusicButtonLabel() {
    if (!this.musicButton) return;

    this.musicButton.textContent = this.musicOn ? '🎵 Music: ON' : '🔇 Music: OFF';
    this.musicButton.setAttribute('aria-pressed', String(this.musicOn));
    this.musicButton.classList.toggle('is-on', this.musicOn);
  }

  playMusic() {
    if (!this.musicOn) return;

    const playRequest = this.backgroundMusic.play();
    if (playRequest) {
      playRequest.catch((error) => {
        if (error.name !== 'NotAllowedError') {
          console.error('No se pudo reproducir la música de fondo.', error);
        }
      });
    }
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
    this.updateButtonLabel();
    this.updateMusicButtonLabel();
    this.resumeAudioContext();
    this.playMusic();

    const unlockAudio = () => {
      this.resumeAudioContext();
      if (this.soundOn) this.beep(660, 0.08);
      this.playMusic();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    this.button?.addEventListener('click', () => {
      this.soundOn = !this.soundOn;
      this.updateButtonLabel();
      this.eventBus?.emit('audio:changed', this.soundOn);

      if (this.soundOn) {
        this.resumeAudioContext();
        this.beep(660, 0.08);
      }
    });

    this.musicButton?.addEventListener('click', () => {
      this.musicOn = !this.musicOn;
      this.updateMusicButtonLabel();

      if (this.musicOn) {
        this.playMusic();
      } else {
        this.backgroundMusic.pause();
      }
    });

    // Intent: reproduce un beep cada vez que el usuario hace click
    // en cualquier parte de la pantalla, incluso si otro listener detiene
    // la propagación del evento.
    document.addEventListener('click', () => {
      if (this.soundOn) this.beep();
    }, true);
  }
}
