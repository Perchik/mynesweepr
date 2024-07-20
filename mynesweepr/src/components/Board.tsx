import React from "react";
import styled from "styled-components";
import Cell from "../cell/Cell.component";
import { Board as BoardModel } from "../models/Board";

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
  console.log("Board component re-render");

  return (
    <GameBoard>
      {Array.from({ length: board.height }).map((_, rowIndex) => (
        <Row key={rowIndex}>
          {Array.from({ length: board.width }).map((_, colIndex) => {
            const cell = board.cell(rowIndex, colIndex);
            return (
              <Cell
                key={rowIndex * board.width + colIndex}
                cell={cell}
                onClick={() => onClick(rowIndex, colIndex, true)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onClick(rowIndex, colIndex, false);
                }}
              />
            );
          })}
        </Row>
      ))}
    </GameBoard>
  );
};

export default Board;
