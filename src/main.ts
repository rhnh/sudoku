import { sudoku } from "./sudoku";
import { generateCells } from "./sudoku.algo";

const root = document.getElementById("app");
if (!root) {
  throw new Error("root not found");
}
const { cells, solutions } = generateCells(37);

sudoku({
  solutions,
  squares: cells,
  root,
  levelEasy: 1,
  currentTheme: "gruvbox",
  maxWidth: 500,
});
