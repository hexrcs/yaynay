import * as React from "react";
import styled from "styled-components";

const Align = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  height: ${(p: { height?: number }) => p.height ?? 16}rem;
`;

export default Align;
