namespace Worlds {
  export class World extends ex.Scene {
    public onInitialize(engine: ex.Engine) {
      const mayor = new Actors.Mayor();
      mayor.pos.x = engine.halfDrawWidth;
      mayor.pos.y = engine.halfDrawHeight;
      this.add(mayor);

      const leaves = new Actors.Brush(Actors.BrushSprites.Leaves);
      leaves.pos.x = engine.drawWidth;
      leaves.pos.y = engine.halfDrawHeight * 1.5;
      this.addInteractable(leaves);

      const scopes = new Actors.Brush(Actors.BrushSprites.Scopes);
      scopes.pos.x = engine.halfDrawWidth;
      scopes.pos.y = engine.drawHeight * 1.5;
      this.addInteractable(scopes);

      const wagon = new Actors.Wagon();
      wagon.pos.x = engine.drawWidth * 1.75;
      wagon.pos.y = engine.drawHeight * 1.75;
      this.addInteractable(wagon);

      const dialogue = Actors.Dialogue.Instance;
      this.addInteractable(dialogue);

      this.camera.strategy.elasticToActor(mayor, 0.02, 0.3);
    }

    private addInteractable(actor: ex.Actor) {
      const interaction = new Actors.Interaction();
      interaction.pos.x = actor.pos.x;
      interaction.pos.y = actor.pos.y;

      this.add(actor);
      this.add(interaction);
    }
  }
}