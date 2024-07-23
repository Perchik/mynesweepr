import React, { useState } from "react";
import { useGameContext } from "../context/GameContext";
import { useSettingsContext } from "../context/SettingsContext";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const DifficultySelectorContainer = styled(FormControl)`
  margin-bottom: 20px;
`;

type Difficulty = "beginner" | "intermediate" | "expert";

const difficultySettings = {
  beginner: { width: 9, height: 9, mines: 10 },
  intermediate: { width: 16, height: 16, mines: 40 },
  expert: { width: 30, height: 16, mines: 99 },
};

const DifficultySelector: React.FC = () => {
  const { gameState, startNewGame } = useGameContext();
  const { settings, updateSettings } = useSettingsContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(
    null
  );

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newDifficulty = event.target.value as Difficulty;
    if (gameState === "inprogress") {
      setPendingDifficulty(newDifficulty);
      setDialogOpen(true);
    } else {
      updateSettings({ selectedDifficulty: newDifficulty });
      const settings = difficultySettings[newDifficulty];
      startNewGame(settings.width, settings.height, settings.mines);
    }
  };

  const handleDialogClose = (confirm: boolean) => {
    setDialogOpen(false);
    if (confirm && pendingDifficulty) {
      updateSettings({ selectedDifficulty: pendingDifficulty });
      const settings = difficultySettings[pendingDifficulty];
      startNewGame(settings.width, settings.height, settings.mines);
    }
    setPendingDifficulty(null);
  };

  return (
    <div>
      <DifficultySelectorContainer>
        <FormLabel component="legend">Select Difficulty</FormLabel>
        <RadioGroup
          aria-label="difficulty"
          name="difficulty"
          value={settings.selectedDifficulty}
          onChange={handleDifficultyChange}
        >
          <FormControlLabel
            value="beginner"
            control={<Radio />}
            label="Beginner"
          />
          <FormControlLabel
            value="intermediate"
            control={<Radio />}
            label="Intermediate"
          />
          <FormControlLabel value="expert" control={<Radio />} label="Expert" />
        </RadioGroup>
      </DifficultySelectorContainer>

      <Dialog open={dialogOpen} onClose={() => handleDialogClose(false)}>
        <DialogTitle>Abandon Current Game?</DialogTitle>
        <DialogContent>
          You have a game in progress. Do you want to abandon the current game
          and start a new one?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DifficultySelector;
