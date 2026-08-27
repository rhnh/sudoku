export function renderGameOver(state) {
    const { board } = state;
    const RATIO_1 = 20;
    const RATIO_2 = 90;
    const HALF_BOARD = 2;
    const h1 = document.createElement("h1");
    h1.innerText = "Game Over";
    h1.style.width = `50%`;
    h1.style.height = `50%`;
    h1.style.transform = `translate(${state.bounds().width / HALF_BOARD - RATIO_2}px,${state.bounds().height / HALF_BOARD + RATIO_1}px)`;
    h1.style.position = "absolute";
    board.appendChild(h1);
}
//# sourceMappingURL=renderGameOver.js.map