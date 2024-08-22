import { Board } from "../board/Board.model";
import { MarkerState } from "../cell/Cell.model";
import { Position } from "../utils/Position";

export type GameState = "inprogress" | "win" | "lose" | "new" | "none";

export class Game {
  board: Board;
  gameState: GameState = "new";
  elapsedTime = 0;

  private _numFlags = 0;
  private _mines: number = 0;
  private openQueue: Position[] = [];

  get gameOver(): boolean {
    return this.gameState === "win" || this.gameState === "lose";
  }

  get mines(): number {
    return this._mines;
  }

  get flags(): number {
    return this._numFlags;
  }

  constructor(width: number, height: number, mines: number, seed?: string) {
    this.board = new Board(width, height, mines, seed);
    this.startNewGame(width, height, mines, seed);
  }

  public startNewGame(
    width: number,
    height: number,
    mines: number,
    seed?: string
  ): void {
    this.board = new Board(width, height, mines, seed);
    this.gameState = "new";
    this._numFlags = 0;
    this._mines = mines;
    this.elapsedTime = 0;
    this.openQueue = [];
  }

  // Overloaded method signatures while we're switchign to Position
  openCell(x: number, y: number): void;
  openCell(position: Position): void;
  openCell(positionOrX: Position | number, y?: number): void {
    const position: Position =
      typeof positionOrX === "object" ? positionOrX : { x: positionOrX, y: y! };

    if (this.gameOver) return;

    const cell = this.board.cell(position);
    if (cell.visualState === "open") {
      this.maybeChordCell(position);
    } else {
      this.openQueue.push(position);
    }
    this.processOpenQueue();
  }
  private processOpenQueue(): void {
    while (this.openQueue.length > 0) {
      const position = this.openQueue.shift()!;
      const cell = this.board.cell(position);

      if (cell.visualState !== "open") {
        const openedCell = cell.open();
        this.board.updateCell(position, openedCell);

        if (openedCell.markerState === "mine") {
          this.maybeEndGame(true);
          break;
        } else if (openedCell.value === 0) {
          this.openUnmarkedNeighbors(position);
        }
      }
    }
    this.maybeEndGame();
  }

  // Overloaded method signatures while we're switching to Position
  flagCell(x: number, y: number, useGuessing?: boolean): void;
  flagCell(position: Position, useGuessing?: boolean): void;
  flagCell(
    positionOrX: Position | number,
    yOrUseGuessing?: number | boolean,
    useGuessing?: boolean
  ): void {
    if (
      typeof positionOrX === "number" &&
      typeof yOrUseGuessing === "boolean"
    ) {
      throw new Error(
        "Invalid arguments: Expected (x: number, y: number) or (position: Position)."
      );
    }

    const { position, useGuessing: resolvedUseGuessing } =
      typeof positionOrX === "object"
        ? { position: positionOrX, useGuessing: useGuessing ?? false }
        : {
            position: { x: positionOrX, y: yOrUseGuessing as number },
            useGuessing: useGuessing ?? false,
          };

    if (this.gameOver) return;

    const cell = this.board.cell(position);
    if (cell.visualState === "open") {
      this.maybeFlagChordCell(position);
    } else {
      const flaggedCell = cell.toggleFlag(resolvedUseGuessing);
      this.board.updateCell(position, flaggedCell);

      if (flaggedCell.markerState === "flagged") this._numFlags++;
      else this._numFlags--;
    }
  }

  clone(): Game {
    const clonedGame = new Game(
      this.board.width,
      this.board.height,
      this._mines
    );
    clonedGame.board = this.board.clone();
    clonedGame.gameState = this.gameState;
    clonedGame._numFlags = this._numFlags;
    clonedGame.elapsedTime = this.elapsedTime;
    clonedGame.openQueue = [...this.openQueue];
    return clonedGame;
  }

  private maybeEndGame(exploded: boolean = false): void {
    if (exploded) {
      this.gameState = "lose";
      this.revealAllMines();
    } else if (this.board.unopenedCells.length === this.mines) {
      this.gameState = "win";
    }
  }

  private maybeChordCell(position: Position): void {
    const cell = this.board.cell(position);
    const neighbors = this.board.getNeighbors(position);
    const flaggedNeighbors = neighbors.filter(
      (neighbor) => neighbor.markerState === "flagged"
    );

    if (flaggedNeighbors.length === cell.value) {
      neighbors.forEach((neighbor) => {
        if (
          neighbor.visualState !== "open" &&
          neighbor.markerState !== "flagged"
        ) {
          this.openQueue.push(neighbor.position);
        }
      });
    }
    this.processOpenQueue();
  }

  private maybeFlagChordCell(position: Position): void {
    const cell = this.board.cell(position);
    const neighbors = this.board.getNeighbors(position);
    const closedNeighbors = neighbors.filter(
      (neighbor) => neighbor.visualState !== "open"
    );
    if (closedNeighbors.length !== cell.value) return;

    closedNeighbors.forEach((neighbor) => {
      if (neighbor.markerState !== "flagged") {
        this.flagCell(neighbor.position);
      }
    });
  }

  private revealAllMines(): void {
    this.board.mineCells.forEach((cell) => {
      const openedCell = cell.open();
      this.board.updateCell(cell.position, openedCell);
    });
  }

  private openUnmarkedNeighbors(position: Position): void {
    this.board.getNeighbors(position).forEach((neighbor) => {
      this.openQueue.push(neighbor.position);
    });

    this.processOpenQueue();
  }
}
