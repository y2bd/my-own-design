namespace Actors {
  export const wagonTexture = new ex.Texture("assets/wagon_sprite.png");
  export const wagonSpriteSheet = new ex.SpriteSheet(wagonTexture, 2, 2, 128, 128);

  export class Wagon extends ex.Actor {
    private hoverShadow: ex.Actor;
    public onInitialize(engine: ex.Engine) {
      this.hoverShadow = new ex.Actor();
      this.hoverShadow.onPostDraw = function (this: ex.Actor, ctx, delta) {
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.ellipse(0, 40, 60, 22, 0, 0, 2 * Math.PI);
        ctx.fill();
      };

      this.add(this.hoverShadow);

      this.addDrawing("idle", wagonSpriteSheet.getAnimationForAll(engine, 250));
      this.setDrawing("idle");

      this.body.useBoxCollider(102, 82);
      this.body.collider.type = ex.CollisionType.Fixed;
    }

    public onPostUpdate(engine: ex.Engine, delta: number) {}
  }
}
