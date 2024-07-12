import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Board as BoardModel } from "../models/Board";
import Board from "./Board";
import NewGameButton from "./GameButton";

// GlobalStyle component to define the font-face
const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'MINE-SWEEPER';
        src: url('/fonts/mine-sweeper.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
    }
`;

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
  const [isFacePressed, setIsFacePressed] = useState(false);
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

  const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    handleClick(x, y, !leftClickIsPrimary);
  };

  const toggleClickPreference = () => {
    setLeftClickIsPrimary(!leftClickIsPrimary);
  };

  const startNewGame = () => {
    setBoard(BoardModel.fromRandomSeed(42, 10, 10, 10));
  };

  const handleMouseDown = () => {
    setIsFacePressed(true);
  };

  const handleMouseUp = () => {
    setIsFacePressed(false);
  };

  return (
    <>
      <GlobalStyle />
      <GameContainer onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <Header>
          <Counter>000</Counter>
          <NewGameButton onClick={startNewGame} isFacePressed={isFacePressed} />
          <Counter>000</Counter>
        </Header>
        <Board
          board={board}
          onClick={handleClick}
          onContextMenu={handleRightClick}
        />
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
