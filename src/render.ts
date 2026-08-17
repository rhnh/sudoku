import {createNumPad, numPadEvents} from "./numpad"
import {panelEvents} from "./panelEvents"

import {
  type CellElement,
  type Key,
  type State,
  BOARD_SIZE,
  TOTAL_FILE,
} from "./types"

import {
  getPositionFromBound,
  getPositionFromKey,
  getSquareNr,
  Box,
  memo,
  id,
  formatTime,
} from "./utils"

export const renderNumpad = (state: State): State =>
  Box(createNumPad(state)).map(numPadEvents).fold(id)

export const renderAside = (state: State) =>
  Box(state).map(renderNumpad).map(renderNavPanel).map(panelEvents).fold(id)

export const render = (state: State): State =>
  Box(state).map(renderBoard).map(renderAside).fold(id)

export function updateBounds(s: State): void {
  const bounds = s.wrap.getBoundingClientRect()
  const container = s.container
  let width =
    Math.floor(bounds.width * window.devicePixelRatio) /
      window.devicePixelRatio -
    bounds.width / 3

  container.style.width = width + "px"
  container.style.height = width + "px"
  // container.style.aspectRatio = "1 / 1"
  s.bounds.clear()
}

export function renderBase(state: State): State {
  const container = document.createElement("container")

  if (!container) {
    throw new Error('Not HtmlElement found with id "container"')
  }

  const board = document.createElement("board")

  container.appendChild(board)

  const numPad = document.createElement("numpad")
  numPad.id = "numpad"

  const header = document.createElement("head")
  header.id = "aside-head"
  const aside = document.createElement("section")
  aside.id = "aside"
  const nav = document.createElement("article")
  nav.classList.add("panel")
  nav.id = "panel"

  aside.appendChild(nav)
  aside.appendChild(numPad)

  state.wrap.append(container)
  state.wrap.appendChild(aside)
  const bounds = memo(() => container.getBoundingClientRect())

  state = {...state, board, numPad, bounds, container, aside, nav}
  const observerCallback: ResizeObserverCallback = (
    entries: ResizeObserverEntry[],
  ) => {
    window.requestAnimationFrame((): void | undefined => {
      if (!Array.isArray(entries) || !entries.length) {
        return
      }
      if (state.container) {
        updateBounds(state)
        render(state)
      }
    })
  }
  new ResizeObserver(observerCallback).observe(state.wrap)

  return state
}
const renderBTNSection = (state: State): HTMLElement => {
  const {buttons, bounds} = state
  const btns = [
    '<i class="fa-solid fa-play"></i>',
    '<i class="fa-solid fa-arrows-rotate"></i>',
    `<i class="fa-solid fa-x"></i>`,
    `<i class="fa-solid fa-pen"></i>`,
    `<i class="fa-solid fa-eye"></i>`,
    `<i class="fa-solid fa-arrow-left"></i>`,
  ]
  let btnsIndex = 0
  const btnSection = document.createElement("section")
  btnSection.classList.add("btn-section")
  for (const [k, v] of buttons) {
    const btn = document.createElement("button")
    btn.style.height = `${bounds().height / 9}px`
    // btn.style.width = `${bounds().width / 3 - 1}px`
    btn.id = `${v.replace(/\s/g, "-")}`.toLowerCase()
    btn.classList.add(k)

    btn.innerHTML = btns[btnsIndex++]
    btn.style.aspectRatio = `1 / 1`
    btn.classList.add("buttons")

    btnSection.append(btn)
  }
  return btnSection
}

const renderTimer = (state: State) => {
  const {bounds} = state
  const timer = document.createElement("section")
  timer.style.height = `${bounds().height / 9}px`
  // timer.style.width = `${bounds().width / 3 - 1}px`
  timer.classList.add("timer-section")
  timer.id = "timer"

  const timerText = document.createElement("p")
  timer.appendChild(timerText)

  if (state.gameState === "isInitialed") {
    timerText.textContent = `00:00`
  }
  let seconds = state.seconds ? state.seconds : 0
  setInterval(() => {
    if (state.gameState === "isPlaying") {
      timerText.textContent = formatTime(state.seconds)
      state.seconds = seconds
      seconds++
    }
  }, 1000)
  return timer
}
export function renderNavPanel(state: State): State {
  const {aside, nav} = state

  updateBounds(state)

  state.nav.innerHTML = ""
  aside.style.maxWidth = `${state.bounds().width}px`

  nav.appendChild(renderTimer(state))
  nav.appendChild(renderBTNSection(state))

  return state
}

export function renderGameOver(state: State) {
  const {board} = state
  // board.innerHTML = ""
  // board.style.position = "unset"
  // board.style.display = "flex"
  // board.style.justifyContent = "center"
  // board.style.alignItems = "center"
  const h1 = document.createElement("h1")
  h1.innerText = "Game Over"
  h1.style.width = `50%`

  h1.style.height = `50%`
  h1.style.transform = `translate(${state.bounds().width / 2 - 90}px,${state.bounds().height / 2 + 20}px)`
  h1.style.position = "absolute"

  board.appendChild(h1)
}

function drawBackground(state: State) {
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

/**
 * https://www.typescriptlang.org/docs/handbook/dom-manipulation.html
 * @param SVGElementTagNameMap
 * @returns - a SVG
 */
export function createSvg<K extends keyof SVGElementTagNameMap>({
  tag,
  className,
  ...rest
}: {
  tag: K
  className: string
} & Record<string, string>): SVGElementTagNameMap[K] {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", tag)
  svg.classList.add(className)
  Object.entries(rest).forEach(([name, value]) => {
    svg.setAttribute(name, value)
  })
  return svg
}

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

export function renderBoard(state: State): State {
  updateBounds(state)
  const {board, cells} = state
  board.innerHTML = ""
  if (state.gameState === "isOvered") renderGameOver(state)
  const cellsContainer = document.createElement("cells")
  for (const [k, v] of cells) {
    const cellElem = document.createElement("cell") as CellElement
    const p = getPositionFromKey(k as Key)
    const pos = getPositionFromBound(state, p)

    cellElem.style.transform = `translate(${pos[0]}px, ${pos[1]}px)`
    cellElem.style.position = "absolute"
    cellElem.style.height = `${state.bounds().height / 9}px`
    cellElem.style.width = `${state.bounds().width / 9}px`

    for (const [kh, _] of state.highlight) {
      if (kh === k) {
        cellElem.classList.add("highlighted")
      }
    }
    state.selected.map((selectedKey) => {
      if (selectedKey === k) {
        cellElem.classList.remove("highlighted")
        cellElem.classList.remove("duplicates")
        cellElem.classList.add("selected")
      }
    })
    if (state.duplicates.size > 1)
      for (const [kd, _] of state.duplicates) {
        if (k === kd) {
          cellElem.classList.remove("highlighted")
          cellElem.classList.remove("selected")
          cellElem.classList.add("duplicates")
        }
      }
    cellElem.dataset.key = `${k}`
    cellElem.dataset.value = `${v}`

    const c = document.createElement("p")
    c.style.gridArea = "2 / 2 / 3 / 3"

    if (v !== "0" && state.gameState !== "isInitialed") {
      c.innerHTML = `${v}`
    }
    if (state.gameState === "isPaused") {
      c.style.opacity = "0"
    }
    cellElem.appendChild(c)
    cellsContainer.appendChild(cellElem)
    if (state.originCell.get(k) !== "0" && state.originCell.get(k)) {
      cellElem.classList.add("origin-cells")
    } else {
      cellElem.classList.remove("origin-cells")
      cellElem.classList.add("new-cells")
    }
    if (state.gameState === "isOvered" || state.gameState === "isPaused")
      cellElem.style.opacity = "0.3"
    renderNotes(state, cellElem)
  }
  board.appendChild(cellsContainer)
  drawBackground(state)
  return state
}

export function renderNotes(state: State, el: CellElement): State {
  let {notes, bounds} = state
  notes = [...new Set(notes)]
  const cellHeight = bounds().width / TOTAL_FILE
  const rows = 3 // in one Cell there will be 3 rows
  notes.map((h) => {
    const value = +h.slice(-1)
    const key = h.slice(0, 3) as unknown as Key
    if (!el.dataset.key?.startsWith(key) || el.dataset.value !== "0") return
    const [x, y] = getSquareNr(value)
    const noteElm = document.createElement("note") as CellElement
    noteElm.style.gridColumn = `${y}`
    noteElm.style.gridRow = `${x}`

    noteElm.innerHTML = `${value}`
    noteElm.style.fontSize = `${cellHeight / rows}px`
    noteElm.style.display = "flex"
    noteElm.style.alignItems = "center"
    noteElm.style.justifyContent = "center"
    noteElm.style.lineHeight = "1"
    el?.appendChild(noteElm)
  })
  return state
}
