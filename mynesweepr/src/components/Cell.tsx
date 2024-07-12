import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Cell as CellModel } from "../models/Cell";
import { State } from "../models/State";

const getCellBackgroundColor = (state: State) => {
  switch (state) {
    case State.Open:
      return "#ddd";
    case State.Exploded:
      return "#ff0000";
    default:
      return "#ccc";
  }
};

const getCellFontColor = (cell: string) => {
  switch (cell) {
    case "1":
      return "#00f";
    case "2":
      return "#008000";
    case "3":
      return "#f00";
    case "4":
      return "#000080";
    case "5":
      return "#800000";
    case "6":
      return "#008080";
    case "7":
      return "#000";
    case "8":
      return "#808080";
    default:
      return "transparent";
  }
};

const CellContainer = styled.div<{ cell: string; state: State }>`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ state }) => getCellBackgroundColor(state)};
  box-sizing: border-box;
  user-select: none;
  border: solid #808080;
  border-width: ${({ state }) => (state === State.Closed ? "3px" : "1px")};
  border-top-color: ${({ state }) =>
    state === State.Closed ? "#fff" : "#999"};
  border-left-color: ${({ state }) =>
    state === State.Closed ? "#fff" : "#999"};
  color: ${({ cell }) => getCellFontColor(cell)};
  font-family: "MINE-SWEEPER", sans-serif;
`;

const CellIcon = styled.img`
  width: 28px;
  height: 28px;
`;

interface CellProps {
  cell: CellModel;
  onClick: (x: number, y: number, primary: boolean) => void;
  onContextMenu: (e: React.MouseEvent, x: number, y: number) => void;
}

const Cell: React.FC<CellProps> = ({ cell, onClick, onContextMenu }) => {
  const [cellState, setCellState] = useState(cell.state);

  useEffect(() => {
    setCellState(cell.state);
  }, [cell.state]);

  return (
    <CellContainer
      state={cellState}
      cell={cell.value.toString()}
      onClick={() => onClick(cell.coordinates[0], cell.coordinates[1], true)}
      onContextMenu={(e) =>
        onContextMenu(e, cell.coordinates[0], cell.coordinates[1])
      }
    >
      {cellState === State.Open && cell.value !== -1 ? cell.value : ""}
      {cellState === State.Flagged && (
        <CellIcon src="/icons/flag.png" alt="Flag" />
      )}
      {cellState === State.Exploded && (
        <CellIcon src="/icons/bomb.png" alt="Bomb" />
      )}
    </CellContainer>
  );
};

export default Cell;
