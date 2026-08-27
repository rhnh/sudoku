export type Box<T> = {
    map: <U>(fn: (x: T) => U) => Box<U>;
    fold: <R>(fn: (x: T) => R) => R;
    toString: <U>(fn: (x: T) => U) => Box<U>;
};
export declare const Box: <T>(value: T) => Box<T>;
export interface Memo<A> {
    (): A;
    clear: () => void;
}
export declare const id: <T>(x: T) => T;
export declare function memo<A>(f: () => A): Memo<A>;
/**
 * https://www.typescriptlang.org/docs/handbook/dom-manipulation.html
 * @param SVGElementTagNameMap
 * @returns - a SVG
 */
export declare function createSvg<K extends keyof SVGElementTagNameMap>({ tag, className, ...rest }: {
    tag: K;
    className: string;
} & Record<string, string>): SVGElementTagNameMap[K];
/**
 * create new html element. Use space if you want to have multiple classname
 * @param Html Tag
 * @returns - a SVG
 */
export declare function createElement<K extends keyof HTMLElementTagNameMap>({ tag, className, ...rest }: {
    tag: K;
    className: string;
} & Record<string, string>): HTMLElementTagNameMap[K];
export declare const createButton: ({ className, ...rest }: {
    className: string;
} & Record<string, string>) => HTMLButtonElement;
