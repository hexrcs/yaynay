import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import posed from "react-pose";

import Logo from "../assets/Logo";

const Container = styled.div`
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Background = styled.div`
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: white;
`;

const Span = styled.span`
  color: #000000;
  font-family: "Roboto Mono", monospace;
  font-size: 30px;
`;
const Div = styled.div`
  display: flex;
  justify-content: center;
`;

const LoadingScreen = ({ show = false }) => {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return (
    render && (
      <Background>
        <Container
          className={show ? "" : "animated fadeOut faster"}
          onAnimationEnd={onAnimationEnd}
        >
          <Div className="animated zoomIn fast">
            <Logo />
          </Div>

          <Div className="animated flash slower infinite">
            <Span>loading...</Span>
          </Div>
        </Container>
      </Background>
    )
  );
};

export default LoadingScreen;
