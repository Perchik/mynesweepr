import { useState, useEffect, useCallback } from "react";
import { Game } from "../game/Game.model";
import { useSettingsContext } from "../context/SettingsContext";

export const useGame = (
  initialWidth: number,
  initialHeight: number,
  initialMines: number
) => {
  const { settings } = useSettingsContext();
  const [game, setGame] = useState(
    new Game(initialWidth, initialHeight, initialMines)
  );
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (game.gameState === "inprogress") {
      interval = setInterval(() => {
        setElapsedTime(game.elapsedTime);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [game]);

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      game.openCell(x, y);
      setGame(game.clone());
    },
    [game]
  );

  const handleCellRightClick = useCallback(
    (x: number, y: number, e: React.MouseEvent) => {
      e.preventDefault();
      game.flagCell(x, y, settings.useGuessing); 
      setGame(game.clone()); 
    },
    [game, settings.useGuessing]
  );

  const handleNewGame = useCallback(
    (width: number, height: number, mines: number) => {
      const newGame = new Game(width, height, mines);
      setGame(newGame);
      setElapsedTime(0);
    },
    []
  );

  return {
    game,
    elapsedTime,
    handleCellClick,
    handleCellRightClick,
    handleNewGame,
  };
};
