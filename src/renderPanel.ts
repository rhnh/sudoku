import {BTN_ICONS, TOTAL_FILE} from "./constants"
import {createElement} from "./lib"
import {State} from "./state"
import {formatTime} from "./utils"

export function createSideLayout() {
  const numPad = document.createElement("numpad")
  numPad.id = "numpad"

  const aside = document.createElement("section")
  aside.id = "aside"
  const nav = document.createElement("article")
  nav.classList.add("panel")
  nav.id = "panel"
  const content = createElement({tag: "section", className: "content"})
  content.appendChild(nav)
  content.appendChild(numPad)

  const buttonSection = createElement({
    tag: "section",
    className: "s-btn-section",
  })

  const zen = createElement({
    tag: "button",
    className: "zen-btn btn rotate-btn",
  })
  zen.innerText = "zen"

  const info = createElement({
    tag: "button",
    className: "info-btn btn rotate-btn",
  })
  info.innerText = "info"

  const easy = createElement({
    tag: "button",
    className: "easy-btn btn rotate-btn",
  })
  easy.innerHTML = `●○○○<span class="tooltiptext">Tooltip text</span>`
  const medium = createElement({
    tag: "button",
    className: "medium-btn btn rotate-btn",
  })
  medium.innerHTML = `●●○○<span class="tooltiptext">Tooltip text</span>`
  const hard = createElement({
    tag: "button",
    className: "hard-btn btn rotate-btn",
  })
  hard.innerHTML = `●●●○<span class="tooltiptext">Tooltip text</span>`
  const expert = createElement({
    tag: "button",
    className: "expert-btn btn rotate-btn",
  })

  expert.innerHTML = `●●●●<span class="tooltiptext">Tooltip text</span>`

  const setting = createElement({
    tag: "button",
    className: "setting-btn btn rotate-btn",
  })

  setting.innerText = "setting"

  const themes = createElement({
    tag: "button",
    className: "themes-btn btn rotate-btn",
  })

  themes.innerText = "themes"

  zen.addEventListener("click", () => {
    content.classList.toggle("zen")
  })

  buttonSection.appendChild(zen)
  buttonSection.append(expert, hard, medium, easy, themes)
  aside.appendChild(buttonSection)
  aside.append(content)
  return {numPad, aside, nav}
}

export const renderBTNSection = (state: State): HTMLElement => {
  const {buttons, bounds} = state

  let btnsIndex = 0
  const btnSection = document.createElement("section")
  btnSection.classList.add("btn-section")
  for (const [k, v] of buttons) {
    const btn = document.createElement("button")
    btn.style.height = `${bounds().height / 9}px`
    btn.style.width = `${bounds().height / 9}px`
    // btn.style.width = `${bounds().width / 3 - 1}px`
    btn.id = `${v.replace(/\s/g, "-")}`.toLowerCase()
    btn.classList.add(k)

    btn.innerHTML = BTN_ICONS[btnsIndex++]
    btn.style.aspectRatio = `1`
    btn.classList.add("buttons")

    btnSection.append(btn)
  }
  return btnSection
}

export const renderTimer = (state: State) => {
  const {bounds} = state
  const RATIO = 3
  const timer = document.createElement("section")
  timer.style.height = `${bounds().height / TOTAL_FILE}px`
  timer.style.width = `${bounds().height / RATIO}px`
  // timer.style.width = `${bounds().width / 3 - 1}px`
  timer.classList.add("timer-section")
  timer.id = "timer"

  const timerText = document.createElement("span")
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
