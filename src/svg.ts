import { BOARD_SIZE } from "./constants";
import { createSvg } from "./lib";
import { type State } from "./state";

/**
 *
 * @param
 * @returns
 */
export function drawLine({
  x1,
  x2,
  y1,
  y2,
  key,
  strokeWidth,
  className,
}: {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  key: string;
  strokeWidth?: number;
  className: string;
}) {
  const line: SVGLineElement = createSvg({
    tag: "line",
    className,
    x1: `${x1}`,
    y1: `${y1}`,
    x2: `${x2}`,
    y2: `${y2}`,
    key: `${key}`,
  });

  if (strokeWidth) line.setAttribute("stroke-width", `${strokeWidth}`);

  line.setAttribute("stroke", "black");
  // line.setAttribute("stroke-width", `${strokeWidth}px`)
  return line;
}
const drawLines = ({
  isHorizontal = false,
  svg,
  size,
}: {
  isHorizontal: boolean;
  svg: SVGElement;
  size: number;
}) => {
  const cellHeight = size / BOARD_SIZE;
  for (let i = 0; i <= BOARD_SIZE; i++) {
    const x = i * cellHeight;
    const isThick = i % 3 === 0;
    if (isThick) continue;
    const line = svg.appendChild(
      drawLine({
        x1: isHorizontal ? 0 : x,
        y1: isHorizontal ? x : 0,
        x2: isHorizontal ? size : x,
        y2: isHorizontal ? x : size,
        key: `key-${isHorizontal ? "h" : "v"}-${i}`,
        className: "s-lines",
      }),
    );
    line.classList.add(isThick ? "s-thick" : "s-thin");
  }
  for (let i = 0; i <= BOARD_SIZE; i++) {
    const x = i * cellHeight;
    const isThick = i % 3 === 0;
    if (!isThick) continue;
    const line = svg.appendChild(
      drawLine({
        x1: isHorizontal ? 0 : x,
        y1: isHorizontal ? x : 0,
        x2: isHorizontal ? size : x,
        y2: isHorizontal ? x : size,
        key: `key-${isHorizontal ? "h" : "v"}-${i}`,
        className: "s-lines",
      }),
    );
    line.classList.add(isThick ? "s-thick" : "s-thin");
  }
};

export const drawHorizontalLines = ({
  svg,
  size,
}: {
  size: number;
  svg: SVGElement;
}) => drawLines({ isHorizontal: true, svg, size });

export const drawVerticalLines = ({
  svg,
  size,
}: {
  size: number;
  svg: SVGElement;
}) => drawLines({ isHorizontal: false, svg, size });

export function renderGrid(state: State): State {
  const { bounds, grid } = state;
  grid.replaceChildren();
  const { width, height } = bounds();

  const svg = createSvg({
    tag: "svg",
    className: "svg-lines--container",
    width: `${width}`,
    height: `${height}`,
  });
  const size = height;
  drawHorizontalLines({ svg, size });
  drawVerticalLines({ svg, size });
  grid.appendChild(svg);

  return state;
}
