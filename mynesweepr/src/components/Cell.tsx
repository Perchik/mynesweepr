import React from "react";
import styled from "styled-components";

import { Cell as CellModel } from "../models/Cell";
import { VisualState, MarkerState } from "../models/CellStates";

const getCellBackgroundColor = (visualState: VisualState) => {
  switch (visualState) {
    case VisualState.Open:
      return "#ddd";
    case VisualState.Exploded:
      return "#f00";
    case VisualState.Closed:
    default:
      return "#ccc";
  }
};

const getCellFontColor = (cellValue: number) => {
  switch (cellValue) {
    case 1:
      return "#00f";
    case 2:
      return "#008000";
    case 3:
      return "#f00";
    case 4:
      return "#000080";
    case 5:
      return "#800000";
    case 6:
      return "#008080";
    case 7:
      return "#000";
    case 8:
      return "#808080";
    default:
      return "transparent";
  }
};

const CellContainer = styled.div.attrs<{
  visualState: VisualState;
  cellValue: number;
}>(({ visualState, cellValue }) => ({
  visualState,
  cellValue,
}))<{
  visualState: VisualState;
  cellValue: number;
}>`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ visualState }) => getCellBackgroundColor(visualState)};
  box-sizing: border-box;
  user-select: none;
  border: solid #808080;
  border-width: ${({ visualState }) =>
    visualState === VisualState.Open
      ? "1px"
      : visualState === VisualState.Exploded
      ? 0
      : "3px"};
  border-top-color: ${({ visualState }) =>
    visualState === VisualState.Open || visualState === VisualState.Exploded
      ? "#999"
      : "#fff"};
  border-left-color: ${({ visualState }) =>
    visualState === VisualState.Open || visualState === VisualState.Exploded
      ? "#999"
      : "#fff"};
  color: ${({ cellValue }) => getCellFontColor(cellValue)};
  font-family: "MINE-SWEEPER", sans-serif;
`;

const CellIcon = styled.img`
  width: 28px;
  height: 28px;
`;
interface CellProps {
  cell: CellModel;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const Cell: React.FC<CellProps> = ({ cell, onClick, onContextMenu }) => {
  return (
    <CellContainer
      onClick={onClick}
      onContextMenu={onContextMenu}
      className="cell"
      cellValue={cell.value}
      visualState={cell.visualState}
    >
      {cell.visualState === VisualState.Open ||
      cell.visualState === VisualState.Exploded ? (
        cell.value === -1 ? (
          <CellIcon src="icons/mine.png" alt="mine" />
        ) : (
          cell.value
        )
      ) : cell.markerState === MarkerState.Flagged ? (
        <CellIcon src="icons/flag.png" alt="flag" />
      ) : (
        ""
      )}
    </CellContainer>
  );
};

export default Cell;
