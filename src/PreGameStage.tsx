import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

import { uiContext } from "./stores/ui";

import IntroScreen from "./screens/IntroScreen";

const PreGameStage = observer(() => {
  const uiStore = useContext(uiContext);
  if (uiStore.uiStage === "INTRO_SCREEN") {
    return <IntroScreen />;
  }
});

export default PreGameStage;
