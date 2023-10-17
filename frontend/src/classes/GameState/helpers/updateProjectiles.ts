import Projectile from "../../Projectile.ts";

export const updateProjectiles = (projectiles: Projectile[], deltaTime: number) => {
  const filteredProjectiles = projectiles.filter((projectile) => {
    projectile.move(deltaTime);
    return !projectile.outOfRange;
  });

  projectiles.length = 0;
  projectiles.push(...filteredProjectiles);
};
