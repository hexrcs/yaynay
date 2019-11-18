import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

import { gameContext } from "../stores/game";
import { uiContext } from "../stores/ui";

import { useNod, useLeft, useRight } from "../hooks";

import IconButton from "@material-ui/core/IconButton";
import NavigateBefore from "@material-ui/icons/NavigateBefore";
import NavigateNext from "@material-ui/icons/NavigateNext";
import { Button } from "@material-ui/core";
import Text from "../components/Text";
import Bar from "../components/Bar";
import Center from "../components/Center";
import Align from "../components/Align";

const ConfigAmount = observer(() => {
  const gameStore = useContext(gameContext);
  useLeft(gameStore.decreaseAmount);
  useRight(gameStore.increaseAmount);

  return (
    <>
      <h2>
        <b>
          <Text size={40}>Number of Questions</Text>
        </b>
      </h2>
      <Bar>
        <IconButton onClick={gameStore.decreaseAmount} size="small">
          <NavigateBefore />
        </IconButton>
        <Text size={24}>{gameStore.displayAmount}</Text>
        <IconButton onClick={gameStore.increaseAmount} size="small">
          <NavigateNext />
        </IconButton>
      </Bar>
    </>
  );
});

const ConfigCategory = observer(() => {
  const gameStore = useContext(gameContext);
  useLeft(gameStore.prevCategory);
  useRight(gameStore.nextCategory);

  return (
    <>
      <h2>
        <b>
          <Text size={40}>Select Category</Text>
        </b>
      </h2>
      <Bar>
        <IconButton onClick={gameStore.prevCategory} size="small">
          <NavigateBefore />
        </IconButton>
        <Text size={24}>{gameStore.displayCategory}</Text>
        <IconButton onClick={gameStore.nextCategory} size="small">
          <NavigateNext />
        </IconButton>
      </Bar>
    </>
  );
});

const ConfigScreen = observer(() => {
  const uiStore = useContext(uiContext);
  useNod(uiStore.nextUIStage);

  console.log(uiStore.uiStage);
  return (
    <Center>
      <Align>
        {(() => {
          switch (uiStore.uiStage) {
            case "CONFIG_NUM": {
              return <ConfigAmount />;
            }
            case "CONFIG_CAT": {
              return <ConfigCategory />;
            }
          }
        })()}
        <Button onClick={uiStore.nextUIStage}>
          <b>
            <Text color="green">YAY</Text>
          </b>
        </Button>
      </Align>
    </Center>
  );
});

export default ConfigScreen;
