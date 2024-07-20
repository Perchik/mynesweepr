import { produce, immerable, Draft } from "immer";
import { VisualState, MarkerState } from "./CellStates";

class Cell {
  static [immerable] = true;
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

  setValue = (value: number): Cell => {
    return produce(this, (draft: Draft<Cell>) => {
      draft.value = value;
    });
  };

  setNeighbors = (neighbors: Cell[]): Cell => {
    return produce(this, (draft: Draft<Cell>) => {
      draft.neighbors = neighbors;
    });
  };

  forEachNeighbor(callback: (neighbor: Cell) => void): void {
    this.neighbors.forEach(callback);
  }

  maybeOpen = (): Cell => {
    return produce(this, (draft: Draft<Cell>) => {
      if (draft.isMarked() || draft.isOpen()) return;

      draft.visualState = VisualState.Open;
      if (draft.isMine()) {
        draft.markerState = MarkerState.Mine;
      }
    });
  };

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

  toggleFlag = (useGuessing = false): Cell => {
    return produce(this, (draft: Draft<Cell>) => {
      if (draft.markerState === MarkerState.None) {
        draft.markerState = MarkerState.Flagged;
      } else if (draft.markerState === MarkerState.Flagged) {
        draft.markerState = useGuessing
          ? MarkerState.Guessed
          : MarkerState.None;
      } else if (draft.markerState === MarkerState.Guessed) {
        draft.markerState = MarkerState.None;
      }
    });
  };

  open = (): Cell => {
    return produce(this, (draft: Draft<Cell>) => {
      draft.visualState = VisualState.Open;
    });
  };

  flag = (): Cell => {
    return produce(this, (draft: Draft<Cell>) => {
      draft.markerState = MarkerState.Flagged;
    });
  };
}

export { Cell };
