import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

import { gameContext } from "../stores/game";
import { uiContext } from "../stores/ui";

import { useShake, useNod } from "../hooks";
import { Button } from "@material-ui/core";
import Bar from "../components/Bar";
import Text from "../components/Text";
import Center from "../components/Center";
import Paragraph from "../components/Paragraph";
import Align from "../components/Align";

const GameScreen = observer(() => {
  const uiStore = useContext(uiContext);
  const gameStore = useContext(gameContext);

  useNod(gameStore.answerNod);
  useShake(gameStore.answerShake);

  if (uiStore.isGameReady) {
    return (
      <Center>
        <Align height={22}>
          <Paragraph>
            <Text
              size={40}
              dangerouslySetInnerHTML={{
                __html: gameStore.displayCurrentQuestion
              }}
            ></Text>
          </Paragraph>

          <Bar>
            <Button onClick={gameStore.answerNod}>
              <b>
                <Text color="green">YAY</Text>
              </b>
            </Button>
            <Button onClick={gameStore.answerShake}>
              <b>
                <Text color="red">nay</Text>
              </b>
            </Button>
          </Bar>
        </Align>
      </Center>
    );
  }
});

export default GameScreen;
