import React, { useState } from "react";
import styled from "styled-components";
import Board from "./Board";
import GameButton from "./GameButton";
import { Board as BoardModel } from "../models/Board";
import DigitalCounter from "./DigitalCounter";

const GameContainer = styled.div`
  display: inline-block;
  border: 2px solid #999;
  background-color: #bbb;
  padding: 10px;
  border: 6px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 10px #000;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #bbb;
  padding: 5px;
  box-sizing: border-box;
  border: 6px solid;
  border-color: #808080 #fff#fff#808080;
`;

const Counter = styled.div`
  width: 50px;
  height: 30px;
  background-color: #000;
  color: #f00;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #333;
  box-shadow: inset -2px -2px 5px #333, inset 2px 2px 5px #666;
`;

const MinesweeperGame: React.FC = () => {
  const [board, setBoard] = useState<BoardModel>(
    BoardModel.fromRandomSeed(42, 10, 10, 10)
  );
  const [leftClickIsPrimary, setLeftClickIsPrimary] = useState(true); // Default to left-click being primary
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(
    null
  );

  const handleClick = (x: number, y: number, primary: boolean) => {
    setClickedCoords([x, y]);
    if (primary) {
      board.openCell(x, y);
    } else {
      board.flagCell(x, y);
    }
  };

  const startNewGame = () => {
    setBoard(BoardModel.fromRandomSeed(42, 10, 10, 10));
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  return (
    <>
      <GameContainer onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <Header>
          <DigitalCounter value={board.mines - board.flags} />
          <GameButton onClick={startNewGame} isMouseButtonDown={isMouseDown} />
          <DigitalCounter value={999} />{" "}
        </Header>
        <Board board={board} onClick={handleClick} />
      </GameContainer>
      {clickedCoords && (
        <div>
          Last clicked cell: ({clickedCoords[0]}, {clickedCoords[1]})
        </div>
      )}
    </>
  );
};

export default MinesweeperGame;
