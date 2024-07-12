import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../models/Board";

interface GameState {
  board: Board;
  isFacePressed: boolean;
  leftClickIsPrimary: boolean;
  clickedCoords: [number, number] | null;
}

const initialState: GameState = {
  board: Board.fromRandomSeed(42, 10, 10, 10),
  isFacePressed: false,
  leftClickIsPrimary: true,
  clickedCoords: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startNewGame(state) {
      state.board = Board.fromRandomSeed(42, 10, 10, 10);
      state.isFacePressed = false;
      state.clickedCoords = null;
    },
    handleClick(
      state,
      action: PayloadAction<{ x: number; y: number; primary: boolean }>
    ) {
      const { x, y, primary } = action.payload;
      state.clickedCoords = [x, y];
      if (primary) {
        state.board.openCell(x, y);
      } else {
        state.board.flagCell(x, y);
      }
    },
    toggleClickPreference(state) {
      state.leftClickIsPrimary = !state.leftClickIsPrimary;
    },
    setFacePressed(state, action: PayloadAction<boolean>) {
      state.isFacePressed = action.payload;
    },
  },
});

export const {
  startNewGame,
  handleClick,
  toggleClickPreference,
  setFacePressed,
} = gameSlice.actions;
export default gameSlice.reducer;
