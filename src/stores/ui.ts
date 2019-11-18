import { observable, computed, action } from "mobx";
import { createContext } from "react";

import { gameStore } from "./game";

// const INIT = "INIT";
const INTRO_SCREEN = "INTRO_SCREEN";
const PERMISSION_SCREEN = "PERMISSION_SCREEN";
const HOW_TO_SCREEN = "HOW_TO_SCREEN";
const CONFIG_NUM = "CONFIG_NUM";
const CONFIG_CAT = "CONFIG_CAT";
const GAME_SCREEN = "GAME_SCREEN";
const GAME_OVER_SCREEN = "GAME_OVER_SCREEN";

export class UIStore {
  // Initial loading screen
  @observable
  areModelsReady = false;
  @observable
  isWasmReady = false;

  // Permission screen
  @observable
  isWebcamReady = false;

  // Config screen
  @observable
  isGameReady = false;

  @observable
  isDebugMode = false; // set to false in production
  @action
  toggleDebugMode = () => {
    this.isDebugMode = !this.isDebugMode;
  };

  @observable
  uiStage = INTRO_SCREEN;

  // screen state machine
  @action
  nextUIStage = () => {
    switch (this.uiStage) {
      case INTRO_SCREEN:
        this.uiStage = PERMISSION_SCREEN;
        break;
      case PERMISSION_SCREEN:
        this.uiStage = HOW_TO_SCREEN;
        break;
      case HOW_TO_SCREEN:
        this.uiStage = CONFIG_NUM;
        break;
      case CONFIG_NUM:
        this.uiStage = CONFIG_CAT;
        break;
      case CONFIG_CAT:
        gameStore.fetchQuestions();
        this.uiStage = GAME_SCREEN;
        break;
      case GAME_SCREEN:
        this.uiStage = GAME_OVER_SCREEN;
        break;
      case GAME_OVER_SCREEN:
        this.isGameReady = false;
        this.uiStage = CONFIG_NUM;
        break;
    }
  };

  @computed
  get showPreGame() {
    switch (this.uiStage) {
      case INTRO_SCREEN:
        return true;
      default:
        return false;
    }
  }

  @computed
  get showInGame() {
    switch (this.uiStage) {
      case PERMISSION_SCREEN:
      case HOW_TO_SCREEN:
      case CONFIG_NUM:
      case CONFIG_CAT:
      case GAME_SCREEN:
      case GAME_OVER_SCREEN:
        return true;
      default:
        return false;
    }
  }

  // loading screen
  @computed
  get showLoading() {
    switch (this.uiStage) {
      case INTRO_SCREEN:
        // if ($areModelsReady && $isWasmReady) {
        if (this.areModelsReady) {
          console.log("Models loaded");
          return false;
        } else {
          console.log("Models loading");
          return true;
        }
      case HOW_TO_SCREEN:
        if (this.isWebcamReady) {
          console.log("Cam is good!");
          return false;
        } else {
          console.log("Cam is initializing");
          return true;
        }
      case GAME_SCREEN:
        if (this.isGameReady) {
          console.log("Game loaded");
          return false;
        } else {
          console.log("Game loading");
          return true;
        }
      default:
        return false;
    }
  }
}

export const uiStore = new UIStore();
export const uiContext = createContext(uiStore);
