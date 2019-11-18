import * as React from "react";
import { useContext, useEffect, createRef } from "react";
import styled from "styled-components";

import { estimationContext } from "../stores/estimation";
import { resizeResults, draw, matchDimensions } from "face-api.js";
import { autorun, toJS } from "mobx";

import { drawAxes } from "../api/pose";

import Center from "../components/Center";

const Video = styled.video`
  position: fixed;
`;
const Canvas = styled.canvas`
  position: fixed;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: white;
`;

const DebuggerScreen = () => {
  let video = createRef<HTMLVideoElement>();
  let canvas = createRef<HTMLCanvasElement>();

  const estimationStore = useContext(estimationContext);

  async function startVideo() {
    try {
      video.current.srcObject = await navigator.mediaDevices.getUserMedia({
        video: { width: { exact: 640 }, height: { exact: 480 } }
      });
    } catch (e) {
      console.error(e);
    }
  }

  function drawCanvas() {
    if (estimationStore.detections) {
      const displaySize = {
        width: video.current.width,
        height: video.current.height
      };
      const resizedDetections = resizeResults(
        estimationStore.detections,
        displaySize
      );
      canvas.current
        .getContext("2d")
        .clearRect(0, 0, canvas.current.width, canvas.current.height);
      draw.drawFaceLandmarks(canvas.current, resizedDetections);
      drawAxes(estimationStore.solutionVectors, canvas.current);
      const solutionVectors = toJS(estimationStore.solutionVectors);
      console.log("NOSE TIP => ", solutionVectors?.noseTip);
      console.log("ROTATION VECTOR => ", solutionVectors?.rotationVector);
    }
  }

  useEffect(() => {
    startVideo();
    const displaySize = {
      width: video.current.width,
      height: video.current.height
    };
    matchDimensions(canvas.current, displaySize);
    return autorun(drawCanvas);
  }, []);

  return (
    <Background>
      <Center>
        <Center>
          <Video ref={video} width="640" height="480" autoPlay muted />
          <Canvas ref={canvas} />
        </Center>
      </Center>
    </Background>
  );
};

export default DebuggerScreen;
