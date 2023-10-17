import { v4 as uuid } from "uuid";
import { Movable, Shootable } from "./types/gameObjectTypes.ts";
import Vector2 from "./Vector2.ts";

export const DEFAULT_PLAYER_CONSTS = {
  movementSpeed: 500,
  sizeRadius: 10,
};

export type Flashlight = {
  radius: number;
  angle: number;
};
export type PlayerContructorProps = {
  name: string;
  initialPosition: Vector2;
  movementSpeed?: number;
  sizeRadius?: number;
  color?: string;
};
export default class Player implements Movable, Shootable {
  #id: string;
  #name: string;
  #position: Vector2;
  #movementSpeed: number;
  #sizeRadius: number;
  #color: string;
  #flashlight: Flashlight = {
    radius: 100,
    angle: 20,
  };
  constructor({
    name,
    initialPosition,
    movementSpeed = DEFAULT_PLAYER_CONSTS.movementSpeed,
    sizeRadius = DEFAULT_PLAYER_CONSTS.sizeRadius,
    color = "#0000FF",
  }: PlayerContructorProps) {
    this.#id = uuid();
    this.#name = name;
    this.#position = initialPosition;
    this.#movementSpeed = movementSpeed;
    this.#sizeRadius = sizeRadius;
    this.#color = color;
  }

  addFlashlightRadius(value: number) {
    this.#flashlight.radius += value;
  }

  addFlashlightAngle(value: number) {
    this.flashlight.angle += value;
  }

  get flashlight() {
    return this.#flashlight;
  }

  get name() {
    return this.#name;
  }

  get position() {
    return this.#position;
  }

  set position(position: Vector2) {
    this.#position = position;
  }

  get movementSpeed() {
    return this.#movementSpeed;
  }

  set movementSpeed(value: number) {
    this.#movementSpeed = value;
  }

  get id() {
    return this.#id;
  }

  get sizeRadius() {
    return this.#sizeRadius;
  }

  get color() {
    return this.#color;
  }

  shoot() {}

  move(vector: Vector2, deltaTime: number) {
    this.#position.x += vector.x * this.#movementSpeed * deltaTime;
    this.#position.y += vector.y * this.#movementSpeed * deltaTime;
  }
}
