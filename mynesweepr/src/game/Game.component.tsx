import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BoardComponent from "../board/Board.component";
import GameButton from "./GameButton";
import { useGameContext } from "../context/GameContext";
import DigitalCounter from "../components/DigitalCounter";
import { useSettingsContext } from "../context/SettingsContext";

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

const Game: React.FC = () => {
  const {
    game,
    startNewGame,
    gameState,
    elapsedTime,
    flags,
    handleLeftClick,
    handleCellRightClick,
  } = useGameContext();
  const { settings } = useSettingsContext();
  const [gameButtonState, setGameButtonState] = useState<string>("none");

  useEffect(() => {
    if (game.gameOver) {
      setGameButtonState(game.gameState === "win" ? "win" : "lose");
    }
  }, [game.gameState, game.gameOver]);

  const handleMouseDown = () => {
    setGameButtonState("mousedown");
  };

  const handleMouseUp = () => {
    setGameButtonState(game.gameState);
  };

  return (
    <>
      <GameContainer onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <Header>
          <DigitalCounter value={game.mines - flags} />
          <GameButton />
          <DigitalCounter value={elapsedTime} />
        </Header>
        <BoardComponent
          board={game.board}
          onClick={(x, y) => handleLeftClick(x, y)}
          onCellRightClick={(x, y, e) => handleCellRightClick(x, y, e)}
        />
      </GameContainer>
    </>
  );
};

export default Game;
