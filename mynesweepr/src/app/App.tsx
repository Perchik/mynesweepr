import React from "react";
import GameComponent from "../game/Game.component";
import SettingsComponent from "../settings/Settings.component";
import DifficultySelector from "../settings/DifficultySelector.component";
import { GameProvider } from "../context/GameContext";
import { SettingsProvider } from "../context/SettingsContext";
import GlobalStyles from "./globalStyles";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  height: 100vh;
  margin: 40px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const App: React.FC = () => {
  return (
    <SettingsProvider>
      <GameProvider>
        <GlobalStyles />
        <Container>
          <LeftColumn>
            <GameComponent />
            <DifficultySelector />
          </LeftColumn>
          <RightColumn>
            <SettingsComponent />
          </RightColumn>
        </Container>
      </GameProvider>
    </SettingsProvider>
  );
};

export default App;
