import Vector2 from "../Vector2.ts";

export type MouseInput = {
  pressed: boolean;
  position: Vector2;
};

export type KeyBindings = Record<string, () => void>;
export default class PlayerInput {
  #keysDown: Set<string> = new Set();
  #mouse: MouseInput = {
    pressed: false,
    position: new Vector2({
      x: 0,
      y: 0,
    }),
  };
  #keyBindings: KeyBindings = {};
  constructor() {
    addEventListener("keydown", this.#handleOnKey("keydown"));
    addEventListener("keyup", this.#handleOnKey("keyup"));
    addEventListener("keypress", this.#handleOnKey("keypress"));
    addEventListener("mousedown", this.#handleOnMouse("mousedown"));
    addEventListener("mouseup", this.#handleOnMouse("mouseup"));
    addEventListener("mousemove", this.#handleOnMouse("mousemove"));
  }

  setKeyBindings(keyBindings: KeyBindings) {
    this.#keyBindings = keyBindings;
  }

  #handleOnKey = (state: "keydown" | "keyup" | "keypress") => (event: KeyboardEvent) => {
    switch (state) {
      case "keydown":
        this.#keysDown.add(event.key);
        break;
      case "keyup":
        this.#keysDown.delete(event.key);
        break;
      case "keypress":
        this.#handleKeyPress(event.key);
        break;
    }
  };

  #handleKeyPress = (key: string) => {
    if (key in this.#keyBindings) {
      this.#keyBindings[key]();
    }
  };

  #handleOnMouse = (state: "mousedown" | "mouseup" | "mousemove") => (event: MouseEvent) => {
    switch (state) {
      case "mousedown":
        this.#mouse.pressed = true;
        break;
      case "mouseup":
        this.#mouse.pressed = false;
        break;
      case "mousemove":
        this.#mouse.position = new Vector2({ x: event.clientX, y: event.clientY });
        break;
    }
  };

  get mouse() {
    return this.#mouse;
  }

  get keysDown() {
    return this.#keysDown;
  }

  #upPressed(): 0 | -1 {
    return this.#keysDown.has("w") ? -1 : 0;
  }

  #downPressed(): 0 | 1 {
    return this.#keysDown.has("s") ? 1 : 0;
  }

  #leftPressed(): 0 | -1 {
    return this.#keysDown.has("a") ? -1 : 0;
  }

  #rightPressed(): 0 | 1 {
    return this.#keysDown.has("d") ? 1 : 0;
  }

  get direction(): Vector2 {
    return new Vector2(this.#leftPressed() + this.#rightPressed(), this.#upPressed() + this.#downPressed());
  }
}
