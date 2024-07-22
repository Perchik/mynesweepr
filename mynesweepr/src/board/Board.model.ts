import seedrandom from "seedrandom";
import { Cell } from "../cell/Cell.model";

export class Board {
  private _cells: Cell[][];
  private _mines: number;

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
    return this._cells.flat().filter((cell) => !cell.isOpen());
  }

  get mineCells(): Cell[] {
    return this._cells.flat().filter((cell) => cell.isMine());
  }

  get numMines(): number {
    return this._mines;
  }

  constructor(width: number, height: number, mines: number, seed?: string) {
    this._cells = this.createEmptyBoard(width, height);
    this.initializeCellNeighbors();
    this.placeMines(mines, seed);
    this._mines = mines;
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
      if (!this.cell(x, y).isMine()) {
        this.placeMine(x, y);
        placedMines++;
      }
    }
  }

  private placeMine(x: number, y: number): void {
    this.cell(x, y).setValue(-1);
    this.cell(x, y).forEachNeighbor((neighbor) => {
      // Update the count of non-mine neighbors
      if (!neighbor.isMine()) {
        neighbor.setValue(neighbor.value + 1);
      }
    });
  }

  getNeighbors(x: number, y: number): Cell[] {
    // prettier-ignore
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    const neighbors: Cell[] = [];
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < this.width && ny < this.height) {
        neighbors.push(this._cells[ny][nx]);
      }
    }
    return neighbors;
  }
}
