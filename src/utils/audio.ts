/**
 * Cinematic Audio Engine
 * Supports external audio file (assets/music.mp3) with an emotional Web Audio API
 * ambient piano soundscape fallback so the user always has a breathtaking musical experience.
 */

class CinematicAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private audioElement: HTMLAudioElement | null = null;
  private isProcedural: boolean = false;
  private proceduralInterval: number | null = null;
  private gainNode: GainNode | null = null;
  private masterVolume: number = 0.65;
  private analyser: AnalyserNode | null = null;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.gainNode = this.audioCtx.createGain();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public async toggle(audioSrc: string = "/assets/music.mp3"): Promise<boolean> {
    this.initContext();
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.play(audioSrc);
      return true;
    }
  }

  public async play(audioSrc: string = "/assets/music.mp3"): Promise<void> {
    this.initContext();
    if (!this.audioCtx || !this.gainNode) return;

    this.isPlaying = true;

    // Try playing the audio element first
    try {
      if (!this.audioElement) {
        this.audioElement = new Audio(audioSrc);
        this.audioElement.loop = true;
        this.audioElement.crossOrigin = "anonymous";
        
        try {
          const source = this.audioCtx.createMediaElementSource(this.audioElement);
          source.connect(this.gainNode);
        } catch {
          // If already connected or CORS, fallback
        }
      }

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        await playPromise;
        this.isProcedural = false;
        // Fade in
        this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(this.masterVolume, this.audioCtx.currentTime + 2.0);
        return;
      }
    } catch {
      // External mp3 not present or failed -> Switch to built-in procedural ambient piano
      this.startProceduralAmbient();
    }
  }

  private startProceduralAmbient() {
    if (!this.audioCtx || !this.gainNode) return;
    this.isProcedural = true;

    // Fade in master gain
    this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
    this.gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.75, this.audioCtx.currentTime + 2.0);

    // Warm chord progression: Dbmaj9 -> Fm7 -> Bbm9 -> Gbmaj7
    const chords = [
      [277.18, 349.23, 415.30, 523.25, 622.25], // Db, F, Ab, C, Eb
      [349.23, 440.00, 523.25, 659.25],         // F, A, C, E
      [233.08, 277.18, 349.23, 415.30, 523.25], // Bb, Db, F, Ab, C
      [185.00, 233.08, 277.18, 369.99, 466.16]  // Gb, Bb, Db, F#, Bb
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!this.isPlaying || !this.audioCtx || !this.gainNode) return;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      notes.forEach((freq, i) => {
        if (!this.audioCtx || !this.gainNode) return;
        const now = this.audioCtx.currentTime + i * 0.12;

        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800 + (Math.sin(now) * 200), now);
        filter.Q.value = 1.2;

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.18 / (i + 1), now + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 4.8);
      });
    };

    playChord();
    this.proceduralInterval = window.setInterval(playChord, 4600);
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.audioCtx && this.gainNode) {
      this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.2);
    }
    if (this.audioElement) {
      setTimeout(() => {
        if (!this.isPlaying && this.audioElement) {
          this.audioElement.pause();
        }
      }, 1200);
    }
    if (this.proceduralInterval) {
      clearInterval(this.proceduralInterval);
      this.proceduralInterval = null;
    }
  }

  public setVolume(val: number): void {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.audioCtx && this.isPlaying) {
      this.gainNode.gain.linearRampToValueAtTime(this.masterVolume, this.audioCtx.currentTime + 0.1);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioManager = new CinematicAudioEngine();
