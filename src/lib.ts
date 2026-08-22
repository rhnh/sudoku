export type Box<T> = {
  map: <U>(fn: (x: T) => U) => Box<U>
  fold: <R>(fn: (x: T) => R) => R
  toString: () => T
}

export const Box = <T>(value: T): Box<T> => ({
  map: (fn) => Box(fn(value)),
  fold: (fn) => fn(value),
  toString: (): T => {
    return value
  },
})

export interface Memo<A> {
  (): A
  clear: () => void
}

export const id = <T>(x: T) => x

export function memo<A>(f: () => A): Memo<A> {
  let v: A | undefined
  const ret = (): A => {
    if (v === undefined) v = f()
    return v
  }
  ret.clear = () => {
    v = undefined
  }
  return ret
}

/**
 * https://www.typescriptlang.org/docs/handbook/dom-manipulation.html
 * @param SVGElementTagNameMap
 * @returns - a SVG
 */
export function createSvg<K extends keyof SVGElementTagNameMap>({
  tag,
  className,
  ...rest
}: {
  tag: K
  className: string
} & Record<string, string>): SVGElementTagNameMap[K] {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", tag)
  svg.classList.add(className)
  Object.entries(rest).forEach(([name, value]) => {
    svg.setAttribute(name, value)
  })
  return svg
}

/**
 * @param Html Tag
 * @returns - a SVG
 */
export function createElement<K extends keyof HTMLElementTagNameMap>({
  tag,
  className,
  ...rest
}: {
  tag: K
  className: string
} & Record<string, string>): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  el.classList.add(className)
  Object.entries(rest).forEach(([name, value]) => {
    el.setAttribute(name, value)
  })
  return el
}
