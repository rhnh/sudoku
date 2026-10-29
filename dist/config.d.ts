import type { AllButtons, RootedState, SudokuBaseElements, SudokuBoardElements, SudokuPanelElements } from "./state";
import { type Squares, type Theme } from "./types";
export interface Config {
    root: HTMLElement;
    currentTheme?: Theme | string;
    squares: Squares;
    solutions: Squares;
    levelEasy?: number;
    levelMedium?: number;
    levelHard?: number;
    levelExpert?: number;
    maxWidth: number;
}
export declare const configurePanelElements: () => SudokuPanelElements;
export declare const configureBoardElements: () => SudokuBoardElements;
export declare const configureElements: (state: RootedState) => SudokuBaseElements;
export declare const initButtons: () => AllButtons;
