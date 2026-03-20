/**
 * Typ für einen 2D-Punkt.
 * @example
 * const point: Point2D = { x: 100, y: 100 };
 */
export type Point2D = { x: number; y: number };

export function createPoint2D(x: number, y: number): Point2D {
    return { x, y };
}

export function getX(point: Point2D): number {
    return point.x;
}

export function getY(point: Point2D): number {
    return point.y;
}