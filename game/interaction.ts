namespace Actors {
  export const InteractionCollisionGroup = ex.CollisionGroupManager.create(
    "interaction"
  );

  export class Interaction extends ex.Actor {
    private cameraStrategy = new ex.ElasticToActorStrategy(this, 0.02, 0.6);

    public onInitialize(engine: ex.Engine) {
      this.body.useCircleCollider(340);
      this.body.collider.type = ex.CollisionType.Passive;
      this.body.collider.group = InteractionCollisionGroup;

      this.body.collider.on("collisionstart", (event) => {
        if (event.other.group.name === "mayor") {
          this.scene.camera.addStrategy(this.cameraStrategy);
        }
      });

      this.body.collider.on("collisionend", (event) => {
        if (event.other.group.name === "mayor") {
          this.scene.camera.removeStrategy(this.cameraStrategy);
        }
      });
    }

    public onPostUpdate(engine: ex.Engine, delta: number) {}
  }
}