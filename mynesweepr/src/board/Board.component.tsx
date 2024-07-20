import React, { useEffect } from "react";
import styled from "styled-components";
import Cell from "../cell/Cell.component";
import useCellStore from "../cell/useCellStore";
import { Board as BoardModel } from "./Board.model";

const GameBoard = styled.div`
  display: inline-block;
  border: 6px solid;
  border-color: #808080 #fff #fff #808080;
  margin-top: 20px;
`;

const Row = styled.div`
  display: flex;
`;

interface BoardProps {
  board: BoardModel;
  onClick: (x: number, y: number, primary: boolean) => void;
}

const Board: React.FC<BoardProps> = ({ board, onClick }) => {
  const { initializeCells } = useCellStore();

  useEffect(() => {
    initializeCells(board.cells);

    // Set neighbors in the store
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        const neighbors = board.getNeighbors(x, y);
        useCellStore.getState().setNeighbors(x, y, neighbors);
      }
    }
  }, [board, initializeCells]);

  const handleClick = (x: number, y: number, primary: boolean) => {
    onClick(x, y, primary);
    if (primary) {
      useCellStore.getState().openCell(x, y);
    } else {
      useCellStore.getState().flagCell(x, y);
    }
  };

  return (
    <GameBoard>
      {Array.from({ length: board.height }).map((_, rowIndex) => (
        <Row key={rowIndex}>
          {Array.from({ length: board.width }).map((_, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              x={colIndex}
              y={rowIndex}
              onClick={() => handleClick(colIndex, rowIndex, true)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleClick(colIndex, rowIndex, false);
              }}
            />
          ))}
        </Row>
      ))}
    </GameBoard>
  );
};

export default Board;
