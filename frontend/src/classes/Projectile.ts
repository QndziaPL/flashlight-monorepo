import { Movable } from "./types/gameObjectTypes.ts";
import Vector2 from "./Vector2.ts";

export type ProjectileConstructorProps = {
  position: Vector2;
  velocity: Vector2;
  movementSpeed?: number;
  range?: number;
  radius?: number;
};
export default class Projectile implements Movable {
  #position: Vector2;
  #velocity: Vector2;
  #movementSpeed: number;
  #range: number;
  #rangeTravelled: number = 0;
  #radius: number;

  constructor({ position, velocity, movementSpeed = 1000, range = 5000, radius = 5 }: ProjectileConstructorProps) {
    this.#position = position;
    this.#velocity = velocity;
    this.#movementSpeed = movementSpeed;
    this.#range = range;
    this.#radius = radius;
  }

  get velocity() {
    return this.#velocity;
  }

  set velocity(velocity: Vector2) {
    this.#velocity = velocity;
  }

  get radius() {
    return this.#radius;
  }

  get movementSpeed() {
    return this.#movementSpeed;
  }

  set movementSpeed(value: number) {
    this.#movementSpeed = value;
  }

  get outOfRange() {
    return this.#rangeTravelled >= this.#range;
  }

  get position() {
    return this.#position;
  }

  set position(value: Vector2) {
    this.#position = value;
  }

  move(deltaTime: number) {
    const startPoint = new Vector2(this.#position.x, this.#position.y);
    this.#position.x += this.#velocity.x * this.#movementSpeed * deltaTime;
    this.#position.y += this.#velocity.y * this.#movementSpeed * deltaTime;
    const destinationPoint = new Vector2(this.#position.x, this.#position.y);
    const distanceTravelled = destinationPoint.distanceFromPoint(startPoint);
    this.#rangeTravelled += distanceTravelled;
  }
}
