define(["io"], function (io) {	
    var Networking = (function () {
	var socket = io();
	var forceUpdate;
	socket.on("update", function (updatedServerSnapshot) {
	    if (updatedServerSnapshot.dirty || forceUpdate) {
		Networking.update(updatedServerSnapshot);
		forceUpdate = false;
	    }
	});
	
	var forceAnUpdate = function () {
	    forceUpdate = true;
	};
	
	function enemyHit(enemyId) {
	    socket.emit("enemyHit", enemyId);
	}
	
	return {
	    enemyHit: enemyHit,
	    forceAnUpdate: forceAnUpdate,
	    update: function (updatedServerSnapshot) {}
	};
    })();
    return Networking;
});
