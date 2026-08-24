import { State } from "./state";
export declare function createSideLayout(): {
    numPad: HTMLElement;
    aside: HTMLElement;
    nav: HTMLElement;
};
export declare const renderBTNSection: (state: State) => HTMLElement;
export declare const renderTimer: (state: State) => HTMLElement;
