var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Actors;
(function (Actors) {
    Actors.InteractionCollisionGroup = ex.CollisionGroupManager.create("interaction");
    var Interaction = /** @class */ (function (_super) {
        __extends(Interaction, _super);
        function Interaction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.cameraStrategy = new ex.ElasticToActorStrategy(_this, 0.02, 0.6);
            return _this;
        }
        Interaction.prototype.onInitialize = function (engine) {
            var _this = this;
            this.body.useCircleCollider(340);
            this.body.collider.type = ex.CollisionType.Passive;
            this.body.collider.group = Actors.InteractionCollisionGroup;
            this.body.collider.on("collisionstart", function (event) {
                if (event.other.group.name === "mayor") {
                    _this.scene.camera.addStrategy(_this.cameraStrategy);
                }
            });
            this.body.collider.on("collisionend", function (event) {
                if (event.other.group.name === "mayor") {
                    _this.scene.camera.removeStrategy(_this.cameraStrategy);
                }
            });
        };
        Interaction.prototype.onPostUpdate = function (engine, delta) { };
        return Interaction;
    }(ex.Actor));
    Actors.Interaction = Interaction;
})(Actors || (Actors = {}));
var Actors;
(function (Actors) {
    Actors.mayorTexture = new ex.Texture("assets/mayor_sprite.png");
    Actors.mayorSpritesheet = new ex.SpriteSheet(Actors.mayorTexture, 2, 1, 128, 128);
    var Mayor = /** @class */ (function (_super) {
        __extends(Mayor, _super);
        function Mayor() {
            var _this = _super.call(this) || this;
            _this.hoverElapsedTime = 0;
            _this.facingRight = true;
            _this.facingDown = true;
            return _this;
        }
        Mayor.prototype.onInitialize = function (engine) {
            this.hoverShadow = new ex.Actor();
            this.hoverShadow.onPostDraw = function (ctx, delta) {
                ctx.fillStyle = 'white';
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.ellipse(0, 76, 24, 12, 0, 0, 2 * Math.PI);
                ctx.fill();
            };
            this.add(this.hoverShadow);
            // we do this internal actor nonsense for the hovering animation
            this.internalActor = new ex.Actor();
            this.internalActor.addDrawing("front", Actors.mayorSpritesheet.getSprite(0));
            this.internalActor.addDrawing("back", Actors.mayorSpritesheet.getSprite(1));
            this.add(this.internalActor);
            // do this last
            this.body.useBoxCollider(96, 128);
            this.body.collider.type = ex.CollisionType.Active;
            this.body.collider.group = ex.CollisionGroupManager.create('mayor');
        };
        Mayor.prototype.onPostUpdate = function (engine, delta) {
            if (engine.input.keyboard.isHeld(ex.Input.Keys.A)) {
                this.vel.x = -Mayor.moveSpeed;
                this.facingRight = false;
            }
            else if (engine.input.keyboard.isHeld(ex.Input.Keys.D)) {
                this.vel.x = Mayor.moveSpeed;
                this.facingRight = true;
            }
            else {
                this.vel.x = 0;
            }
            if (engine.input.keyboard.isHeld(ex.Input.Keys.W)) {
                this.vel.y = -Mayor.moveSpeed;
                this.facingDown = false;
            }
            else if (engine.input.keyboard.isHeld(ex.Input.Keys.S)) {
                this.vel.y = Mayor.moveSpeed;
                this.facingDown = true;
            }
            else {
                this.vel.y = 0;
            }
            this.internalActor.setDrawing(this.facingDown ? 'front' : 'back');
            this.scale.x = this.facingRight ? (this.facingDown ? 1 : -1) : (this.facingDown ? -1 : 1);
            if (this.vel.y !== 222) {
                // do the hovering only when not moving vertically
                // otherwise it looks like you're floating in a sine wave
                this.hover(delta);
            }
        };
        Mayor.prototype.hover = function (delta) {
            var cosWave = (Math.cos((2 * Math.PI * this.hoverElapsedTime / Mayor.hoverTimeMs)));
            this.internalActor.pos.y = 12 * cosWave;
            this.hoverShadow.opacity = 0.2 + 0.25 * ((1 + cosWave) / 2);
            this.hoverElapsedTime += delta;
            if (this.hoverElapsedTime > Mayor.hoverTimeMs) {
                this.hoverElapsedTime = 0;
            }
        };
        Mayor.moveSpeed = 128 * 1.5;
        Mayor.hoverTimeMs = 2400;
        return Mayor;
    }(ex.Actor));
    Actors.Mayor = Mayor;
})(Actors || (Actors = {}));
var Actors;
(function (Actors) {
    Actors.brushTexture = new ex.Texture("assets/brush_sprite.png");
    Actors.brushSpriteSheet = new ex.SpriteSheet(Actors.brushTexture, 4, 1, 128, 128);
    var BrushSprites;
    (function (BrushSprites) {
        BrushSprites[BrushSprites["Leaves"] = 0] = "Leaves";
        BrushSprites[BrushSprites["Scopes"] = 1] = "Scopes";
        BrushSprites[BrushSprites["Sign"] = 2] = "Sign";
        BrushSprites[BrushSprites["Rocks"] = 3] = "Rocks";
    })(BrushSprites = Actors.BrushSprites || (Actors.BrushSprites = {}));
    var Brush = /** @class */ (function (_super) {
        __extends(Brush, _super);
        function Brush(defaultSpriteType) {
            var _this = _super.call(this) || this;
            if (defaultSpriteType !== undefined) {
                _this.spriteType = defaultSpriteType;
            }
            else {
                _this.spriteType = Math.floor(Math.random() * 4);
            }
            return _this;
        }
        Brush.prototype.onInitialize = function (engine) {
            this.hoverShadow = new ex.Actor();
            this.hoverShadow.onPostDraw = function (ctx, delta) {
                ctx.fillStyle = 'white';
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.ellipse(2, 28, 32, 16, 0, 0, 2 * Math.PI);
                ctx.fill();
            };
            this.add(this.hoverShadow);
            this.addDrawing(BrushSprites.Leaves, Actors.brushSpriteSheet.getSprite(0));
            this.addDrawing(BrushSprites.Scopes, Actors.brushSpriteSheet.getSprite(1));
            this.addDrawing(BrushSprites.Sign, Actors.brushSpriteSheet.getSprite(2));
            this.addDrawing(BrushSprites.Rocks, Actors.brushSpriteSheet.getSprite(3));
            this.setDrawing(this.spriteType);
            this.body.useBoxCollider(86, 64);
            this.body.collider.type = ex.CollisionType.Fixed;
        };
        Brush.prototype.onPostUpdate = function (engine, delta) { };
        return Brush;
    }(ex.Actor));
    Actors.Brush = Brush;
})(Actors || (Actors = {}));
var Actors;
(function (Actors) {
    Actors.wagonTexture = new ex.Texture("assets/wagon_sprite.png");
    Actors.wagonSpriteSheet = new ex.SpriteSheet(Actors.wagonTexture, 2, 2, 128, 128);
    var Wagon = /** @class */ (function (_super) {
        __extends(Wagon, _super);
        function Wagon() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Wagon.prototype.onInitialize = function (engine) {
            this.hoverShadow = new ex.Actor();
            this.hoverShadow.onPostDraw = function (ctx, delta) {
                ctx.fillStyle = 'white';
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.ellipse(0, 40, 60, 22, 0, 0, 2 * Math.PI);
                ctx.fill();
            };
            this.add(this.hoverShadow);
            this.addDrawing("idle", Actors.wagonSpriteSheet.getAnimationForAll(engine, 250));
            this.setDrawing("idle");
            this.body.useBoxCollider(102, 82);
            this.body.collider.type = ex.CollisionType.Fixed;
        };
        Wagon.prototype.onPostUpdate = function (engine, delta) { };
        return Wagon;
    }(ex.Actor));
    Actors.Wagon = Wagon;
})(Actors || (Actors = {}));
var Worlds;
(function (Worlds) {
    var World = /** @class */ (function (_super) {
        __extends(World, _super);
        function World() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        World.prototype.onInitialize = function (engine) {
            var mayor = new Actors.Mayor();
            mayor.pos.x = engine.halfDrawWidth;
            mayor.pos.y = engine.halfDrawHeight;
            this.add(mayor);
            var leaves = new Actors.Brush(Actors.BrushSprites.Leaves);
            leaves.pos.x = engine.drawWidth;
            leaves.pos.y = engine.halfDrawHeight * 1.5;
            this.addInteractable(leaves);
            var scopes = new Actors.Brush(Actors.BrushSprites.Scopes);
            scopes.pos.x = engine.halfDrawWidth;
            scopes.pos.y = engine.drawHeight * 1.5;
            this.addInteractable(scopes);
            var wagon = new Actors.Wagon();
            wagon.pos.x = engine.drawWidth * 1.75;
            wagon.pos.y = engine.drawHeight * 1.75;
            this.addInteractable(wagon);
            this.camera.strategy.elasticToActor(mayor, 0.02, 0.3);
        };
        World.prototype.addInteractable = function (actor) {
            var interaction = new Actors.Interaction();
            interaction.pos.x = actor.pos.x;
            interaction.pos.y = actor.pos.y;
            this.add(actor);
            this.add(interaction);
        };
        return World;
    }(ex.Scene));
    Worlds.World = World;
})(Worlds || (Worlds = {}));
/// <reference path="../node_modules/excalibur/dist/excalibur.d.ts" />
var game = new ex.Engine({
    width: 1200,
    height: 900,
    backgroundColor: new ex.Color(25, 26, 28)
});
game.isDebug = false;
ex.Physics.enabled = true;
ex.Physics.collisionResolutionStrategy = ex.CollisionResolutionStrategy.Box;
game.setAntialiasing(false);
// create an asset loader
var loader = new ex.Loader();
var resources = {
    txMayor: Actors.mayorTexture,
    txBrush: Actors.brushTexture,
    txWagon: Actors.wagonTexture
};
// queue resources for loading
for (var r in resources) {
    loader.addResource(resources[r]);
}
// uncomment loader after adding resources
game.start(loader).then(function () {
    var world = new Worlds.World(game);
    game.addScene('world', world);
    game.goToScene('world');
});
