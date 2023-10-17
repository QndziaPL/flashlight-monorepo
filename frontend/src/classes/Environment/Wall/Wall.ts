import { Collider, Drawable } from "../../types/gameObjectTypes.ts";
import Vector2 from "../../Vector2.ts";

export type WallConstructorProps = {
  points: Vector2[];
};
export default class Wall implements Drawable, Collider {
  #points: WallConstructorProps["points"];
  readonly collider = true;
  constructor({ points }: WallConstructorProps) {
    this.#points = points;
  }

  get points() {
    return this.#points;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();

    this.#points.forEach(({ x, y }, index) => {
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.restore();
  }

  closestCollisionPoint(startPoint: Vector2, endPoint: Vector2): Vector2 | undefined {
    let closestIntersection: Vector2 | undefined;
    let closestDistance = Infinity;

    // Iterate through the wall's points to check for intersections with the ray
    for (let i = 0; i < this.#points.length; i++) {
      const p1 = this.#points[i];
      const p2 = this.#points[(i + 1) % this.#points.length]; // Wrap around to the first point

      const intersection = Vector2.IntersectionPoint(startPoint, endPoint, p1, p2);

      if (intersection) {
        // Calculate the distance from the ray's start point to the intersection
        const distance = intersection.distanceFromPoint(startPoint);

        // Update the closest intersection if this one is closer
        if (distance < closestDistance) {
          closestIntersection = intersection;
          closestDistance = distance;
        }
      }
    }

    return closestIntersection;
  }
}
