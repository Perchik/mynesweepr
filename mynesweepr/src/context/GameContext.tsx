import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Game } from "../game/Game.model";
import { useSettingsContext } from "./SettingsContext";
import Timer from "../utils/Timer";

interface GameContextType {
  game: Game;
  gameState: string;
  startNewGame: (
    width: number,
    height: number,
    mines: number,
    seed?: string
  ) => void;
  elapsedTime: number;
  flags: number;
  isMouseDown: boolean;
  handleMouseDown: () => void;
  handleMouseUp: () => void;
  handleLeftClick: (x: number, y: number) => void;
  handleCellRightClick: (x: number, y: number, e: React.MouseEvent) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings } = useSettingsContext();
  const [game, setGame] = useState(new Game(9, 9, 10));
  const [elapsedTime, setElapsedTime] = useState(0);
  const [flags, setFlags] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const timer = useMemo(() => new Timer((time) => setElapsedTime(time)), []);

  useEffect(() => {
    if (game.gameState === "inprogress") {
      timer.start();
    } else {
      timer.stop();
    }
    return () => {
      timer.stop();
    };
  }, [game.gameState, timer]);

  const handleMouseDown = useCallback(() => {
    setIsMouseDown(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleClick = useCallback(
    (x: number, y: number, primary: boolean) => {
      if (game.gameState === "new") {
        timer.start();
        game.gameState = "inprogress";
      }
      if (primary) {
        game.openCell(x, y);
      } else {
        game.flagCell(x, y);
      }

      if (game.gameOver) {
        timer.stop();
      }
      setFlags(game.flags);
      setGame(game.clone());
    },
    [game, timer]
  );

  const handleLeftClick = useCallback(
    (x: number, y: number) => {
      const primary = !settings.swapLeftRightClick;
      handleClick(x, y, primary);
    },
    [settings.swapLeftRightClick, handleClick]
  );

  const handleCellRightClick = useCallback(
    (x: number, y: number, e: React.MouseEvent) => {
      e.preventDefault();
      const primary = settings.swapLeftRightClick;
      handleClick(x, y, primary);
    },
    [settings.swapLeftRightClick, handleClick]
  );

  const startNewGame = useCallback(
    (width: number, height: number, mines: number, seed?: string) => {
      const newGame = new Game(width, height, mines, seed);
      setGame(newGame);
      setFlags(newGame.flags);
      timer.reset();

      setElapsedTime(0);
    },
    [timer]
  );

  return (
    <GameContext.Provider
      value={{
        game,
        gameState: game.gameState,
        elapsedTime,
        flags,
        startNewGame,
        isMouseDown,
        handleMouseDown,
        handleMouseUp,
        handleLeftClick,
        handleCellRightClick,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
