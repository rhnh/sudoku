import { type State } from './state';
export declare function boardKeyEvents(state: State): State;
export declare const moveSelection: (state: State) => (x: number, y: number) => State;
