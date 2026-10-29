import type { State } from "./state";
import type { Theme } from "./types";
export interface API {
    setTheme: (theme: Theme) => void;
    setCurrentLevel(n: number): void;
}
export declare const setApi: (state: State) => API;
