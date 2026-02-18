import "./style.css"
import "./media-queries.css"
import {events, keyEvents, numPadEvents} from "./events"
import {render, renderBase} from "./render"
import {Box} from "./utils"
import {initState} from "./game"

Box(initState())
  .map(renderBase)
  .map(render)
  .map(events)
  .map(numPadEvents)
  .map(keyEvents)
