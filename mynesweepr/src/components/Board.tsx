import React from "react";
import styled from "styled-components";
import { Board as BoardModel } from "../models/Board";
import Cell from "./Cell";

// Styled components
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
  onContextMenu: (e: React.MouseEvent, x: number, y: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onClick, onContextMenu }) => {
  return (
    <GameBoard>
      {Array.from({ length: board.height }).map((_, rowIndex) => (
        <Row key={rowIndex}>
          {Array.from({ length: board.width }).map((_, colIndex) => {
            const cell = board.getCell(colIndex, rowIndex);
            return (
              <Cell
                key={colIndex}
                cell={cell}
                onClick={onClick}
                onContextMenu={onContextMenu}
              />
            );
          })}
        </Row>
      ))}
    </GameBoard>
  );
};

export default Board;
