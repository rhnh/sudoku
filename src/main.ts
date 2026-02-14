import {events, keyEvents, numPadEvents} from "./events"
import {render, renderBase} from "./render"
import "./style.css"
import {Box, initState} from "./utils"

Box(initState())
  .map(renderBase)
  .map(render)
  .map(events)
  .map(numPadEvents)
  .map(keyEvents)
