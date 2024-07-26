import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Cell as CellModel } from "./Cell.model";
import { useGameContext } from "../context/GameContext";

export enum VisualState {
  Open,
  Closed,
  Pressed,
  Exploded,
}

export enum MarkerState {
  None,
  Flagged,
  Guessed,
  Mine,
}

const getCellBackgroundColor = (
  visualState: VisualState,
  isExploded = false
) => {
  if (isExploded) return "#f00";

  switch (visualState) {
    case VisualState.Open:
      return "#ddd";
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
  backgroundColor: string;
}>(({ visualState, cellValue, backgroundColor }) => ({
  visualState,
  cellValue,
  backgroundColor,
}))<{ visualState: VisualState; cellValue: number }>`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ backgroundColor }) => backgroundColor};
  box-sizing: border-box;
  user-select: none;
  border: solid #808080;
  border-width: ${({ visualState }) =>
    visualState === VisualState.Open ? "1px" : "3px"};
  border-top-color: ${({ visualState }) =>
    visualState === VisualState.Open ? "#999" : "#fff"};
  border-left-color: ${({ visualState }) =>
    visualState === VisualState.Open ? "#999" : "#fff"};
  color: ${({ cellValue }) => getCellFontColor(cellValue)};
  font-family: "MINE-SWEEPER", sans-serif;
`;

const CellIcon = styled.img`
  width: 26px;
  height: 26px;
`;

interface CellProps {
  cell: CellModel;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const getMarkerIcon = (
  markerState: MarkerState,
  viewMode: string = "normal"
): JSX.Element | null => {
  switch (markerState) {
    case MarkerState.Flagged:
      if (viewMode === "reduced") return <CellIcon src="icons/blueFlag.svg" />;
      return <CellIcon src="icons/flag.svg" alt="flag" />;
    case MarkerState.Guessed:
      return <CellIcon src="icons/question.svg" alt="question mark" />;
    case MarkerState.None:
    default:
      return null;
  }
};

const Cell: React.FC<CellProps> = ({ cell, onClick, onContextMenu }) => {
  const [visualState, setVisualState] = useState(cell.visualState);
  const [markerState, setMarkerState] = useState(cell.markerState);
  const { viewMode } = useGameContext();
  const [isExploded, setIsExploded] = useState(cell.isExploded);

  useEffect(() => {
    setVisualState(cell.visualState);
    setMarkerState(cell.markerState);
    setIsExploded(cell.isExploded);
  }, [cell.visualState, cell.markerState, cell.isExploded]);

  return (
    <CellContainer
      onClick={onClick}
      onContextMenu={onContextMenu}
      cellValue={cell.value}
      visualState={visualState}
      backgroundColor={getCellBackgroundColor(visualState, isExploded)}
    >
      {cell.isOpen ? (
        cell.isMine ? (
          <CellIcon src="icons/mine.png" alt="mine" />
        ) : (
          cell.value
        )
      ) : (
        getMarkerIcon(markerState, viewMode)
      )}
    </CellContainer>
  );
};

export default Cell;
