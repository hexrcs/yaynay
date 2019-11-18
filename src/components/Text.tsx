import * as React from "react";
import styled from "styled-components";

const Text = styled.span`
  color: ${(p: TextProps) => {
    if (!p.color) return "#000000";
    switch (p.color) {
      case "black":
        return "#000000";
      case "red":
        return "#E02020";
      case "green":
        return "#5CB300";
      case "blue":
        return "#0072C8";
    }
  }};
  font-family: ${(p: TextProps) =>
    p.slab ? `"Roboto Slab", serif` : `"Roboto Mono", monospace`};
  font-size: ${(p: TextProps) => p.size ?? 30}px;
`;

type TextProps = {
  color?: "black" | "red" | "green" | "blue";
  slab?: boolean;
  size?: number;
};

export default Text;
