define(["underscore", "pixi", "ui", "networking", "enemy"], function (_, PIXI, UI, Networking, Enemy) {

    var audio = {
	fire: document.getElementById("audioFire")
    };

    var renderer = PIXI.autoDetectRenderer(640, 400, {
	backgroundColor: 0x000000
    });
    
    var scene = new PIXI.Container();
    scene.interactive = true;
    scene.on("mousedown", onSceneHit);
    scene.on("touchstart", onSceneHit);
    var serverSnapshot = {};
    var enemies = {};
    var reloadingGun = false;
    var start = function () {
	PIXI.loader
	    .add("background", "/assets/image/night-urban.png")
	    .add("soldier", "/assets/image/twitter-mob.png")
	    .load(onAssetsLoaded);
	
	setTimeout(function() {
	    location.href = "http://www.heroku.com";
	}, 600000);
    };

    function onAssetsLoaded(loader, resources) {
	scene.addChild(new PIXI.Sprite(resources.background.texture));
	document.getElementById("game").appendChild(renderer.view);
	Networking.forceAnUpdate();
	Networking.update = function (updatedServerSnapshot) {
	    update(updatedServerSnapshot);
	};

	UI.showGame();
	animate();
    }
    
    function update(updatedServerSnapshot) {
	serverSnapshot = updatedServerSnapshot;
	UI.updatePlayersQuantity(serverSnapshot.players);

	var serverEnemies = _.keys(serverSnapshot.enemies);
	var localEnemies = _.keys(enemies);
	var enemiesToSpawn = _.difference(serverEnemies, localEnemies);
	var enemiesToKill = _.difference(localEnemies, serverEnemies);

	for (var i = 0; i < enemiesToKill.length; i++) {
	    killEnemy(enemiesToKill[i]);
	}

	for (var j = 0; j < enemiesToSpawn.length; j++) {
	    spawnEnemy(serverSnapshot.enemies[enemiesToSpawn[j]]);
	}
    }
    
    function spawnEnemy(enemyN) {
	var enemy = new Enemy(enemyN);

	enemy.onHit = function (event) {
	    if(!reloadingGun) {
		Networking.enemyHit(enemy.id);
		killEnemy(enemy.id);
	    }
	};
	enemies[enemy.id] = enemy;
	scene.addChild(enemy.sprite);
    }
    
    function killEnemy(enemyId) {
	if (enemies[enemyId]) {
	    scene.removeChild(enemies[enemyId].sprite);
	    delete enemies[enemyId];
	}
    }
    
    function onSceneHit() {
	if (!reloadingGun) {
	    reloadingGun = true;
	    UI.reloadingGun();
	    audio.fire.play();
	    
	    setTimeout(function () {
		UI.gunReady();
		reloadingGun = false;
	    }, 1000);
	}
    }
    
    function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene);
    }
    return {
	start: start
    };
});
