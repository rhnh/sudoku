import type {BTN_NAMES, FILES, GAME_STATE, RANKS} from "./constants"

export type File = (typeof FILES)[number]
export type Rank = (typeof RANKS)[number]
export type Position = [number, number]
export type BaseKey = `${File}${Rank}`
export type MouchEvent = MouseEvent | TouchEvent

export type ButtonTexts = (typeof BTN_NAMES)[number]

export type Buttons = Map<Key, ButtonTexts>
export type Note = `${BaseKey}${Rank}`
export type Notes = Map<Key, Set<Value>>
export type Key = `${BaseKey}${Rank}`

export type GameState = (typeof GAME_STATE)[number]

export type Value = Rank | "0"

export type Squares = Map<Key, Value>

export type Digits = Map<BaseKey, Value>
