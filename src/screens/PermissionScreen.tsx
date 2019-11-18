import * as React from "react";
import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { uiContext } from "../stores/ui";

const PermissionScreen = observer(() => {
  const uiStore = useContext(uiContext);

  useEffect(uiStore.nextUIStage, []);

  return <p>Please allow camera</p>;
});

export default PermissionScreen;
