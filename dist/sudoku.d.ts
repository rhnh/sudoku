import { type API } from "./api";
import { type Config } from "./config";
import "./assets/themes.style.css";
import "./assets/style.css";
import "./assets/icon-fonts.css";
import "./assets/media-queries.css";
export { generateCells } from "./sudoku.algo";
export declare const sudoku: ({ root, levelEasy, currentTheme, squares, solutions, }: Config) => API;
