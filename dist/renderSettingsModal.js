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
    const h3 = createElement({ tag: 'h3', classname: 'setting-main-desc' });
    h3.innerText = 'add:8#36#33/4#28#13#21/7#32#36/#16#428#1/#3419#25/#48#279 ';
    const input = createElement({ tag: 'input', classname: 'fen-text' });
    const btn = createElement({ tag: 'button', classname: 'fen-text' });
    btn.innerHTML = 'submit';
    el.appendChild(h3);
    el.appendChild(input);
    el.appendChild(btn);
    return el;
}
export const fenEvent = (state) => {
    const selector = 'button';
    const btns = state.board.querySelectorAll(selector);
    console.log(btns);
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = state.board.querySelector('input');
            console.log(state.squares, state.squares.size);
            if (input) {
                state.squares = new Map();
                const squares = read(input?.value);
                state.squares = squares;
                state.readonlySquares = squares;
                state.gameState = 'play';
                state.isModalOn = false;
                state.hardRerender(state);
            }
        });
    });
    return state;
};
//# sourceMappingURL=renderSettingsModal.js.map