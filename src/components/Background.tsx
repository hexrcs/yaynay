import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import { uiContext } from "../stores/ui";

import Splash from "../assets/Splash";

const Container = styled.div`
  z-index: -100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Background = observer(() => {
  const uiStore = useContext(uiContext);
  if (!uiStore.isDebugMode) {
    return (
      <Container
      // transitionFade={{ duration: 500 }}
      >
        <Splash />
      </Container>
    );
  }
});

export default Background;
