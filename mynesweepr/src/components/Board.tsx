import React from "react";
import styled from "styled-components";
import Cell from "./Cell";
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
  return (
    <GameBoard>
      {Array.from({ length: board.height }).map((_, rowIndex) => (
        <Row key={rowIndex}>
          {Array.from({ length: board.width }).map((_, colIndex) => {
            const cell = board.getCell(colIndex, rowIndex);
            return (
              <Cell
                key={rowIndex * board.width + colIndex}
                cell={cell}
                onClick={() => onClick(colIndex, rowIndex, true)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onClick(colIndex, rowIndex, false);
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
