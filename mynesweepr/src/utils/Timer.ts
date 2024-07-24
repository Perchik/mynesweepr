type Callback = (elapsedTime: number) => void;

class Timer {
  private startTime: number | null = null;
  private elapsedTime: number = 0;
  private animationFrameId: number | null = null;
  private running: boolean = false;
  private callback: Callback;

  constructor(callback: Callback) {
    this.callback = callback;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.startTime = performance.now();
    this.elapsedTime = 0;
    this.tick();
  }

  stop() {
    this.running = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  reset() {
    this.stop();
    this.elapsedTime = 0;
    this.startTime = null;
  }

  getElapsedTime(): number {
    return this.elapsedTime;
  }

  private tick = () => {
    if (!this.running) return;
    const currentTime = performance.now();
    this.elapsedTime = currentTime - (this.startTime || 0);
    this.callback(this.elapsedTime);
    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}

export default Timer;
