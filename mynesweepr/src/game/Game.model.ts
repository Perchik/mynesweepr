import { Board } from "../board/Board.model";
import { VisualState, MarkerState } from "../cell/Cell.model";

export type GameState = "inprogress" | "win" | "lose" | "new" | "none";

export class Game {
  board: Board;
  gameState: GameState = "new";
  _numFlags = 0;
  _mines: number = 0;
  _elapsedTime = 0;

  private timerRef: number | null = null;
  private startTime: number | null = null;
  private openQueue: Array<{ x: number; y: number }> = [];

  get gameOver(): boolean {
    return this.gameState === "win" || this.gameState === "lose";
  }

  get mines(): number {
    return this._mines;
  }

  get flags(): number {
    return this._numFlags;
  }

  get elapsedTime(): number {
    return this._elapsedTime;
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
  ) {
    this.board = new Board(width, height, mines, seed);
    this.gameState = "inprogress";
    this._numFlags = 0;
    this._mines = mines;
    this._elapsedTime = 0;
    this.startTime = null;
    if (this.timerRef !== null) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
    this.openQueue = [];
  }

  startTimer(): void {
    this.startTime = Date.now();
    this.timerRef = window.setInterval(() => {
      this._elapsedTime = Math.floor((Date.now() - this.startTime!) / 1000);
      if (this._elapsedTime >= 999) {
        this._elapsedTime = 999;
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    if (this.timerRef !== null) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  openCell(x: number, y: number): void {
    if (this.gameOver) return;
    if (this.startTime === null) {
      this.startTimer();
    }
    const cell = this.board.cell(x, y);
    if (cell.isOpen()) {
      this.maybeChordCell(x, y);
    } else {
      this.openQueue.push({ x, y });
    }
    this.processOpenQueue();
  }

  private processOpenQueue(): void {
    while (this.openQueue.length > 0) {
      const { x, y } = this.openQueue.shift()!;
      const cell = this.board.cell(x, y);

      if (!cell.isOpen()) {
        const opened = cell.maybeOpen();
        if (!opened) return;

        if (cell.isMine()) {
          cell.visualState = VisualState.Exploded;
          this.maybeEndGame(true);
          break;
        } else if (cell.isEmpty()) {
          this.openUnmarkedNeighbors(x, y);
        }
      }
    }
    this.maybeEndGame();
  }

  flagCell(x: number, y: number): void {
    if (this.gameOver) return;

    const cell = this.board.cell(x, y);
    if (cell.isOpen()) this.maybeFlagChordCell(x, y);
    else {
      const hasFlag = cell.toggleFlag();
      if (hasFlag) this._numFlags++;
      else this._numFlags--;
    }
  }

  clone(): Game {
    const clonedGame = new Game(
      this.board.width,
      this.board.height,
      this._mines
    );
    clonedGame.board = this.board;
    clonedGame.gameState = this.gameState;
    clonedGame._numFlags = this._numFlags;
    clonedGame._elapsedTime = this._elapsedTime;
    clonedGame.openQueue = [...this.openQueue];
    return clonedGame;
  }

  private maybeEndGame(exploded: boolean = false): void {
    if (exploded) {
      this.gameState = "lose";
      this.stopTimer();
      this.revealAllMines();
    } else if (this.board.unopenedCells.length === this.mines) {
      this.gameState = "win";
      this.stopTimer();
    }
  }

  private maybeChordCell(x: number, y: number): void {
    const cell = this.board.cell(x, y);
    const neighbors = cell.neighbors;
    const flaggedNeighbors = neighbors.filter(
      (neighbor) => neighbor.markerState === MarkerState.Flagged
    );

    if (flaggedNeighbors.length === cell.value) {
      neighbors.forEach((neighbor) => {
        if (
          !neighbor.isOpen() &&
          neighbor.markerState !== MarkerState.Flagged
        ) {
          this.openQueue.push({
            x: neighbor.position.x,
            y: neighbor.position.y,
          });
        }
      });
    }
    this.processOpenQueue();
  }

  private maybeFlagChordCell(x: number, y: number): void {
    const cell = this.board.cell(x, y);
    const neighbors = cell.neighbors;
    const closedNeighbors = neighbors.filter(
      (neighbor) => neighbor.visualState === VisualState.Closed
    );
    if (closedNeighbors.length !== cell.value) return;

    closedNeighbors.forEach((neighbor) => {
      if (neighbor.markerState !== MarkerState.Flagged) {
        this.flagCell(neighbor.position.x, neighbor.position.y);
      }
    });
  }

  private revealAllMines(): void {
    this.board.mineCells.forEach((cell) => cell.maybeOpen());
  }

  private openUnmarkedNeighbors(x: number, y: number): void {
    this.board.cell(x, y).neighbors.forEach((neighbor) => {
      this.openQueue.push({
        x: neighbor.position.x,
        y: neighbor.position.y,
      });
    });

    this.processOpenQueue();
  }
}
