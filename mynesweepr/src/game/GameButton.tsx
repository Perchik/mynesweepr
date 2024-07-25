import React, { useEffect, useState } from "react";
import { useGameContext } from "../context/GameContext";
import { useSettingsContext } from "../context/SettingsContext";
import styled from "styled-components";

const ButtonContainer = styled.button`
  align-items: center;
  background-color: #ccc;
  cursor: pointer;
  display: flex;
  font-size: 26px;
  height: 40px;
  justify-content: center;
  line-height: 26px;
  outline: 2px solid #808080;
  user-select: none;
  width: 40px;
  &:active {
    border-color: #808080 #fff #fff #808080;
    font-size: 23px;
  }
  border: 4px solid #808080;
  border-color: #fff #808080 #808080 #fff;
`;

const getButtonFace = (gameState: string, isMouseDown: boolean): string => {
  switch (gameState) {
    case "win":
      return "😎";
    case "lose":
      return "😵";
    case "inprogress":
      return isMouseDown ? "😯" : "🙂";
    default:
      return "🙂";
  }
};

const GameButton: React.FC = () => {
  const { gameState, isMouseDown, startNewGame } = useGameContext();
  const { settings } = useSettingsContext();
  const [buttonFace, setButtonFace] = useState<string>(
    getButtonFace(gameState, isMouseDown)
  );

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

  useEffect(() => {
    setButtonFace(getButtonFace(gameState, isMouseDown));
  }, [gameState, isMouseDown]);

  return (
    <ButtonContainer onClick={handleNewGame}>{buttonFace}</ButtonContainer>
  );
};

export default GameButton;
