import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { estimationContext } from "./stores/estimation";
import { uiContext } from "./stores/ui";

import ConfigScreen from "./screens/ConfigScreen";
import DebuggerScreen from "./screens/DebuggerScreen";
import GameOverScreen from "./screens/GameOverScreen";
import GameScreen from "./screens/GameScreen";
import HiddenDetectors from "./screens/HiddenDetectors";
import HowToScreen from "./screens/HowToScreen";
import PermissionScreen from "./screens/PermissionScreen";

import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import CompareArrows from "@material-ui/icons/CompareArrows";
import InsertEmoticon from "@material-ui/icons/InsertEmoticon";

const UIControls = styled.div`
  position: absolute;
  bottom: 0;
  width: 10rem;
  margin: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

  @media all and (max-width: 940px) {
    width: 100%;
    margin: 1rem 0;
    padding: 0 6rem;
  }
`;

const InGameStage = observer(() => {
  const uiStore = useContext(uiContext);
  const estimationStore = useContext(estimationContext);

  return (
    <>
      {(() => {
        switch (uiStore.uiStage) {
          case "PERMISSION_SCREEN":
            return <PermissionScreen />;
          case "HOW_TO_SCREEN":
            return <HowToScreen />;
          case "CONFIG_CAT":
          case "CONFIG_NUM":
            return <ConfigScreen />;
          case "GAME_SCREEN":
            return <GameScreen />;
          case "GAME_OVER_SCREEN":
            return <GameOverScreen />;
        }
      })()}
      {uiStore.isDebugMode && <DebuggerScreen />}
      <UIControls>
        <Tooltip title="Toggle Visual Debugger" placement="top">
          <IconButton onClick={uiStore.toggleDebugMode}>
            <InsertEmoticon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Toggle Left/Right Mirror" placement="top">
          <IconButton onClick={estimationStore.toggleMirror}>
            <CompareArrows />
          </IconButton>
        </Tooltip>
      </UIControls>
      <HiddenDetectors />
    </>
  );
});

export default InGameStage;
