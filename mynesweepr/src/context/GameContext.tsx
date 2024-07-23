import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Game } from "../game/Game.model";
import { useSettingsContext } from "./SettingsContext";

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
  const [gameState, setGameState] = useState<string>("none");
  const [flags, setFlags] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);

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

  const handleMouseDown = useCallback(() => {
    setIsMouseDown(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
  }, []);

  const handleClick = useCallback(
    (x: number, y: number, primary: boolean) => {
      if (gameState === "new") {
        setGameState("inprogress");
      }
      if (primary) {
        game.openCell(x, y);
      } else {
        game.flagCell(x, y);
      }

      setGame(game.clone());
      setGameState(game.gameState);
      setFlags(game.flags);
    },
    [game, gameState]
  );

  const handleLeftClick = useCallback(
    (x: number, y: number) => {
      const primary = settings.swapLeftRightClick ? false : true;
      handleClick(x, y, primary);
    },
    [settings.swapLeftRightClick, handleClick]
  );

  const handleCellRightClick = useCallback(
    (x: number, y: number, e: React.MouseEvent) => {
      e.preventDefault();
      const primary = settings.swapLeftRightClick ? true : false;
      handleClick(x, y, primary);
    },
    [settings.swapLeftRightClick, handleClick]
  );

  const startNewGame = useCallback(
    (width: number, height: number, mines: number, seed?: string) => {
      const newGame = new Game(width, height, mines, seed);
      setGame(newGame);
      setElapsedTime(0);
      setGameState("inprogress");
      setFlags(0);
    },
    []
  );

  return (
    <GameContext.Provider
      value={{
        game,
        gameState,
        startNewGame,
        elapsedTime,
        flags,
        handleMouseDown,
        handleMouseUp,
        isMouseDown,
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
