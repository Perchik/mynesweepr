import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import Board from "../board/Board.component";
import GameButton from "./GameButton";
import { Board as BoardModel } from "../board/Board";
import DigitalCounter from "./DigitalCounter";
import { GameButtonState } from "../models/GameState";
import { Game } from "../models/Game";

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

const useForceUpdate = () => {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
};

const MinesweeperGame: React.FC = () => {
  const [game, setGame] = useState(new Game(9, 9, 10, "42"));
  const [seed, setSeed] = useState<string>("");
  const [gameButtonState, setGameButtonState] =
    useState<GameButtonState>("none");
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (game.gameOver) {
      setGameButtonState(game.gameState === "win" ? "win" : "lose");
    }
  }, [game.gameState, game.gameOver]);

  const handleClick = (x: number, y: number, primary: boolean) => {
    if (primary) {
      game.openCell(x, y);
    } else {
      game.flagCell(x, y);
    }
    forceUpdate();
  };

  const startNewGame = (seedValue?: string) => {
    const newSeed = seedValue || Math.floor(Math.random() * 10000).toString();
    setSeed(newSeed);

    setGame(new Game(9, 9, 10, newSeed));
    setGameButtonState("none");
  };

  const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(event.target.value);
  };

  const handleSeedSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startNewGame(seed);
  };

  const handleMouseDown = () => {
    setGameButtonState("mousedown");
  };

  const handleMouseUp = () => {
    setGameButtonState("none");
  };

  return (
    <>
      <GameContainer onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <Header>
          <DigitalCounter value={game.mines - game.flags} />
          <GameButton
            onClick={() => startNewGame()}
            gameButtonState={gameButtonState}
          />
          <DigitalCounter value={game.elapsedTime} />
        </Header>
        <Board board={game.board} onClick={handleClick} />
      </GameContainer>
      <form onSubmit={handleSeedSubmit}>
        <input
          type="text"
          value={seed}
          onChange={handleSeedChange}
          placeholder="Enter seed"
        />
        <button type="submit">Set Seed</button>
      </form>
    </>
  );
};

export default MinesweeperGame;
