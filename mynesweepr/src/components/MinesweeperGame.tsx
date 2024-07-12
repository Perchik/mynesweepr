import React, { useState } from "react";
import { Board } from "../models/Board";
import styled from "styled-components";

const GameContainer = styled.div`
  display: inline-block;
  border: 1px solid #000;
  margin-top: 20px;
`;

const Row = styled.div`
  display: flex;
`;

const CellContainer = styled.div<{ cell: string }>`
  width: 30px;
  height: 30px;
  border: 1px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ cell }) => {
    switch (cell) {
      case "0":
        return "#ddd";
      case "1":
        return "#ccc";
      case "2":
        return "#bbb";
      case "3":
        return "#aaa";
      case "4":
        return "#999";
      case "5":
        return "#888";
      case "6":
        return "#777";
      case "7":
        return "#666";
      case "8":
        return "#555";
      case "F":
        return "#f00";
      default:
        return "#ddd";
    }
  }};
  color: ${({ cell }) => (cell === "F" ? "#fff" : "#000")};
`;

const MinesweeperGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(
    Board.fromRandomSeed(42, 10, 10, 10)
  );

  const handleCellClick = (x: number, y: number) => {
    const newBoard = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );
    newBoard.openCell(x, y);
    setBoard(newBoard);
  };

  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    const newBoard = Object.assign(
      Object.create(Object.getPrototypeOf(board)),
      board
    );
    newBoard.flagCell(x, y);
    setBoard(newBoard);
  };

  return (
    <GameContainer>
      {board
        .toString()
        .split("\n")
        .map((row, rowIndex) => (
          <Row key={rowIndex}>
            {row.split(" ").map((cell, colIndex) => (
              <CellContainer
                key={colIndex}
                cell={cell}
                onClick={() => handleCellClick(colIndex, rowIndex)}
                onContextMenu={(e) => handleRightClick(e, colIndex, rowIndex)}
              >
                {cell !== "c" && cell}
              </CellContainer>
            ))}
          </Row>
        ))}
    </GameContainer>
  );
};

export default MinesweeperGame;
