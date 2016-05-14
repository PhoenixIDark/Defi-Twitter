var PathManager = (function () {
	
	var BASE = ".";
	var APP = BASE + "/app";
	
	return {
		BASE: BASE,
		SERVER: BASE + "/server",
		APP: APP,
		APP_ASSETS: APP + "/assets",
		APP_BUILD: APP + "/build",
		APP_CSS: APP + "/css",
		APP_LIB: APP + "/lib",
		APP_SCRIPTS: APP + "/scripts",
	};
	
})();
module.exports = PathManager;
