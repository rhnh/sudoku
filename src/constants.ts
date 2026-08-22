//TODO: This need to be merge with BTN_ICONS
export const BTN_NAMES = [
  "start",
  "restart",
  "remove",
  "note",
  "hint",
  "undo",
] as const

export const BTN_ICONS = [
  '<i class="fa-solid fa-play"></i>',
  '<i class="fa-solid fa-arrows-rotate"></i>',
  `<i class="fa-solid fa-x"></i>`,
  `<i class="fa-solid fa-pen"></i>`,
  `<i class="fa-solid fa-eye"></i>`,
  `<i class="fa-solid fa-arrow-left"></i>`,
]

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
