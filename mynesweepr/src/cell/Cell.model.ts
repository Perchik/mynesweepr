import { Position } from "../utils/Position";

export type VisualState = "open" | "closed" | "reducedOpen";
export type MarkerState =
  | "none"
  | "flagged"
  | "hiddenFlag"
  | "guessed"
  | "mine";

interface CellProps {
  readonly value: number;
  readonly position: Position;
  readonly visualState?: VisualState;
  readonly markerState?: MarkerState;
  readonly isExploded?: boolean;
}

class Cell {
  public readonly value: number;
  public readonly position: Position;
  public readonly visualState: VisualState;
  public readonly markerState: MarkerState;
  public readonly isExploded: boolean;

  constructor({
    value,
    position,
    visualState = "closed",
    markerState = "none",
    isExploded = false,
  }: CellProps) {
    this.value = value;
    this.position = position;
    this.visualState = visualState;
    this.markerState = markerState;
    this.isExploded = isExploded;
  }

  open(): Cell {
    return new Cell({ ...this, visualState: "open" });
  }

  flag(): Cell {
    return new Cell({ ...this, markerState: "flagged" });
  }

  explode(): Cell {
    return new Cell({ ...this, isExploded: true });
  }

  toggleFlag(useGuessing = false): Cell {
    let newMarkerState: MarkerState;

    if (this.markerState === "none") {
      newMarkerState = "flagged";
    } else if (this.markerState === "flagged") {
      newMarkerState = useGuessing ? "guessed" : "none";
    } else if (this.markerState === "guessed") {
      newMarkerState = "none";
    } else {
      newMarkerState = this.markerState;
    }

    return new Cell({ ...this, markerState: newMarkerState });
  }

  enterReducedMode(): Cell {
    return new Cell({
      ...this,
      markerState:
        this.markerState === "flagged" ? "hiddenFlag" : this.markerState,
      visualState:
        this.markerState === "flagged" ? "reducedOpen" : this.visualState,
    });
  }

  exitReducedMode(): Cell {
    return new Cell({
      ...this,
      markerState:
        this.markerState === "hiddenFlag" ? "flagged" : this.markerState,
      visualState:
        this.visualState === "reducedOpen" ? "closed" : this.visualState,
    });
  }
}

export { Cell };
