import {numPadEvents, panelEvents} from "./events"
import {
  type CellElement,
  type Note,
  type Key,
  type State,
  type Value,
} from "./types"
import {
  getPositionFromBound,
  keyToPosition,
  getSquareNr,
  Box,
  memo,
  id,
  formatTime,
} from "./utils"

export function updateBounds(s: State): void {
  const bounds = s.wrap.getBoundingClientRect()
  const container = s.container
  let width =
    (Math.floor((bounds.width * window.devicePixelRatio) / 9) * 9) /
    window.devicePixelRatio
  width -= width * 0.3

  container.style.width = width + "px"
  container.style.height = width + "px"
  container.style.aspectRatio = "1 / 1"
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
  header.id = "aside"
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

export function renderPanel(state: State): State {
  const {aside, nav, buttons, bounds} = state
  const btns = [
    '<i class="fa-solid fa-play"></i>',
    '<i class="fa-solid fa-arrows-rotate"></i>',
    `<i class="fa-solid fa-x"></i>`,
    `<i class="fa-solid fa-pen"></i>`,
    `<i class="fa-solid fa-eye"></i>`,
  ]
  updateBounds(state)
  state.nav.innerHTML = ""
  aside.style.maxWidth = `${state.bounds().width}px`
  console.log(state.bounds().width)
  let counter = 0
  let lastChild: HTMLElement | null = null
  for (const [k, v] of buttons) {
    const btn = document.createElement("button")
    btn.style.height = `${bounds().height / 9}px`
    btn.style.width = `${bounds().width / 3 - 1}px`
    btn.id = `${v.replace(/\s/g, "-")}`.toLowerCase()
    btn.classList.add(k)

    btn.innerHTML = btns[counter++]
    btn.style.aspectRatio = `1 / 1`
    btn.classList.add("buttons")

    nav.append(btn)
    lastChild = btn
  }
  const timer = document.createElement("section")
  timer.style.height = `${bounds().height / 9}px`
  timer.style.width = `${bounds().width / 3 - 1}px`
  timer.classList.add("buttons")
  timer.classList.add("timer")
  timer.id = "timer"

  const timerText = document.createElement("p")

  if (!lastChild) {
    throw Error("Could found the button")
  }
  lastChild = nav.replaceChild(timer, lastChild)
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

export function renderCells(state: State): State {
  updateBounds(state)
  console.log(state.bounds().width / 9, "width")
  const {board, cells} = state
  board.innerHTML = ""
  if (state.gameState === "isOvered") renderGameOver(state)
  let counter = 0
  for (const [k, v] of cells) {
    const cellElem = document.createElement("cell") as CellElement
    const p = keyToPosition(k as Key)
    const pos = getPositionFromBound(state, p)
    if (counter % 2 === 0) {
      cellElem.className += "cell-right"
    } else {
      cellElem.className += "cell-left"
    }
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

    if (k.startsWith("a") || k.startsWith("d") || k.startsWith("g")) {
      cellElem.classList.add("vertical-lines-left")
    }

    if (k.startsWith("i")) {
      cellElem.classList.add("vertical-lines-right")
    }
    if (k[1] === "1" || k[1] === "4" || k[1] === "7") {
      cellElem.classList.add("horizontal-lines-top")
    }

    if (k[1] === "9") {
      cellElem.classList.add("horizontal-lines-bottom")
    }

    const c = document.createElement("p")
    c.style.gridArea = "2 / 2 / 3 / 3"

    if (v !== "0" && state.gameState !== "isInitialed") {
      c.innerHTML = `${v}`
    }
    if (state.gameState === "isPaused") {
      c.style.opacity = "0"
    }
    cellElem.appendChild(c)
    board.appendChild(cellElem)
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
  counter++
  return state
}
export const addNote = (state: State) => (value: Value) => {
  const notes = state.selected?.map((k) => `${k.slice(0, 2)}${value}` as Note)
  const f = new Set([...notes])
  const found = state.notes.filter((r) => f.has(r))
  if (found.length > 0) {
    state.notes = state.notes.filter((r) => !f.has(r))
    return
  }
  state.notes = [...new Set([...state.notes, ...notes])]
  state.notes = [...new Set([...state.notes])]
  state.notes = [
    ...state.notes,
    ...new Set(notes.filter((h, i) => state.notes[i] == h)),
  ]
}

export function renderNotes(state: State, el: CellElement): State {
  let {notes} = state
  notes = [...new Set(notes)]
  notes.map((h) => {
    const value = +h.slice(-1)
    const key = h.slice(0, 2) as unknown as Key
    if (!el.dataset.key?.startsWith(key) || el.dataset.value !== "0") return
    const [x, y] = getSquareNr(value)
    const noteElm = document.createElement("note") as CellElement
    noteElm.style.gridColumn = `${y} / 3`
    noteElm.style.gridRow = `${x} / 3`
    noteElm.innerHTML = `${value}`

    el?.appendChild(noteElm)
  })
  return state
}

export const createNumPad = (state: State): State => {
  const {bounds, numPad} = state
  numPad.innerHTML = ""

  for (const [k, i] of state.digits) {
    const el = document.createElement("button")
    el.classList.add("num")
    el.style.height = `${bounds().height / 9}px`
    el.dataset.value = `${i}`
    el.innerHTML = `${i}`
    el.dataset.key = `${k}`
    el.style.aspectRatio = `${1 / 1}`
    numPad.appendChild(el)
  }

  return state
}

export const renderNumpad = (state: State): State => {
  return Box(createNumPad(state)).map(numPadEvents).fold(id)
}

export const renderAside = (state: State) =>
  Box(state).map(renderNumpad).map(renderPanel).map(panelEvents).fold(id)

export const render = (state: State): State =>
  Box(state).map(renderCells).map(renderAside).fold(id)
