import { VisualState, MarkerState } from "./CellStates";

class Cell {
  value: number;
  position: { x: number; y: number };
  visualState: VisualState;
  markerState: MarkerState;
  neighbors: Cell[] = [];

  constructor(value: number, position: { x: number; y: number }) {
    this.value = value;
    this.position = position;
    this.visualState = VisualState.Closed;
    this.markerState = MarkerState.None;
  }

  setValue(value: number): void {
    this.value = value;
  }

  setNeighbors(neighbors: Cell[]): void {
    this.neighbors = neighbors;
  }

  forEachNeighbor(callback: (neighbor: Cell) => void): void {
    this.neighbors.forEach(callback);
  }

  maybeOpen(): boolean {
    if (this.isMarked() || this.isOpen()) return false;

    this.visualState = VisualState.Open;
    if (this.isMine()) {
      this.markerState = MarkerState.Mine;
    }
    return true;
  }

  isOpen(): boolean {
    return this.visualState === VisualState.Open;
  }

  isMine(): boolean {
    return this.value === -1;
  }

  isEmpty(): boolean {
    return this.value === 0;
  }

  isMarked(): boolean {
    return (
      this.markerState === MarkerState.Flagged ||
      this.markerState === MarkerState.Guessed
    );
  }

  toggleFlag(useGuessing = false): void {
    if (this.markerState === MarkerState.None) {
      this.markerState = MarkerState.Flagged;
    } else if (this.markerState === MarkerState.Flagged) {
      this.markerState = useGuessing ? MarkerState.Guessed : MarkerState.None;
    } else if (this.markerState === MarkerState.Guessed) {
      this.markerState = MarkerState.None;
    }
  }

  open(): void {
    this.visualState = VisualState.Open;
  }

  flag(): void {
    this.markerState = MarkerState.Flagged;
  }
}

export { Cell };
