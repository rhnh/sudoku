import { type State } from "./state";
/**
 *
 * @param
 * @returns
 */
export declare function drawLine({ x1, x2, y1, y2, key, strokeWidth, className, }: {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    key: string;
    strokeWidth?: number;
    className: string;
}): SVGLineElement;
export declare const drawHorizontalLines: ({ svg, size, }: {
    size: number;
    svg: SVGElement;
}) => void;
export declare const drawVerticalLines: ({ svg, size, }: {
    size: number;
    svg: SVGElement;
}) => void;
export declare function renderGrid(state: State): State;
