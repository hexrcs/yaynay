import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";

import { uiContext } from "../stores/ui";

import { useNod } from "../hooks";
import Center from "../components/Center";
import Paragraph from "../components/Paragraph";
import { Button } from "@material-ui/core";
import Text from "../components/Text";

const HowToScreen = observer(() => {
  const uiStore = useContext(uiContext);
  useNod(uiStore.nextUIStage);

  return (
    <Center>
      <Paragraph>
        <Text>Let’s start a new game!</Text>
      </Paragraph>
      <Paragraph>
        <Text>
          But first, I need to ask you a few questions to customize the game for
          you
        </Text>
      </Paragraph>
      <Paragraph>
        <Text>
          Turn your head to the left to select the previous option or reduce
          value, turn to the right to select next or increase
        </Text>
      </Paragraph>
      <Paragraph>
        <Text>Nod to confirm the current selection</Text>
      </Paragraph>
      <Paragraph>
        <Text>Shall we begin? Nod please :D</Text>
      </Paragraph>
      <Button onClick={uiStore.nextUIStage}>
        <b>
          <Text color="green">YAY</Text>
        </b>
      </Button>
    </Center>
  );
});

export default HowToScreen;
