import { events } from "./events";
import { render } from "./render";
import "./style.css";
import { Box, initState } from "./utils";

Box(initState()).map(render).map(events);
