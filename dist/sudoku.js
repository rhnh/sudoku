import './assets/themes.style.css';
import './assets/style.css';
import './assets/icon-fonts.css';
import './assets/media-queries.css';
import { setApi } from './api';
import { renderSquares } from './board';
import { boardKeyEvents } from './boardKeyEvents';
import { boardMouseEvent } from './boardMouseEvents';
import { Box } from './lib';
import { renderBase, renderSidebar } from './render';
import { renderGrid } from './svg';
export { generateCells } from './sudoku.algo';
export const sudoku = ({ root, levelEasy = 37, currentTheme = 'dracula', squares, solutions, }) => {
    if (!root)
        throw new Error('No Element found');
    const headlessState = {
        currentLevel: levelEasy,
        currentTheme,
        gameState: 'idle',
        squares,
        readonlySquares: new Map(squares),
        highlightedSquares: new Map(),
        duplicates: new Map(),
        solutions,
        notes: new Map(),
        isNote: false,
        isZenMode: false,
        seconds: 0,
        lastMoves: [],
        selectedSquares: [],
        isMuted: false,
        isModalOn: false,
        keyListenerBound: false,
    };
    const state = { root, ...headlessState };
    return Box(state)
        .map(renderBase)
        .map(renderSquares)
        .map(boardMouseEvent)
        .map(boardKeyEvents)
        .map(renderGrid)
        .map(renderSidebar)
        .fold(setApi);
};
//# sourceMappingURL=sudoku.js.map