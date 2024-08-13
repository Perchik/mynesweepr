import seedrandom from "seedrandom";
import { Cell } from "../cell/Cell.model";
import { ImmutableCell } from "../cell/ImmutableCell.model";
import { Position } from "../utils/Position";
import { NeighborLookup } from "../utils/NeighborLookup";
import { generateCoordinates } from "../utils/RNG";
export class Board {
  private _cells: Cell[][];
  private _mines: number;

  private _mineCoords: Set<Position> = new Set<Position>();
  private _iCells: ImmutableCell[][];

  private _neighborLookup: NeighborLookup;

  constructor(width: number, height: number, mines: number, seed?: string) {
    this._neighborLookup = new NeighborLookup(width, height);
    this._iCells = this.createBoard(width, height);

    this._mineCoords = generateCoordinates(width, height, mines, seed);
    // this._cells = this.createEmptyBoard(width, height);
    // this.initializeCellNeighbors();
    // this.placeMines(mines, seed);
    // this._mines = mines;
  }

  get cells(): Cell[][] {
    return this._cells;
  }

  get cell() {
    return (x: number, y: number) => this._cells[y][x];
  }

  get width(): number {
    return this._cells[0].length;
  }

  get height(): number {
    return this._cells.length;
  }

  get unopenedCells(): Cell[] {
    return this._cells.flat().filter((cell) => !cell.isOpen);
  }

  get mineCells(): Cell[] {
    return this._cells.flat().filter((cell) => cell.isMine);
  }

  get numMines(): number {
    return this._mines;
  }

  clone(): Board {
    const clonedBoard = new Board(this.width, this.height, this._mines);
    clonedBoard._cells = this.cells;
    return clonedBoard;
  }

  private createEmptyBoard(width: number, height: number): Cell[][] {
    const cells = Array.from({ length: height }, (_, y) =>
      Array.from({ length: width }, (_, x) => new Cell(0, { x, y }))
    );
    return cells;
  }

  private initializeCellNeighbors(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const neighbors = this.getNeighbors(x, y);
        this.cell(x, y).setNeighbors(neighbors);
      }
    }
  }

  private placeMines(mines: number, seed?: string): void {
    const rng = seedrandom(seed);

    let placedMines = 0;
    while (placedMines < mines) {
      const x = Math.floor(rng() * this.width);
      const y = Math.floor(rng() * this.height);
      if (!this.cell(x, y).isMine) {
        this.placeMine(x, y);
        placedMines++;
      }
    }
  }

  private placeMine(x: number, y: number): void {
    this.cell(x, y).setisMine();
    this.cell(x, y).forEachNeighbor((neighbor) => {
      // Update the count of non-mine neighbors
      if (!neighbor.isMine) {
        neighbor.incrementValue();
      }
    });
  }
}
