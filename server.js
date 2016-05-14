var _ = require("underscore");
var express = require("express");
var app = express();
var http = require("http").Server(app);
var config = require("./config.js");
var pathManager = require("./server/pathManager.js");
var gameManager = require("./server/gameManager.js");
var socketManager = require("./server/socketManager.js");

http.listen(config.port, function () {
    console.log("Listening on *:" + config.port);
});

app.use(express.static(pathManager.APP_BUILD));
app.get("/", function (req, res) {
    res.sendFile(pathManager.APP_BUILD + "/index.html");
});

socketManager.listen(http);
gameManager.start();
gameManager.onUpdate = function (snapshot) {
    socketManager.sendUpdate(snapshot);
};
socketManager.onAddClient = function () {
    gameManager.addPlayer();
};
socketManager.onRemoveClient = function () {
    gameManager.removePlayer();
};
socketManager.onEnemyHit = function (enemyId) {
    gameManager.hitsEnemy(enemyId);
};
