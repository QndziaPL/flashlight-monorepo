import Projectile from "../../Projectile.ts";
import GameState from "../GameState.ts";
import Vector2 from "../../../../../shared/classes/Vector2.ts";

export const shoot = (gameState: GameState) => {
  const playerPosition = gameState.players[0].position.clone();
  const vector = new Vector2(gameState.playerInput.mouse.position.x, gameState.playerInput.mouse.position.y).subtract(
    new Vector2(playerPosition.x, playerPosition.y),
  );
  const normalized = vector.normalize();
  gameState.addProjectile(new Projectile({ position: playerPosition, velocity: normalized }));
};
