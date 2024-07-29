export type VisualState = "open" | "closed" | "reducedOpen";

export type MarkerState =
  | "none"
  | "flagged"
  | "hiddenFlag"
  | "guessed"
  | "mine";

class Cell {
  private _value: number = 0;
  private _reducedValueMemo: number | null = null;

  position: { x: number; y: number } = { x: -1, y: -1 };
  visualState: VisualState = "closed";
  markerState: MarkerState = "none";
  neighbors: Cell[] = [];
  isExploded: boolean = false;

  constructor(value: number, position: { x: number; y: number }) {
    this.resetCell(value, position);
  }

  resetCell(value: number, position: { x: number; y: number }) {
    this._value = value;
    this._reducedValueMemo = null;
    this.position = position;
    this.visualState = "closed";
    this.markerState = "none";
    this.isExploded = false;
  }

  get value(): number {
    return this._value;
  }

  get reducedValue(): number {
    if (this._reducedValueMemo === null) {
      this._reducedValueMemo = this.computeReducedValue();
    }
    return this._reducedValueMemo;
  }

  get isMine(): boolean {
    return this._value === -1;
  }

  get isOpen(): boolean {
    return this.visualState === "open";
  }

  get isEmpty(): boolean {
    return this._value === 0;
  }

  get isMarked(): boolean {
    return this.markerState === "flagged" || this.markerState === "guessed";
  }

  get isFlagged(): boolean {
    return this.markerState === "flagged" || this.markerState === "hiddenFlag";
  }

  open(): void {
    this.visualState = "open";
  }

  flag(): void {
    this.markerState = "flagged";
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

    this.visualState = "open";
    if (this.isMine) {
      this.markerState = "mine";
    }
    return true;
  }

  toggleFlag(useGuessing = false): boolean {
    if (this.markerState === "none") {
      this.markerState = "flagged";
    } else if (this.markerState === "flagged") {
      this.markerState = useGuessing ? "guessed" : "none";
    } else if (this.markerState === "guessed") {
      this.markerState = "none";
    }
    return this.markerState === "flagged";
  }

  computeReducedValue(): number {
    let reducedValue = this._value;

    this.forEachNeighbor((neighbor) => {
      if (neighbor.isFlagged) {
        reducedValue--;
      }
    });

    return reducedValue;
  }

  updateReducedValue(): void {
    this._reducedValueMemo = this.computeReducedValue();
  }

  enterReducedMode(): void {
    if (this.isFlagged) {
      this.markerState = "hiddenFlag";
      this.visualState = "reducedOpen";
    }
  }

  exitReducedMode(): void {
    if (this.visualState === "reducedOpen") this.visualState = "closed";
    if (this.markerState === "hiddenFlag") this.markerState = "flagged";
  }
}

export { Cell };
