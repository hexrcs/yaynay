import * as React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const FadeInOut = ({ show = false, children }) => {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  return (
    render && (
      <Container
        className={show ? "animated fadeIn" : "animated fadeOut faster"}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </Container>
    )
  );
};

export default FadeInOut;
