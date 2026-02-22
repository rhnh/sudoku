import "./style.css"
import {events, keyEvents} from "./events"
import {render, renderBase} from "./render"
import {Box} from "./utils"
import {initState} from "./game"

Box(initState()).map(renderBase).map(render).map(events).map(keyEvents)
