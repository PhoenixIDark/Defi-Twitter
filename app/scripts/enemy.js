define(["pixi"], function (PIXI) { 
    var Enemy = function (enemyN) {
        var self = this;

        self.id = enemyN.id;
        self.sprite = new PIXI.Sprite(PIXI.loader.resources.soldier.texture);
        self.sprite.scale = { x: 1.5, y: 1.5 };
        self.sprite.anchor = { x: 0.5, y: 0.5 };
        self.sprite.position.x = enemyN.position.x;
        self.sprite.position.y = enemyN.position.y;

        self.sprite.interactive = true;
        self.sprite.on("mousedown", emitOnHit);
        self.sprite.on("touchstart", emitOnHit);

        function emitOnHit(event) {
            if (self.onHit) {
                self.onHit(event);
            }
        }
    };
    return Enemy;
});
