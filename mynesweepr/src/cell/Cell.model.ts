export enum VisualState {
  Open,
  Closed,
  Pressed,
  Exploded,
}

export enum MarkerState {
  None,
  Flagged,
  Guessed,
  Mine,
}

class Cell {
  private _value: number;
  position: { x: number; y: number };
  visualState: VisualState;
  markerState: MarkerState;
  neighbors: Cell[] = [];

  constructor(value: number, position: { x: number; y: number }) {
    this._value = value;
    this.position = position;
    this.visualState = VisualState.Closed;
    this.markerState = MarkerState.None;
  }

  get value(): number {
    return this._value;
  }

  get isMine(): boolean {
    return this._value === -1;
  }

  get isOpen(): boolean {
    return this.visualState === VisualState.Open;
  }

  get isEmpty(): boolean {
    return this._value === 0;
  }

  get isMarked(): boolean {
    return (
      this.markerState === MarkerState.Flagged ||
      this.markerState === MarkerState.Guessed
    );
  }

  incrementValue() {
    this._value++;
  }

  decrementValue() {
    Math.max(this._value--, 0);
  }

  setNeighbors(neighbors: Cell[]): void {
    this.neighbors = neighbors;
  }

  forEachNeighbor(callback: (neighbor: Cell) => void): void {
    this.neighbors.forEach(callback);
  }

  maybeOpen(): boolean {
    if (this.isMarked || this.isOpen) return false;

    this.visualState = VisualState.Open;
    if (this.isMine) {
      this.markerState = MarkerState.Mine;
    }
    return true;
  }

  toggleFlag(useGuessing = false): boolean {
    if (this.markerState === MarkerState.None) {
      this.markerState = MarkerState.Flagged;
    } else if (this.markerState === MarkerState.Flagged) {
      this.markerState = useGuessing ? MarkerState.Guessed : MarkerState.None;
    } else if (this.markerState === MarkerState.Guessed) {
      this.markerState = MarkerState.None;
    }
    return this.markerState === MarkerState.Flagged;
  }

  open(): void {
    this.visualState = VisualState.Open;
  }

  flag(): void {
    this.markerState = MarkerState.Flagged;
  }

  setisMine(): void {
    this._value = -1;
  }
}

export { Cell };
