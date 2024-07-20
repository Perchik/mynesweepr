import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Cell } from "./Cell.model";

interface CellState {
  cells: Cell[][];
  initializeCells: (cells: Cell[][]) => void;
  openCell: (x: number, y: number) => void;
  flagCell: (x: number, y: number) => void;
  setNeighbors: (x: number, y: number, neighbors: Cell[]) => void;
  setValue: (x: number, y: number, value: number) => void;
  toggleFlag: (x: number, y: number, useGuessing: boolean) => void;
  maybeOpenCell: (x: number, y: number) => void;
}

const useCellStore = create<CellState>()(
  immer((set) => ({
    cells: [],
    initializeCells: (cells) =>
      set((state) => {
        state.cells = cells;
      }),
    setValue: (x, y, value) =>
      set((state) => {
        state.cells[y][x] = state.cells[y][x].setValue(value);
      }),
    openCell: (x, y) =>
      set((state) => {
        state.cells[y][x] = state.cells[y][x].open();
      }),
    flagCell: (x, y) =>
      set((state) => {
        state.cells[y][x] = state.cells[y][x].flag();
      }),
    setNeighbors: (x, y, neighbors) =>
      set((state) => {
        state.cells[y][x] = state.cells[y][x].setNeighbors(neighbors);
      }),
    toggleFlag: (x, y, useGuessing) =>
      set((state) => {
        state.cells[y][x] = state.cells[y][x].toggleFlag(useGuessing);
      }),
    maybeOpenCell: (x, y) =>
      set((state) => {
        state.cells[y][x] = state.cells[y][x].maybeOpen();
      }),
  }))
);

export default useCellStore;
