import React, { useRef, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Cell as CellModel, VisualState, MarkerState } from "./Cell.model";
import { useGameContext } from "../context/GameContext";
import flagIcon from "./assets/flag.svg";
import blueFlagIcon from "./assets/blueFlag.svg";
import questionIcon from "./assets/question.svg";
import mineIcon from "./assets/mine.png";

const getCellBackgroundColor = (
  visualState: VisualState,
  isExploded = false
) => {
  if (isExploded) return "#f00";
  switch (visualState) {
    case "open":
    case "reducedOpen":
      return "#ddd";
    case "closed":
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

const FlatCell = css`
  border: solid 1px #808080;
`;

const RaisedCell = css`
  border: solid 3px;
  border-color: #fff #808080 #808080 #fff;
`;

const CellContainer = styled.div.attrs<{
  visualState: VisualState;
  cellValue: number;
  backgroundColor: string;
}>(({ visualState, cellValue, backgroundColor }) => ({
  visualState,
  cellValue,
  backgroundColor,
}))<{ visualState: VisualState; cellValue: number; backgroundColor: string }>`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ backgroundColor }) => backgroundColor};
  box-sizing: border-box;
  user-select: none;
  color: ${({ cellValue }) => getCellFontColor(cellValue)};
  font-family: "MINE-SWEEPER", sans-serif;

  ${(props) => props.visualState === "open" && FlatCell}
  ${(props) => props.visualState === "closed" && RaisedCell}
  ${(props) => props.visualState === "reducedOpen" && FlatCell}
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
    case "flagged":
      return <CellIcon src={flagIcon} alt="flag" />;
    case "guessed":
      return <CellIcon src={questionIcon} alt="question mark" />;
    case "none":
    default:
      return null;
  }
};

const Cell: React.FC<CellProps> = ({ cell, onClick, onContextMenu }) => {
  const [visualState, setVisualState] = useState(cell.visualState);
  const [markerState, setMarkerState] = useState(cell.markerState);
  const { viewMode } = useGameContext();
  const [isExploded, setIsExploded] = useState(cell.isExploded);
  const [displayValue, setDisplayValue] = useState(cell.value);

  const reducedValueRef = useRef(cell.reducedValue);
  const previousViewModeRef = useRef(viewMode);
  const cellRef = useRef<CellModel>(cell);

  useEffect(() => {
    const previousViewMode = previousViewModeRef.current;
    if (previousViewMode !== viewMode) {
      const cell = cellRef.current;
      if (viewMode === "reduced") {
        cell.updateReducedValue();
      }
      setDisplayValue(viewMode === "normal" ? cell.value : cell.reducedValue);
    }

    previousViewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    cellRef.current = cell;
  }, [cell]);

  useEffect(() => {
    reducedValueRef.current = cell.reducedValue;
  }, [cell.reducedValue]);

  useEffect(() => {
    setVisualState(cell.visualState);
    setMarkerState(cell.markerState);
    setIsExploded(cell.isExploded);
  }, [cell.visualState, cell.markerState, cell.isExploded]);

  const getCellContent = () => {
    if (cell.isOpen) {
      if (cell.isMine) {
        return <CellIcon src={mineIcon} alt="mine" />;
      } else if (displayValue > 0) {
        return displayValue;
      }
    } else {
      return getMarkerIcon(markerState, viewMode);
    }
    return "";
  };

  return (
    <CellContainer
      onClick={onClick}
      onContextMenu={onContextMenu}
      cellValue={cell.value}
      visualState={visualState}
      backgroundColor={getCellBackgroundColor(visualState, isExploded)}
    >
      {getCellContent()}
    </CellContainer>
  );
};

export default Cell;
