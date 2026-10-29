import type { RootedState, State } from "./state";
export declare const renderSidebar: (state: State) => State;
export declare const renderBase: (state: RootedState) => State;
export declare const hardRerender: (state: State) => State;
export declare const render: (state: State) => State;
export declare const resizeObserver2: (state: State) => ResizeObserver;
export declare const resizeObserver: (state: State) => void;
