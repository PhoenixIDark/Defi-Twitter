define([], function () {
    var playersQuantity = document.getElementById("playersQuantity");
    var gameContainer = document.getElementById("gameContainer");
    var game = document.getElementById("game");
    var loading = document.getElementById("loading");

    var updatePlayersQuantity = function (quantity) {
	playersQuantity.innerHTML = quantity;
    };
    var showGame = function () {
	loading.className = "hide";
	gameContainer.className = "";
    };
    
    var reloadingGun = function () {
	game.className = "reloading";
    };
    
    var gunReady = function () {
	game.className = "";
    };

    return {
	updatePlayersQuantity: updatePlayersQuantity,
	showGame: showGame,
	reloadingGun: reloadingGun,
	gunReady: gunReady
    };
});
