export const TOTAL_FILE = 9
export const TOTAL_RANK = TOTAL_FILE
export const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const
export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const
export const BOARD_SIZE = TOTAL_FILE

export const GAME_STATE = [
  "isInitialed",
  "isPaused",
  "isPlaying",
  "isOvered",
] as const

export const BTN_NAMES = [
  "start",
  "restart",
  "remove",
  "note",
  "hint",
  "undo",
] as const

export const buttonLabels = new Map()
buttonLabels.set("start", '<i class="fa-solid fa-play"></i>')
buttonLabels.set("restart", '<i class="fa-solid fa-arrows-rotate"></i>')
buttonLabels.set("remove", `<i class="fa-solid fa-x"></i>`)
buttonLabels.set("note", '<i class="fa-solid fa-pen"></i>')
buttonLabels.set("hint", `<i class="fa-solid fa-eye"></i>`)
buttonLabels.set("undo", `<i class="fa-solid fa-arrow-rotate-left"></i>`)
buttonLabels.set("pause", `<Si class="fa-solid fa-pause"></i>`)
