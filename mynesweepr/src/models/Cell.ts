import { VisualState, MarkerState } from "./CellStates";

export class Cell {
  value: number;
  coords: [number, number];
  visualState: VisualState;
  markerState: MarkerState;
  neighbors: Cell[] = [];

  constructor(value: number, coords: [number, number]) {
    this.value = value;
    this.coords = coords;
    this.visualState = VisualState.Closed;
    this.markerState = MarkerState.None;
  }

  setNeighbors(neighbors: Cell[]): void {
    this.neighbors = neighbors;
  }

  forEachNeighbor(callback: (neighbor: Cell) => void): void {
    this.neighbors.forEach(callback);
  }
}
