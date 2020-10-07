namespace Actors {
  export class Dialogue extends ex.ScreenElement {
    public static Instance = new Dialogue();

    private topLabel: ex.Label;
    private bottomLabel: ex.Label;

    private topCancellationToken: (() => void) | undefined;
    private bottomCancellationToken: (() => void) | undefined;

    protected constructor() {
      super();
    }

    onInitialize(engine: ex.Engine) {
      this.topLabel = new ex.Label("", engine.halfDrawWidth, 200, "Averia Serif Libre");
      this.topLabel.color = ex.Color.White;
      this.topLabel.textAlign = ex.TextAlign.Center;
      this.topLabel.fontSize = 44;
      this.topLabel.opacity = 0.85;

      const baseDraw = this.topLabel.draw.bind(this.topLabel);
      this.topLabel.draw = function(ctx, delta) {
        ctx.shadowColor = "#39C";
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 8;
        ctx.imageSmoothingEnabled = false;

        baseDraw(ctx, delta);
      };

      this.bottomLabel = new ex.Label(
        "",
        engine.halfDrawWidth,
        engine.drawHeight - 200,
        "Volkorn"
      );
      this.bottomLabel.color = ex.Color.Orange;
      this.bottomLabel.textAlign = ex.TextAlign.Center;
      this.bottomLabel.fontSize = 44;

      this.add(this.topLabel);
      this.add(this.bottomLabel);
    }

    public setTop(text: string) {
      this.topLabel.text = "";
      this.topCancellationToken = queueProgression(this.topLabel, this.topLabel.pos.x, this.topLabel.pos.y, text);
    }

    public clearAll() {
      this.topCancellationToken?.();

      this.topLabel.text = "";
      this.bottomLabel.text = "";
    }
  }

  function queueProgression(label: ex.Label, startX: number, startY: number, remainingText: string) {
    let cancelled = false;
    function progressLabel(label: ex.Label, startX: number, startY: number, remainingText: string) {
      if (cancelled) {
        label.text = "";
        label.pos.x = startX;
        label.pos.y = startY;
        return;
      }

      if (remainingText.length <= 0) {
        label.pos.x = startX;
        label.pos.y = startY;
        return;
      }
  
      const existingText = label.text.length === 0 ? "" : label.text.substring(1, label.text.length - 1);
      label.text = `"${existingText + remainingText[0]}"`;
      remainingText = remainingText.slice(1);
  
      label.pos.x = startX + 3 - Math.random() * 6;
      label.pos.y = startY + 2 - Math.random() * 4;
  
      setTimeout(
        () => requestAnimationFrame(() => progressLabel(label, startX, startY, remainingText)),
        60
      );
    }

    progressLabel(label, startX, startY, remainingText);
    return () => cancelled = true;
  }

  
}
