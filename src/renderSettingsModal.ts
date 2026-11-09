import { Box, createElement, id } from './lib';
import { modal } from './modal';
import { read } from './sen';
import type { State } from './state';

export const renderSettings = (state: State): State =>
  state.isModalOn && state.overlay === 'settings' ? Box(state).map(settings).map(fenEvent).fold(id) : state;

export const settings = (state: State): State => {
  const content = createElement({ tag: 'section', classname: 'content' });

  content.append(main());

  return modal(state)(content);
};

function main(): HTMLElement {
  const el = createElement({ tag: 'section', classname: 'setting-main' });
  const input = createElement({ tag: 'input', classname: 'fen-text' });
  const btn = createElement({ tag: 'button', classname: 'fen-text' });
  btn.innerHTML = 'submit';
  el.appendChild(input);
  el.appendChild(btn);
  return el;
}

export const fenEvent = (state: State): State => {
  const selector = 'button';
  const btns = state.board.querySelectorAll<HTMLButtonElement>(selector);
  console.log(btns);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = state.board.querySelector<HTMLInputElement>('input');
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
