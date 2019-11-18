import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

import { gameContext } from "../stores/game";
import { uiContext } from "../stores/ui";

import { useNod } from "../hooks";
import Center from "../components/Center";
import Paragraph from "../components/Paragraph";
import Text from "../components/Text";
import Align from "../components/Align";
import { Button } from "@material-ui/core";

const GameOverScreen = observer(() => {
  const uiStore = useContext(uiContext);
  const gameStore = useContext(gameContext);

  useNod(uiStore.nextUIStage);

  return (
    <Center>
      <Align>
        <h1>
          <Text size={60}>You've got</Text>
        </h1>
        <Paragraph>
          <b>
            <Text size={40} color="green">
              {gameStore.correctOnes.length}
            </Text>
          </b>
          <Text size={40}> : </Text>
          <b>
            <Text size={40} color="red">
              {gameStore.wrongOnes.length}
            </Text>
          </b>
        </Paragraph>
        <Button onClick={uiStore.nextUIStage}>
          <b>
            <Text color="blue">NOD FOR NEW GAME</Text>
          </b>
        </Button>
      </Align>
    </Center>
  );
});

export default GameOverScreen;
