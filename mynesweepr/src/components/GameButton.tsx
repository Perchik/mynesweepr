import React from "react";
import styled from "styled-components";
import { GameButtonState } from "../game/GameState";

const ButtonContainer = styled.button`
  align-items: center;
  background-color: #ccc;
  cursor: pointer;
  display: flex;
  font-size: 30px;
  height: 50px;
  justify-content: center;
  line-height: 30px;
  outline: 2px solid #808080;
  user-select: none;
  width: 50px;
  &:active {
    border-color: #808080 #fff #fff #808080;
    font-size: 28px;
    padding-right: 0;
    padding-bottom: 2px;
    align-items: flex-end;
    justify-content: flex-end;
  }
  border: 4px solid #808080;
  border-color: #fff #808080 #808080 #fff;
`;
interface GameButtonProps {
  onClick: () => void;
  gameButtonState: GameButtonState;
}

const getButtonFace = (gameButtonState: GameButtonState): string => {
  switch (gameButtonState) {
    case "mousedown":
      return "😯";
    case "win":
      return "😎";
    case "lose":
      return "😵";
    case "none":
    default:
      return "🙂";
  }
};

const GameButton: React.FC<GameButtonProps> = ({
  onClick,
  gameButtonState,
}) => {
  return (
    <ButtonContainer onClick={onClick}>
      {getButtonFace(gameButtonState)}
    </ButtonContainer>
  );
};

export default GameButton;
