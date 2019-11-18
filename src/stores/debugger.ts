import { observable } from "mobx";
import { createContext } from "react";

export class DebuggerStore {
  @observable
  records = [];
}

export const debuggerStore = new DebuggerStore();
export const debuggerContext = createContext(debuggerStore);
