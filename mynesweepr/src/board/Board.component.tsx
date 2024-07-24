import React from "react";
import styled from "styled-components";
import Cell from "../cell/Cell.component";
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
  onClick: (x: number, y: number) => void;
  onCellRightClick: (x: number, y: number, e: React.MouseEvent) => void;
}

const Board: React.FC<BoardProps> = ({ board, onClick, onCellRightClick }) => {
  return (
    <GameBoard>
      {board.cells.map((row, y) => (
        <Row key={y}>
          {row.map((cell, x) => (
            <Cell
              key={x}
              cell={cell}
              onClick={() => onClick(x, y)}
              onContextMenu={(e) => onCellRightClick(x, y, e)}
            />
          ))}
        </Row>
      ))}
    </GameBoard>
  );
};

export default Board;
