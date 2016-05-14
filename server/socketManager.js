var socketio = require("socket.io");
var io;

var SocketManager = (function () {
    
    var clients = [];
    var listen = function (http) {
	io = socketio.listen(http);

	io.sockets.on("connection", function (socket) {
	    addClient(socket);
	    
	    socket.on("enemyHit", function (enemyId) {
		SocketManager.onEnemyHit(enemyId);
	    });
	    
	    socket.on("disconnect", function () {
		removeClient(socket);
	    });
	});
    };
    
    var sendUpdate = function (snapshot) {
	io.emit("update", snapshot);
    };
    
    function addClient(socket) {
	clients.push(socket);
	SocketManager.onAddClient();
    }

    function removeClient(socket) {
	delete clients[clients.indexOf(socket)];
	SocketManager.onRemoveClient();
    }

    return {
	listen: listen,
	sendUpdate: sendUpdate,
	onAddClient: function () { },
	onRemoveClient: function () { },
	onEnemyHit: function (enemyId) { }
    };

})();
module.exports = SocketManager;
