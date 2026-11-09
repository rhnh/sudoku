import { BOARD_SIZE } from './constants';
import { Box, createElement, id } from './lib';
import { modal } from './modal';
import { read } from './sen';
export const renderSettings = (state) => state.isModalOn && state.overlay === 'settings' ? Box(state).map(settings).map(fenEvent).fold(id) : state;
export const settings = (state) => {
    const content = createElement({ tag: 'section', classname: 'content' });
    content.append(main());
    return modal(state)(content);
};
function main() {
    const el = createElement({ tag: 'section', classname: 'setting-main' });
    Array.from(Array(BOARD_SIZE).keys()).map(e => {
        const input = createElement({ tag: 'textarea', classname: 'fen-text ' + e });
        el.appendChild(input);
    });
    const btn = createElement({ tag: 'button', classname: 'fen-text' });
    btn.innerHTML = 'submit';
    el.appendChild(btn);
    return el;
}
export const fenEvent = (state) => {
    const selector = 'button';
    const btns = state.board.querySelectorAll(selector);
    console.log(btns);
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = state.board.querySelector('textarea');
            console.log(state.squares, state.squares.size);
            if (input) {
                state.squares = new Map();
                const squares = read(input?.value);
                state.squares = squares;
                state.gameState = 'play';
                state.isModalOn = false;
                state.hardRerender(state);
            }
        });
    });
    return state;
};
//# sourceMappingURL=renderSettingsModal.js.map