export const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
export const FILES = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const;

export const GAME_STATES = ["idle", "play", "pause", "over"] as const;
export const OVERLAYS = ["info", "theme", "settings"] as const;
export const themes = [
  "gruvbox",
  "cobolt2",
  "paper",
  "dracula",
  "monokai",
  "tokyo-night",
  "omni",
] as const;

export const modes = ["zen-mode"] as const;

export const BOARD_SIZE = 9;

export const PLAY_MODE_BTNS = [
  "sudoku-play",
  "sudoku-pause",
  "sudoku-restart",
  "sudoku-remove",
  "sudoku-note",
  "sudoku-hint",
  "sudoku-undo",
  "sudoku-zen",
  "sudoku-info",
  "sudoku-themes",
] as const;

export const IDLE_MODE_BTNS = [
  "sudoku-play",
  "sudoku-restart",
  "sudoku-zen",
  "sudoku-themes",
  "sudoku-info",
  "sudoku-setting",
] as const;

export const LEVELS = ["easy", "med", "hard"] as const;

export const DIGITS = RANKS;

export const shortcutKeysArray: [string, string][] = [
  ["n", "toggle notes"],
  ["u", "Undo the last move"],
  ["Backspace/Delete/0", "Delete a number"],
  ["1-9", "Number 1 to 9"],
  ["space", "Start the game"],
  ["r", "Restart"],
  ["z", "Zen Mode"],
  ["i", "Show info"],
];
