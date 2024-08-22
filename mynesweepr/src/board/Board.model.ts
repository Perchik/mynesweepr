import seedrandom from "seedrandom";
import { Cell } from "../cell/Cell.model";
import { Position } from "../utils/Position";
import { NeighborLookup } from "../utils/NeighborLookup";
import { getRandomCoordinates } from "../utils/RNG";

export class Board {
  private _cells: Cell[][];
  private _mines: number;
  private _mineCoords: Position[];
  private _neighborLookup: NeighborLookup;

  constructor(width: number, height: number, mines: number, seed?: string) {
    this._neighborLookup = new NeighborLookup(width, height);
    this._cells = this.createEmptyBoard(width, height);

    this._mineCoords = getRandomCoordinates(width, height, mines, seed);
    this.placeMines(mines, seed);
    this._mines = mines;
  }

  get cells(): Cell[][] {
    return this._cells;
  }

  get cell() {
    return (position: Position) => this._cells[position.y][position.x];
  }

  get width(): number {
    return this._cells[0].length;
  }

  get height(): number {
    return this._cells.length;
  }

  get unopenedCells(): Cell[] {
    return this._cells.flat().filter((cell) => cell.visualState !== "open");
  }

  get mineCells(): Cell[] {
    return this._cells.flat().filter((cell) => cell.markerState === "mine");
  }

  get numMines(): number {
    return this._mines;
  }

  clone(): Board {
    const clonedBoard = new Board(this.width, this.height, this._mines);
    clonedBoard._cells = this._cells.map((row) =>
      row.map((cell) => new Cell({ ...cell }))
    );
    return clonedBoard;
  }

  private createEmptyBoard(width: number, height: number): Cell[][] {
    const cells = Array.from({ length: height }, (_, y) =>
      Array.from(
        { length: width },
        (_, x) =>
          new Cell({
            value: 0,
            position: { x, y },
          })
      )
    );
    return cells;
  }

  private initializeCellNeighbors(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const position: Position = { x, y };
        const neighbors = this.getNeighbors(position);
        // No need to set neighbors directly, but this might be useful if
        // you decide to store neighbor references.
      }
    }
  }

  private placeMines(mines: number, seed?: string): void {
    const rng = seedrandom(seed);
    let placedMines = 0;
    while (placedMines < mines) {
      const position: Position = {
        x: Math.floor(rng() * this.width),
        y: Math.floor(rng() * this.height),
      };
      if (this.cell(position).markerState !== "mine") {
        this.placeMine(position);
        placedMines++;
      }
    }
  }

  private placeMine(position: Position): void {
    // Update the cell to become a mine
    this._cells[position.y][position.x] = new Cell({
      ...this.cell(position),
      value: -1,
      markerState: "mine",
    });

    // Update the neighbor counts
    this.getNeighbors(position).forEach((neighbor) => {
      if (neighbor.value !== -1) {
        const { x, y } = neighbor.position;
        this._cells[y][x] = new Cell({
          ...neighbor,
          value: neighbor.value + 1,
        });
      }
    });
  }

  public getNeighbors(position: Position): Cell[] {
    const neighborPositions = this._neighborLookup.getNeighbors(position);
    return neighborPositions.map((neighborPos) => this.cell(neighborPos));
  }

  public updateCell(position: Position, updatedCell: Cell): void {
    this._cells[position.y][position.x] = updatedCell;
  }
}
