namespace Actors {
  export const InteractionCollisionGroup = ex.CollisionGroupManager.create(
    "interaction"
  );

  export class Interaction extends ex.Actor {
    private cameraStrategy = new ex.ElasticToActorStrategy(this, 0.02, 0.66);

    public onInitialize(engine: ex.Engine) {
      this.body.useCircleCollider(340);
      this.body.collider.type = ex.CollisionType.Passive;
      this.body.collider.group = InteractionCollisionGroup;

      this.body.collider.on("collisionstart", (event) => {
        if (event.other.group.name === "mayor") {
          this.scene.camera.addStrategy(this.cameraStrategy);
          document.querySelector('.overlay')?.classList.add('focus');

          Actors.Dialogue.Instance.setTop("i'm not supposed to talk to strangers");
        }
      });

      this.body.collider.on("collisionend", (event) => {
        if (event.other.group.name === "mayor") {
          this.scene.camera.removeStrategy(this.cameraStrategy);
          document.querySelector('.overlay')?.classList.remove('focus');

          Actors.Dialogue.Instance.clearAll();
        }
      });
    }

    public onPostUpdate(engine: ex.Engine, delta: number) {}
  }
}
