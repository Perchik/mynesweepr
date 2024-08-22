import React from "react";
import styled from "styled-components";
import BoardComponent from "../board/Board.component";
import GameButton from "./GameButton";
import { useGameContext } from "../context/GameContext";
import { DigitalCounter } from "@/digitalCounter";
import Typography, { TypographyProps } from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import { Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const GameContainer = styled.div`
  display: inline-block;
  border: 2px solid #999;
  background-color: #bbb;
  padding: 10px 10px 0;
  border: 6px solid;
  border-color: #fff #808080 #808080 #fff;
  box-shadow: 2px 2px 10px #000;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #bbb;
  padding: 3px;
  box-sizing: border-box;
  border: 6px solid;
  border-color: #808080 #fff #fff #808080;
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 6px 0 4px;
`;

const SwitchTitle = styled(
  ({ isEnabled, ...props }: { isEnabled: boolean } & TypographyProps) => (
    <Typography {...props} />
  )
)<{ isEnabled: boolean }>`
  text-shadow: ${(props) =>
    props.isEnabled ? "0 0 2px #fff, 0 0 6px #00ffff" : "inherit"};
  color: ${(props) => (props.isEnabled ? "#1976d2" : "inherit")};
`;

const Game: React.FC = () => {
  const {
    game,
    elapsedTime,
    flags,
    viewMode,
    toggleViewMode,
    handleLeftClick,
    handleCellRightClick,
    handleMouseDown,
    handleMouseUp,
    isDirty,
    updateReducedBoard,
  } = useGameContext();

  return (
    <GameContainer onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <Header>
        <DigitalCounter value={game.mines - flags} />
        <GameButton />
        <DigitalCounter value={Math.min(Math.floor(elapsedTime / 1000), 999)} />
      </Header>
      <BoardComponent
        board={game.board}
        onClick={({ x, y }) => handleLeftClick(x, y)}
        onCellRightClick={({ x, y }, e) => handleCellRightClick(x, y, e)}
      />
      <SwitchContainer>
        <Tooltip
          arrow
          title='The "reduced" view of the board shows the state of the game if all of the marked mines are removed. Note, that this only considers cells that you marked and has no knowledge of where actual mines are.'
        >
          <SwitchTitle
            isEnabled={viewMode === "reduced"}
            sx={{ fontFamily: "manrope", fontWeight: 800 }}
            variant="caption"
          >
            Reduced
          </SwitchTitle>
        </Tooltip>
        <Tooltip
          title="Toggle reduced board"
          PopperProps={{ disablePortal: true }}
        >
          <Switch
            size="small"
            checked={viewMode === "reduced"}
            onChange={toggleViewMode}
          />
        </Tooltip>
        <Tooltip title="Update reduced board state">
          <span>
            <IconButton
              size="small"
              onClick={updateReducedBoard}
              disabled={viewMode !== "reduced" || !isDirty}
            >
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </SwitchContainer>
    </GameContainer>
  );
};

export default Game;
