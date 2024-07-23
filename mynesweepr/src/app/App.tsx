import React from "react";
import GameComponent from "../game/Game.component";
import GameButton from "../game/GameButton";
import SettingsComponent from "../settings/Settings.component";
import DifficultySelector from "../settings/DifficultySelector.component";
import { GameProvider } from "../context/GameContext";
import { SettingsProvider } from "../context/SettingsContext";
import GlobalStyles from "./globalStyles";

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <GameProvider>
        <GlobalStyles />
        <div>
          <SettingsComponent />
          <DifficultySelector />
          <GameComponent />
          <GameButton />
        </div>
      </GameProvider>
    </SettingsProvider>
  );
};

export default App;
