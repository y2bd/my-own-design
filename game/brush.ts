namespace Actors {
  export const brushTexture = new ex.Texture("assets/brush_sprite.png");
  export const brushSpriteSheet = new ex.SpriteSheet(
    brushTexture,
    4,
    1,
    128,
    128
  );

  export enum BrushSprites {
    Leaves,
    Scopes,
    Sign,
    Rocks,
  }

  export class Brush extends ex.Actor {
    private spriteType: BrushSprites;
    private hoverShadow: ex.Actor;

    public constructor(defaultSpriteType?: BrushSprites) {
      super();

      if (defaultSpriteType !== undefined) {
        this.spriteType = defaultSpriteType;
      } else {
        this.spriteType = Math.floor(Math.random() * 4) as BrushSprites;
      }
    }

    public onInitialize(engine: ex.Engine) {
      this.hoverShadow = new ex.Actor();
      this.hoverShadow.onPostDraw = function (this: ex.Actor, ctx, delta) {
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.ellipse(2, 28, 32, 16, 0, 0, 2 * Math.PI);
        ctx.fill();
      };

      this.add(this.hoverShadow);

      this.addDrawing(BrushSprites.Leaves, brushSpriteSheet.getSprite(0));
      this.addDrawing(BrushSprites.Scopes, brushSpriteSheet.getSprite(1));
      this.addDrawing(BrushSprites.Sign, brushSpriteSheet.getSprite(2));
      this.addDrawing(BrushSprites.Rocks, brushSpriteSheet.getSprite(3));
      this.setDrawing(this.spriteType);

      this.body.useBoxCollider(86, 64);
      this.body.collider.type = ex.CollisionType.Fixed;
    }

    public onPostUpdate(engine: ex.Engine, delta: number) {}
  }
}
