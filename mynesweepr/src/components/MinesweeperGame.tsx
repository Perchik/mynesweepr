import React, { useState, useEffect, useRef } from "react";
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
  border-color: #808080 #fff #fff #808080;
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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [seed, setSeed] = useState<string>("");
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (board.gameOver) {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    }
  }, [board.gameOver]);

  const startTimer = () => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      setElapsedTime(0);
      timerRef.current = window.setInterval(() => {
        setElapsedTime((prevElapsedTime) => {
          const newElapsedTime = Math.floor(
            (Date.now() - startTimeRef.current!) / 1000
          );
          if (newElapsedTime >= 999) {
            clearInterval(timerRef.current!);
            return 999;
          }
          return newElapsedTime;
        });
      }, 1000);
    }
  };

  const handleClick = (x: number, y: number, primary: boolean) => {
    startTimer();
    setClickedCoords([x, y]);
    if (primary) {
      board.openCell(x, y);
    } else {
      board.flagCell(x, y);
    }
  };

  const startNewGame = (seedValue?: string) => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    const newSeed = seedValue || Math.floor(Math.random() * 10000).toString();
    setSeed(newSeed);
    startTimeRef.current = null;
    setElapsedTime(0);
    setBoard(BoardModel.fromRandomSeed(parseInt(newSeed), 10, 10, 10));
  };

  const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value);
  };

  const handleSeedSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startNewGame(seed);
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
          <GameButton
            onClick={() => startNewGame()}
            isMouseButtonDown={isMouseDown}
          />
          <DigitalCounter value={elapsedTime} />
        </Header>
        <Board board={board} onClick={handleClick} />
        <form onSubmit={handleSeedSubmit}>
          <input
            type="text"
            value={seed}
            onChange={handleSeedChange}
            placeholder="Enter seed"
          />
          <button type="submit">Set Seed</button>
        </form>
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
