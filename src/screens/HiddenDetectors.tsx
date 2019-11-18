import * as React from "react";
import { useContext, useEffect, createRef } from "react";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

import {
  detectSingleFace,
  matchDimensions,
  TinyFaceDetectorOptions
} from "face-api.js";

import { solvePoseFrom } from "../api/pose";

import { uiContext } from "../stores/ui";
import { estimationContext } from "../stores/estimation";

const HiddenVideo = styled.video`
  height: 0%;
  overflow: hidden;
  position: fixed;
`;
const HiddenCanvas = styled.canvas`
  height: 0%;
  overflow: hidden;
  position: fixed;
`;
const Container = styled.div`
  position: fixed;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HiddenDetectors = observer(() => {
  let video = createRef<HTMLVideoElement>();
  let canvas = createRef<HTMLCanvasElement>();

  const uiStore = useContext(uiContext);
  const estimationStore = useContext(estimationContext);

  async function startVideo() {
    try {
      video.current.srcObject = await navigator.mediaDevices.getUserMedia({
        video: { width: { exact: 640 }, height: { exact: 480 } }
      });
      uiStore.isWebcamReady = true;
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    startVideo();
  }, []);

  function handlePlay() {
    const displaySize = {
      width: video.current.width,
      height: video.current.height
    };
    matchDimensions(canvas.current, displaySize);

    setInterval(async () => {
      estimationStore.detections = await detectSingleFace(
        video.current,
        new TinyFaceDetectorOptions()
      ).withFaceLandmarks();

      try {
        estimationStore.solutionVectors = solvePoseFrom(
          estimationStore.detections.landmarks
        );

        estimationStore.rollingInterval = [
          ...estimationStore.rollingInterval,
          estimationStore.solutionVectors
        ];

        // if $timer doesn't exist, wait 2s to push data then erase $timer
        estimationStore.timer ||
          (estimationStore.timer = setTimeout(() => {
            estimationStore.lastInterval = [...estimationStore.rollingInterval];
            estimationStore.rollingInterval = [];
            estimationStore.timer = null;
          }, 2000));
      } catch (e) {
        uiStore.isDebugMode && console.warn(e);
      }
    }, 100);
  }

  return (
    <Container>
      <HiddenCanvas ref={canvas} />
      <HiddenVideo
        ref={video}
        width="640"
        height="480"
        autoPlay
        muted
        onPlay={handlePlay}
      />
    </Container>
  );
});

export default HiddenDetectors;
