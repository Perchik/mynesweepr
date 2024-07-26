import { Board } from "../board/Board.model";
import { MarkerState } from "../cell/Cell.model";

export const createReducedBoard = (board: Board): Board => {
  const reducedBoard = board.clone();

  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      const cell = board.cell(x, y);
      if (cell.markerState === MarkerState.Flagged) {
        cell.neighbors.forEach((neighbor) => {
          if (!neighbor.isMine && neighbor.value > 0) {
            neighbor.decrementValue(); // update this.
          }
        });
      }
    }
  }

  return reducedBoard;
};
