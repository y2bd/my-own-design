namespace Actors {
  export const mayorTexture = new ex.Texture("assets/mayor_sprite.png");
  export const mayorSpritesheet = new ex.SpriteSheet(mayorTexture, 2, 1, 128, 128);

  export class Mayor extends ex.Actor {
    private static moveSpeed = 128 * 1.5;

    private static hoverTimeMs = 2400;
    private hoverElapsedTime = 0;
    private internalActor: ex.Actor;
    private hoverShadow: ex.Actor;

    private facingRight = true;
    private facingDown = true;

    constructor() {
      super();
    }

    public onInitialize(engine: ex.Engine) {
      this.hoverShadow = new ex.Actor();
      this.hoverShadow.onPostDraw = function (this: ex.Actor, ctx, delta) {
        ctx.fillStyle = 'white';
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.ellipse(0, 76, 24, 12, 0, 0, 2 * Math.PI);
        ctx.fill();
      };

      this.add(this.hoverShadow);
      
      // we do this internal actor nonsense for the hovering animation
      this.internalActor = new ex.Actor();
      this.internalActor.addDrawing("front", mayorSpritesheet.getSprite(0));
      this.internalActor.addDrawing("back", mayorSpritesheet.getSprite(1));
      this.add(this.internalActor);

      // do this last
      this.body.useBoxCollider(96, 128);
      this.body.collider.type = ex.CollisionType.Active;
      this.body.collider.group = ex.CollisionGroupManager.create('mayor');
    }

    public onPostUpdate(engine: ex.Engine, delta: number) {
      if (engine.input.keyboard.isHeld(ex.Input.Keys.A)) {
        this.vel.x = -Mayor.moveSpeed;
        this.facingRight = false;
      } else if (engine.input.keyboard.isHeld(ex.Input.Keys.D)) {
        this.vel.x = Mayor.moveSpeed;
        this.facingRight = true;
      } else {
        this.vel.x = 0;
      }

      if (engine.input.keyboard.isHeld(ex.Input.Keys.W)) {
        this.vel.y = -Mayor.moveSpeed;
        this.facingDown = false;
      } else if (engine.input.keyboard.isHeld(ex.Input.Keys.S)) {
        this.vel.y = Mayor.moveSpeed;
        this.facingDown = true;
      } else {
        this.vel.y = 0;
      }

      this.internalActor.setDrawing(this.facingDown ? 'front' : 'back');
      this.scale.x = this.facingRight ? (this.facingDown ? 1 : -1) : (this.facingDown ? -1 : 1);

      if (this.vel.y !== 222) {
        // do the hovering only when not moving vertically
        // otherwise it looks like you're floating in a sine wave
        this.hover(delta);
      }
    }

    private hover(delta: number) {
      const cosWave = (Math.cos((2 * Math.PI * this.hoverElapsedTime / Mayor.hoverTimeMs)));
      this.internalActor.pos.y = 12 * cosWave;
      this.hoverShadow.opacity = 0.2 + 0.25 * ((1 + cosWave) / 2);

      this.hoverElapsedTime += delta;
      if (this.hoverElapsedTime > Mayor.hoverTimeMs) {
        this.hoverElapsedTime = 0;
      }
    }
  }
}
