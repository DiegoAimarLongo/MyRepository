export default class AudioManager {
  constructor({ eventBus } = {}) {
    this.audioCtx = null;
    this.soundVolume = 100;
    this.musicVolume = 70;
    this.explosionSounds = [
      'assets/audio/Fx/explotion1.mp3',
      'assets/audio/Fx/explotion2.mp3',
      'assets/audio/Fx/explotion3.mp3',
      'assets/audio/Fx/explotion4.mp3'
    ];
    this.eventBus = eventBus;
    this.backgroundMusic = new Audio('assets/audio/global.mp3');
    this.backgroundMusic.loop = true;
    this.backgroundMusic.preload = 'auto';
    this.backgroundMusic.volume = this.musicVolume / 100;
  }

  playMusic() {
    if (this.musicVolume === 0) return;

    const playRequest = this.backgroundMusic.play();
    if (playRequest) {
      playRequest.catch((error) => {
        if (error.name !== 'NotAllowedError') {
          console.error('No se pudo reproducir la música de fondo.', error);
        }
      });
    }
  }

  playMeteorExplosion() {
    if (this.soundVolume === 0) return;

    const randomIndex = Math.floor(Math.random() * this.explosionSounds.length);
    const explosion = new Audio(this.explosionSounds[randomIndex]);
    explosion.volume = this.soundVolume / 100;
    const playRequest = explosion.play();

    if (playRequest) {
      playRequest.catch((error) => {
        if (error.name !== 'NotAllowedError') {
          console.error('No se pudo reproducir el efecto de explosión.', error);
        }
      });
    }
  }

  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(100, Number(volume)));
    this.eventBus?.emit('audio:volume-changed', this.soundVolume);
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(100, Number(volume)));
    this.backgroundMusic.volume = this.musicVolume / 100;
    this.eventBus?.emit('audio:music-volume-changed', this.musicVolume);

    if (this.musicVolume === 0) {
      this.backgroundMusic.pause();
    } else {
      this.playMusic();
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
    if (this.soundVolume === 0) return;
    const ctx = this.createAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol * this.soundVolume / 100;

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

}
