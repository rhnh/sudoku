import type { State } from "./state";
import type { Theme } from "./types";

export interface API {
  setTheme: (theme: Theme) => void;
  setCurrentLevel(n: number): void;
}

export const setApi = (state: State): API => {
  const api: API = {
    setTheme: (theme: Theme) => (state.currentTheme = theme),
    setCurrentLevel: (n: number) => (state.currentLevel = n),
  };
  return api;
};
