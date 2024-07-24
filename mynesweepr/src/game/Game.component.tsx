import React from "react";
import styled from "styled-components";
import BoardComponent from "../board/Board.component";
import GameButton from "./GameButton";
import { useGameContext } from "../context/GameContext";
import DigitalCounter from "../components/DigitalCounter";

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
    elapsedTime,
    flags,
    handleLeftClick,
    handleCellRightClick,
    handleMouseDown,
    handleMouseUp,
  } = useGameContext();

  return (
    <>
      <GameContainer onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <Header>
          <DigitalCounter value={game.mines - flags} />
          <GameButton />
          <DigitalCounter value={Math.floor(elapsedTime / 1000)} />
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
