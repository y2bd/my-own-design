/// <reference path="../node_modules/excalibur/dist/excalibur.d.ts" />

const game = new ex.Engine({
  width: 1200,
  height: 900,
  backgroundColor: new ex.Color(25, 26, 28)
});

game.isDebug = false;
ex.Physics.enabled = true;
ex.Physics.collisionResolutionStrategy = ex.CollisionResolutionStrategy.Box;

game.setAntialiasing(false);

// create an asset loader
const loader = new ex.Loader();
const resources = {
  txMayor: Actors.mayorTexture,
  txBrush: Actors.brushTexture,
  txWagon: Actors.wagonTexture
} as const;

// queue resources for loading
for (const r in resources) {
  loader.addResource(resources[r]);
}

// uncomment loader after adding resources
game.start(loader).then(() => {
  const world = new Worlds.World(game);

  game.addScene('world', world);
  game.goToScene('world');
});
