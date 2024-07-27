export enum VisualState {
  Open,
  Closed,
  Pressed,
}

export enum MarkerState {
  None,
  Flagged,
  Guessed,
  Mine,
}

class Cell {
  private _value: number = 0;
  private _reducedValue: number = 0;

  position: { x: number; y: number } = { x: -1, y: -1 };
  visualState: VisualState = VisualState.Closed;
  markerState: MarkerState = MarkerState.None;
  neighbors: Cell[] = [];
  isExploded: boolean = false;

  constructor(value: number, position: { x: number; y: number }) {
    this.resetCell(value, position);
  }

  resetCell(value: number, position: { x: number; y: number }) {
    this._value = value;
    this._reducedValue = value;
    this.position = position;
    this.visualState = VisualState.Closed;
    this.markerState = MarkerState.None;
    this.isExploded = false;
  }

  get value(): number {
    return this._value;
  }

  get reducedValue(): number {
    return this._reducedValue;
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

  get isFlagged(): boolean {
    return this.markerState === MarkerState.Flagged;
  }

  open(): void {
    this.visualState = VisualState.Open;
  }

  flag(): void {
    this.markerState = MarkerState.Flagged;
  }

  explode(): void {
    this.isExploded = true;
  }

  setisMine(): void {
    this._value = -1;
  }

  incrementValue() {
    this._value++;
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

  updateReducedValue(): void {
    this._reducedValue = this._value;
    this.forEachNeighbor((neighbor) => {
      if (neighbor.isFlagged) {
        this._reducedValue--;
      }
    });
  }
}

export { Cell };
