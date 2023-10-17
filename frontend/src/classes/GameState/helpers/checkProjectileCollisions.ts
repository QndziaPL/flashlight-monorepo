import Projectile from "../../Projectile.ts";
import Environment from "../../Environment/Environment.ts";
import { Collider } from "../../types/gameObjectTypes.ts";
import Vector2 from "../../Vector2.ts";

const COLLISION_MARGIN = 0.3;
export const checkProjectileCollisions = (projectiles: Projectile[], environment: Environment) => {
  projectiles.forEach((projectile) => {
    const colliders = environment.drawables.filter((drawable) => Collider.isCollider(drawable));
    colliders.forEach((collider) => {
      const colliderPoints = collider.points;
      const numberOfPoints = colliderPoints.length;

      for (let i = 0; i < numberOfPoints; i++) {
        const p1 = new Vector2(colliderPoints[i]);
        const p2Index = (i + 1) % numberOfPoints;
        const p2 = new Vector2(colliderPoints[p2Index]);

        const projectileVector = new Vector2(projectile.position);
        // Calculate the closest point on the line segment to the projectile
        const closestPoint = Vector2.closestPointOnLineSegment(projectileVector, p1, p2);

        // Calculate the distance between the projectile's position and the closest point
        const distance = projectileVector.distanceFromPoint(closestPoint);

        // Check if the distance is less than or equal to the projectile's radius
        if (distance <= projectile.radius + COLLISION_MARGIN) {
          // Calculate the angle of the wall segment at the point of collision
          const wallAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

          // Calculate the normal vector based on the wall's angle
          const normal = new Vector2(Math.cos(wallAngle - Math.PI / 2), Math.sin(wallAngle - Math.PI / 2));

          // Use the normal vector for reflection calculations
          const velocity = projectile.velocity;
          const newVelocity = velocity.subtract(normal.multiply(2 * velocity.dot(normal)));

          const newPosition = closestPoint.add(normal.multiply(projectile.radius + COLLISION_MARGIN));
          projectile.position = newPosition;

          const debug = false;
          if (debug) {
            console.log(
              `Collision detected at distance: ${distance}, radius: ${projectile.radius}, margin: ${COLLISION_MARGIN}`,
            );
            console.log(`Projectile velocity before collision: x=${projectile.velocity.x}, y=${projectile.velocity.y}`);
            console.log(`New velocity after reflection: x=${newVelocity.x}, y=${newVelocity.y}`);
            console.log(`Normal vector: x=${normal.x}, y=${normal.y}`);
          }

          projectile.velocity = newVelocity;
        }
      }
    });
  });
};
