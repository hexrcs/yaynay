import * as React from "react";
import styled from "styled-components";

const Paragraph = styled.p`
  width: 800px;
  padding-bottom: 2rem;

  @media all and (max-width: 940px) {
    width: 85%;
  }
`;

export default Paragraph;
