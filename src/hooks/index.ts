import { useEffect } from "react";
import { estimationStore } from "../stores/estimation";
import { toJS } from "mobx";

export const useShake = (callback: Function, delay = 1800) => {
  useEffect(() => {
    const disposer = setInterval(() => {
      if (estimationStore.gestureInterpretion.gesture === "shake") {
        console.log("Shake");
        console.log(toJS(estimationStore.gestureInterpretion));
        callback();
        estimationStore.clearLastInterval();
      }
    }, delay);

    return () => clearInterval(disposer);
  }, [callback, delay]);
};

export const useNod = (callback: Function, delay = 1800) => {
  useEffect(() => {
    const disposer = setInterval(() => {
      if (estimationStore.gestureInterpretion.gesture === "nod") {
        console.log("Nod");
        console.log(toJS(estimationStore.gestureInterpretion));
        callback();
        estimationStore.clearLastInterval();
      }
    }, delay);

    return () => clearInterval(disposer);
  }, [callback, delay]);
};

export const useLeft = (callback: Function, delay = 1800) => {
  useEffect(() => {
    const disposer = setInterval(() => {
      if (estimationStore.faceDirection.facing === "left") {
        console.log("Left");
        console.log(toJS(estimationStore.faceDirection));
        callback();
        estimationStore.clearLastInterval();
      }
    }, delay);

    return () => clearInterval(disposer);
  }, [callback, delay]);
};

export const useRight = (callback: Function, delay = 1800) => {
  useEffect(() => {
    const disposer = setInterval(() => {
      if (estimationStore.faceDirection.facing === "right") {
        console.log("Right");
        console.log(toJS(estimationStore.faceDirection));
        callback();
        estimationStore.clearLastInterval();
      }
    }, delay);

    return () => clearInterval(disposer);
  }, [callback, delay]);
};
