import { events } from "./events";
import { render, renderNumpad, renderBase } from "./render";
import "./style.css";
import { Box, initState } from "./utils";

Box(initState()).map(renderBase).map(render).map(renderNumpad).map(events);
