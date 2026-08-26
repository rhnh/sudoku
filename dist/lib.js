export const Box = (value) => ({
    map: (fn) => Box(fn(value)),
    fold: (fn) => fn(value),
    toString: (fn) => {
        console.info(value);
        return Box(fn(value));
    },
});
export const id = (x) => x;
export function memo(f) {
    let v;
    const ret = () => {
        if (v === undefined)
            v = f();
        return v;
    };
    ret.clear = () => {
        v = undefined;
    };
    return ret;
}
/**
 * https://www.typescriptlang.org/docs/handbook/dom-manipulation.html
 * @param SVGElementTagNameMap
 * @returns - a SVG
 */
export function createSvg({ tag, className, ...rest }) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", tag);
    className.split(" ").forEach((name) => svg.classList.add(name));
    Object.entries(rest).forEach(([name, value]) => {
        svg.setAttribute(name, value);
    });
    return svg;
}
/**
 * create new html element. Use space if you want to have multiple classname
 * @param Html Tag
 * @returns - a SVG
 */
export function createElement({ tag, className, ...rest }) {
    const el = document.createElement(tag);
    className.split(" ").forEach((name) => el.classList.add(name));
    Object.entries(rest).forEach(([name, value]) => {
        el.setAttribute(name, value);
    });
    return el;
}
export const createButton = ({}) => { };
//# sourceMappingURL=lib.js.map