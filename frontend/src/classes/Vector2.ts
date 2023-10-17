import { XYNumericValues } from "./GameState/GameState.ts";

export default class Vector2 {
  x: number;
  y: number;
  constructor({ x, y }: XYNumericValues);
  constructor(x: number, y: number);
  constructor(param1: any, param2?: any) {
    if (typeof param1 === "object") {
      this.x = param1.x;
      this.y = param1.y;
    } else {
      this.x = param1;
      this.y = param2;
    }
  }

  add(vector: Vector2): Vector2 {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector2): Vector2 {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const length = this.length;
    return new Vector2(this.x / length, this.y / length);
  }

  dot(vector: Vector2): number {
    return this.x * vector.x + this.y * vector.y;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  static get zero(): Vector2 {
    return new Vector2(0, 0);
  }

  distanceFromPoint(point: Vector2): number {
    const distance = this.subtract(point);
    return distance.length;
  }

  static ClosestPoint(relativeTo: Vector2, points: Vector2[]): Vector2 | undefined {
    if (!points.length) return undefined;

    let closestPoint = points[0];
    let closestDistance = relativeTo.distanceFromPoint(points[0]);

    for (let i = 1; i < points.length; i++) {
      const distance = relativeTo.distanceFromPoint(points[i]);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = points[i];
      }
    }

    return closestPoint;
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

  static CreateMany(...props: XYNumericValues[]): Vector2[] {
    return props.map((p) => new Vector2(p.x, p.y));
  }
  /**
   * Check if two line segments defined by points (p1, p2) and (q1, q2) intersect.
   * @param p1 - Start point of the first line segment.
   * @param p2 - End point of the first line segment.
   * @param q1 - Start point of the second line segment.
   * @param q2 - End point of the second line segment.
   * @returns Vector2 if the line segments intersect, undefined otherwise.
   */
  static IntersectionPoint(p1: Vector2, p2: Vector2, q1: Vector2, q2: Vector2): Vector2 | undefined {
    const dx1 = p2.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dx2 = q2.x - q1.x;
    const dy2 = q2.y - q1.y;

    const crossProduct = dx1 * dy2 - dx2 * dy1;

    if (Math.abs(crossProduct) < 1e-6) {
      return undefined; // The line segments are parallel
    }

    const t1 = ((q1.x - p1.x) * dy2 - (q1.y - p1.y) * dx2) / crossProduct;
    const t2 = ((q1.x - p1.x) * dy1 - (q1.y - p1.y) * dx1) / crossProduct;

    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
      const intersectionX = p1.x + t1 * dx1;
      const intersectionY = p1.y + t1 * dy1;

      return new Vector2(intersectionX, intersectionY);
    }

    return undefined;
  }

  static closestPointOnLineSegment(point: Vector2, lineStart: Vector2, lineEnd: Vector2): Vector2 {
    const line = lineEnd.subtract(lineStart);
    const lenSquared = line.x * line.x + line.y * line.y;

    if (lenSquared === 0) {
      // Line segment is just a point, so return the start point
      return lineStart.clone();
    }

    // Calculate the projection of "point" onto the line
    const t = Math.max(0, Math.min(1, point.subtract(lineStart).dot(line) / lenSquared));

    // Calculate the closest point on the line segment
    const closestPoint = lineStart.add(line.multiply(t));

    return closestPoint;
  }
}
