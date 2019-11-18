import { observable, computed, action } from "mobx";
import { createContext } from "react";

import { nodOrShake, leftOrRight } from "../api/gesture";

export class EstimationStore {
  @observable
  shouldMirror = false; // swap left and right
  @action
  toggleMirror = () => {
    this.shouldMirror = !this.shouldMirror;
  };

  // internal
  @observable
  detections = null;
  @observable
  solutionVectors = null;

  // batching detections
  @observable
  lastInterval = [];
  rollingInterval = [];
  timer = null;

  // current interpretion
  @computed
  get gestureInterpretion() {
    return nodOrShake(this.lastInterval.map(d => d.noseTip));
  }

  @computed
  get faceDirection() {
    return leftOrRight(
      this.lastInterval.map(d => d.rotationVector),
      this.shouldMirror
    );
  }

  @computed
  get rotationVector() {
    return this.solutionVectors?.rotationVector;
  }

  @action
  clearLastInterval = () => {
    this.lastInterval = [];
    this.rollingInterval = [];
  };
}

export const estimationStore = new EstimationStore();
export const estimationContext = createContext(estimationStore);
