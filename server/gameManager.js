var _ = require("underscore");

var GameManager = (function () {

    var snapshot;
    var tickSnapshot;
    var tickGame;
    var start = function () {
	snapshot = {
	    dirty: false,
	    players: 0,
	    enemies: {}
	};
	tickSnapshot = setInterval(updateSnapshot, 100);
	tickGame = setInterval(updateGame, 3000);
    };
    var addPlayer = function () {
	snapshot.players++;
	snapshot.dirty = true;
    };
    var removePlayer = function () {
	snapshot.players--;
	snapshot.dirty = true;
    };
    var hitsEnemy = function (enemyId) {
        if (snapshot.enemies[enemyId]) {
            freeSpawnPosition(snapshot.enemies[enemyId].position);
            delete snapshot.enemies[enemyId];
            snapshot.dirty = true;
        }
    };
    var getCurrentSnapshot = function () {
	return JSON.parse(JSON.stringify(snapshot));
    };
    
    function updateSnapshot() {
	GameManager.onUpdate(getCurrentSnapshot());
	snapshot.dirty = false;
    }
    
    function updateGame() {
	if (Object.keys(snapshot.enemies).length < spawnPositions.length) {
	    spawnEnemy();
	}
    }
    
    function spawnEnemy() {
	var enemyN = new EnemyN();
	snapshot.enemies[enemyN.id] = enemyN;
	snapshot.dirty = true;
    }

    var spawnPositions = [
	{ x: 35, y: 195 },
	{ x: 105, y: 200 },
	{ x: 200, y: 210 },
	{ x: 410, y: 190 },
	{ x: 500, y: 200 },
	{ x: 605, y: 200 }
    ];
    var availableSpawnPositions = _.clone(spawnPositions);

    var EnemyN = function () {
	var self = this;

	self.id = _.uniqueId("EnemyN-");
	self.position = getAvailableSpawnPosition();
    };

    function getAvailableSpawnPosition() {
	var index = _.random(0, availableSpawnPositions.length - 1);
	var position = _.clone(availableSpawnPositions[index]);
	
	availableSpawnPositions.splice(index, 1);

	return position;
    }

    function freeSpawnPosition(position) {
	availableSpawnPositions.push(position);
    }

    return {
	addPlayer: addPlayer,
	removePlayer: removePlayer,
	getCurrentSnapshot: getCurrentSnapshot,
	start: start,
	hitsEnemy: hitsEnemy,
	onUpdate: function (snapshot) { }
    };

})();
module.exports = GameManager;
