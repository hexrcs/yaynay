import * as React from "react";
import { useContext } from "react";
import { render } from "react-dom";

import { observer } from "mobx-react-lite";

import PreGameStage from "./PreGameStage";
import InGameStage from "./InGameStage";

import LoadingScreen from "./screens/LoadingScreen";

import { uiContext } from "./stores/ui";
import Background from "./components/Background";

const App = observer(() => {
  const uiStore = useContext(uiContext);
  return (
    <>
      <Background />
      {uiStore.showPreGame && <PreGameStage />}
      {uiStore.showInGame && <InGameStage />}
      <LoadingScreen show={uiStore.showLoading} />
    </>
  );
});

render(<App />, document.getElementById("root"));
