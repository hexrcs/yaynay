import * as React from "react";
import { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { nets } from "face-api.js";

import { uiContext } from "../stores/ui";
import { gameContext } from "../stores/game";

import Button from "@material-ui/core/Button";

import Text from "../components/Text";
import Center from "../components/Center";
import Paragraph from "../components/Paragraph";

const IntroScreen = observer(() => {
  const uiStore = useContext(uiContext);
  const gameStore = useContext(gameContext);

  useEffect(() => {
    (async () => {
      await Promise.all([
        nets.tinyFaceDetector.loadFromUri("/models"),
        nets.faceLandmark68Net.loadFromUri("/models")
      ]);
      uiStore.areModelsReady = true;
      gameStore.fetchCategories();
    })();
  }, []);

  return (
    <Center>
      <Paragraph>
        <Text>
          Yay-nay is a pop quiz game that you can play hands-free by{" "}
          <i>
            <b>
              <Text color="green">nodding</Text>
            </b>
          </i>{" "}
          or{" "}
          <i>
            <b>
              <Text color="red">shaking</Text>
            </b>
          </i>{" "}
          your head
        </Text>
      </Paragraph>
      <Paragraph>
        <Text>
          The game uses your webcam to estimate your head pose with machine
          learning magic!
        </Text>
      </Paragraph>
      <Paragraph>
        <Text>Please allow webcam access in the next step!</Text>
      </Paragraph>

      <Button onClick={uiStore.nextUIStage}>
        <b>
          <Text color="blue">START</Text>
        </b>
      </Button>
    </Center>
  );
});

export default IntroScreen;
