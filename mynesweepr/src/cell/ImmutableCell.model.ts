import { Position } from "../utils/Position";

export type VisualState = "open" | "closed" | "reducedOpen";

export type MarkerState =
  | "none"
  | "flagged"
  | "hiddenFlag"
  | "guessed"
  | "mine";

interface ImmutableCellProps {
  value: number;
  position: Position;
  visualState?: VisualState;
  markerState?: MarkerState;
  isExploded?: boolean;
  reducedValueMemo?: number | null;
}

class ImmutableCell {
  private readonly _value: number;
  private readonly _reducedValueMemo: number | null;
  private readonly _position: Position;
  private readonly _visualState: VisualState;
  private readonly _markerState: MarkerState;
  private readonly _isExploded: boolean;

  constructor({
    value,
    position,
    visualState = "closed",
    markerState = "none",
    isExploded = false,
    reducedValueMemo = null,
  }: ImmutableCellProps) {
    this._value = value;
    this._reducedValueMemo = reducedValueMemo;
    this._position = position;
    this._visualState = visualState;
    this._markerState = markerState;
    this._isExploded = isExploded;
  }

  get value(): number {
    return this._value;
  }

  get reducedValue(): number {
    if (this._reducedValueMemo === null) {
      return this.computeReducedValue();
    }
    return this._reducedValueMemo;
  }

  get isMine(): boolean {
    return this._value === -1;
  }

  get isOpen(): boolean {
    return this._visualState === "open";
  }

  get isEmpty(): boolean {
    return this._value === 0;
  }

  get isMarked(): boolean {
    return this._markerState === "flagged" || this._markerState === "guessed";
  }

  get isFlagged(): boolean {
    return (
      this._markerState === "flagged" || this._markerState === "hiddenFlag"
    );
  }

  get position(): Position {
    return this._position;
  }

  get visualState(): VisualState {
    return this._visualState;
  }

  get markerState(): MarkerState {
    return this._markerState;
  }

  get isExploded(): boolean {
    return this._isExploded;
  }

  open(): ImmutableCell {
    return new ImmutableCell({
      value: this._value,
      position: this._position,
      visualState: "open",
      markerState: this._markerState,
      isExploded: this._isExploded,
      reducedValueMemo: this._reducedValueMemo,
    });
  }

  flag(): ImmutableCell {
    return new ImmutableCell({
      value: this._value,
      position: this._position,
      visualState: this._visualState,
      markerState: "flagged",
      isExploded: this._isExploded,
      reducedValueMemo: this._reducedValueMemo,
    });
  }

  explode(): ImmutableCell {
    return new ImmutableCell({
      value: this._value,
      position: this._position,
      visualState: this._visualState,
      markerState: this._markerState,
      isExploded: true,
      reducedValueMemo: this._reducedValueMemo,
    });
  }

  setMine(): ImmutableCell {
    return new ImmutableCell({
      value: -1,
      position: this._position,
      visualState: this._visualState,
      markerState: this._markerState,
      isExploded: this._isExploded,
      reducedValueMemo: this._reducedValueMemo,
    });
  }

  incrementValue(): ImmutableCell {
    return new ImmutableCell({
      value: this._value + 1,
      position: this._position,
      visualState: this._visualState,
      markerState: this._markerState,
      isExploded: this._isExploded,
      reducedValueMemo: this._reducedValueMemo,
    });
  }

  // Only opens the cel lif it's not marked (flag or question) or already open.
  maybeOpen(): ImmutableCell | null {
    if (this.isMarked || this.isOpen) return null;

    const newMarkerState = this.isMine ? "mine" : this._markerState;
    return new ImmutableCell({
      value: this._value,
      position: this._position,
      visualState: "open",
      markerState: newMarkerState,
      isExploded: this._isExploded,
      reducedValueMemo: this._reducedValueMemo,
    });
  }

  toggleFlag(useGuessing = false): ImmutableCell {
    let newMarkerState: MarkerState;
    if (this._markerState === "none") {
      newMarkerState = "flagged";
    } else if (this._markerState === "flagged") {
      newMarkerState = useGuessing ? "guessed" : "none";
    } else if (this._markerState === "guessed") {
      newMarkerState = "none";
    } else {
      newMarkerState = this._markerState;
    }
    return new ImmutableCell({
      value: this._value,
      position: this._position,
      visualState: this._visualState,
      markerState: newMarkerState,
      isExploded: this._isExploded,
      reducedValueMemo: this._reducedValueMemo,
    });
  }

  computeReducedValue(): number {
    // Assuming `neighbors` is somehow accessible, perhaps passed in via constructor or method.
    let reducedValue = this._value;

    // this.forEachNeighbor((neighbor) => {
    //   if (neighbor.isFlagged) {
    //     reducedValue--;
    //   }
    // });

    return reducedValue;
  }

  updateReducedValue(): ImmutableCell {
    return new ImmutableCell({
      value: this._value,
      position: this._position,
      visualState: this._visualState,
      markerState: this._markerState,
      isExploded: this._isExploded,
      reducedValueMemo: this.computeReducedValue(),
    });
  }

  enterReducedMode(): ImmutableCell {
    const newMarkerState = this.isFlagged ? "hiddenFlag" : this._markerState;
    const newVisualState = this.isFlagged ? "reducedOpen" : this._visualState;
    return new ImmutableCell({
      value: this._value,
      position: this._position,
      visualState: newVisualState,
      markerState: newMarkerState,
      isExploded: this._isExploded,
      reducedValueMemo: this._reducedValueMemo,
    });
  }

  exitReducedMode(): ImmutableCell {
    const newMarkerState =
      this._markerState === "hiddenFlag" ? "flagged" : this._markerState;
    const newVisualState =
      this._visualState === "reducedOpen" ? "closed" : this._visualState;
    return new ImmutableCell({
      value: this._value,
      position: this._position,
      visualState: newVisualState,
      markerState: newMarkerState,
      isExploded: this._isExploded,
      reducedValueMemo: this._reducedValueMemo,
    });
  }
}

export { ImmutableCell };
