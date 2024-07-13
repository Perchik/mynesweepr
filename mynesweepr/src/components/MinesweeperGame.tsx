import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  RootState,
  AppDispatch,
  startNewGame,
  handleClick,
  setFacePressed,
} from "../redux";
import Board from "./Board";
import NewGameButton from "./GameButton";

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
  const dispatch: AppDispatch = useDispatch();
  const { board, isFacePressed, leftClickIsPrimary, clickedCoords } =
    useSelector((state: RootState) => state.game);

  const handleMouseDown = () => {
    dispatch(setFacePressed(true));
  };

  const handleMouseUp = () => {
    dispatch(setFacePressed(false));
  };

  const onCellClick = (x: number, y: number) => {
    dispatch(handleClick({ x, y, primary: leftClickIsPrimary }));
  };

  const onCellContextMenu = (e: React.MouseEvent, x: number, y: number) => {
    e.preventDefault();
    dispatch(handleClick({ x, y, primary: !leftClickIsPrimary }));
  };

  return (
    <>
      <GameContainer onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        <Header>
          <Counter>000</Counter>
          <NewGameButton
            onClick={() => dispatch(startNewGame())}
            isFacePressed={isFacePressed}
          />
          <Counter>000</Counter>
        </Header>
        <Board
          board={board}
          onClick={onCellClick}
          onContextMenu={onCellContextMenu}
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
