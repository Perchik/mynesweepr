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
    toggleClickPreference(state) {
      state.leftClickIsPrimary = !state.leftClickIsPrimary;
    },
    setFacePressed(state, action: PayloadAction<boolean>) {
      state.isFacePressed = action.payload;
    },
    setClickedCoords(state, action: PayloadAction<[number, number] | null>) {
      state.clickedCoords = action.payload;
    },
  },
});

export const {
  startNewGame,
  toggleClickPreference,
  setFacePressed,
  setClickedCoords,
} = gameSlice.actions;
export default gameSlice.reducer;
