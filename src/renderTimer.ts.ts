import { BOARD_SIZE } from "./constants";
import { Box, createElement, formatTime, id } from "./lib";
import { isIdle, isPaused, isPlaying, type State } from "./state";

export const renderTimer = (state: State): State =>
  isPlaying(state.gameState) || isPaused(state.gameState)
    ? Box(state).map(timer).fold(id)
    : state;
export const timer = (state: State): State => {
  const { bounds } = state;
  const RATIO = 3;
  if (state.isZenMode) return state;
  const timer = document.createElement("section");
  const height = state.bounds().width / BOARD_SIZE;
  const width = height * 3;

  timer.style.width = `${width}px`;
  timer.style.height = `${height}px`;
  timer.classList.add("timer");
  timer.id = "timer";

  const timerText = createElement({ tag: "span", classname: "timer-span" });
  timerText.style.height = `${bounds().height / BOARD_SIZE}px`;
  timerText.style.width = `${(bounds().width / BOARD_SIZE) * RATIO}px`;
  timer.appendChild(timerText);

  if (isIdle(state.gameState)) {
    timerText.textContent = `00:00`;
  }
  let seconds = state.seconds ? state.seconds : 0;
  setInterval(() => {
    if (isPlaying(state.gameState)) {
      timerText.textContent = formatTime(state.seconds);
      state.seconds = seconds;
      seconds++;
    }
  }, 1000);
  state.timerElement.appendChild(timer);
  state.playModeSection.append(state.timerElement);
  state.panel.appendChild(state.playModeSection);
  return state;
};
