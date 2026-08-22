import {BOARD_SIZE} from "./constants"
import {State} from "./types"
import {createSvg} from "./utils"

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
  x1: number
  x2: number
  y1: number
  y2: number
  key: string
  strokeWidth?: number
  className: string
}) {
  const line: SVGLineElement = createSvg({
    tag: "line",
    className,
    x1: `${x1}`,
    y1: `${y1}`,
    x2: `${x2}`,
    y2: `${y2}`,
    key: `${key}`,
  })

  if (strokeWidth) line.setAttribute("stroke-width", `${strokeWidth}`)

  line.setAttribute("stroke", "black")
  // line.setAttribute("stroke-width", `${strokeWidth}px`)
  return line
}
const drawLines = ({
  isHorizontal = false,
  svg,
  size,
}: {
  isHorizontal: boolean
  svg: SVGElement
  size: number
}) => {
  const cellHeight = size / BOARD_SIZE
  for (let i = 0; i <= BOARD_SIZE; i++) {
    const x = i * cellHeight
    const isThick = i % 3 === 0

    const line = svg.appendChild(
      drawLine({
        x1: isHorizontal ? 0 : x,
        y1: isHorizontal ? x : 0,
        x2: isHorizontal ? size : x,
        y2: isHorizontal ? x : size,
        key: `key-${isHorizontal ? "h" : "v"}-${i}`,
        className: "s-lines",
      }),
    )
    line.classList.add(isThick ? "s-thick" : "s-thin")
  }
}

export function drawBackground(state: State) {
  const {bounds, board} = state

  const {width, height} = bounds()

  const svg = createSvg({
    tag: "svg",
    className: "svg-lines--container",
    width: `${width}`,
    height: `${height}`,
  })

  drawLines({isHorizontal: true, svg, size: height})
  drawLines({isHorizontal: false, svg, size: height})

  board.appendChild(svg)
}
