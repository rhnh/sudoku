import { Box, createElement, id } from "./lib";
import { modal } from "./modal";
import type { State } from "./state";

export const renderSettings = (state: State): State =>
  state.isModalOn && state.overlay === "settings"
    ? Box(state).map(settings).fold(id)
    : state;

export const settings = (state: State): State => {
  const content = createElement({ tag: "section", classname: "content" });
  content.append(main());
  return modal(state)(content);
};

function main(): HTMLElement {
  const el = createElement({ tag: "section", classname: "setting-main" });

  return el;
}
