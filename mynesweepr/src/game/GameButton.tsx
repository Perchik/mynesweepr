import React, { useState } from "react";
import { useGameContext } from "../context/GameContext";
import { useSettingsContext } from "../context/SettingsContext";
import styled from "styled-components";

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

const getButtonFace = (gameState: string): string => {
  switch (gameState) {
    case "win":
      return "😎";
    case "lose":
      return "😵";
    case "inprogress":
    default:
      return "🙂";
  }
};

const GameButton: React.FC = () => {
  const { gameState, startNewGame } = useGameContext();
  const { settings } = useSettingsContext();

  const handleNewGame = () => {
    const difficultySettings = {
      beginner: { width: 9, height: 9, mines: 10 },
      intermediate: { width: 16, height: 16, mines: 40 },
      expert: { width: 30, height: 16, mines: 99 },
    };
    const { width, height, mines } =
      difficultySettings[settings.selectedDifficulty];
    startNewGame(width, height, mines);
  };

  return (
    <ButtonContainer onClick={handleNewGame}>
      {getButtonFace(gameState)}
    </ButtonContainer>
  );
};

export default GameButton;
