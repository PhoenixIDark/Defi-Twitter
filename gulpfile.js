var config = require("./config.js");
var pathManager = require("./server/pathManager.js");
var gulp = require("gulp");
var del = require("del");
var jshint = require("gulp-jshint");
var shell = require("gulp-shell");
var preprocess = require("gulp-preprocess");
var nodemon = require("gulp-nodemon");
var mocha = require("gulp-mocha");

gulp.task("clean", function (cb) {
	del([pathManager.APP_BUILD], cb);
});

gulp.task("copy", ["clean"], function () {
	gulp.src([pathManager.APP_ASSETS + "/**/*.*"]).pipe(gulp.dest(pathManager.APP_BUILD + "/assets"));
	gulp.src([pathManager.APP_CSS + "/**/*.*"]).pipe(gulp.dest(pathManager.APP_BUILD + "/css"));

	if (config.env != "production") {
		gulp.src([pathManager.APP_LIB + "/**/*.*"]).pipe(gulp.dest(pathManager.APP_BUILD + "/lib"));
		gulp.src([pathManager.APP_SCRIPTS + "/**/*.js"]).pipe(gulp.dest(pathManager.APP_BUILD + "/scripts"));
	} else {
		gulp.src([pathManager.APP_LIB + "/requirejs/require.js"]).pipe(gulp.dest(pathManager.APP_BUILD + "/lib/requirejs"));
	}
});

gulp.task("scripts", ["clean"], shell.task(config.requirejsCommand + " -o app/scripts/build.js"));

gulp.task("html", ["clean"], function () {
	gulp.src(pathManager.APP + "/index.html")
		.pipe(preprocess({ context: { NODE_ENV: config.env } }))
		.pipe(gulp.dest(pathManager.APP_BUILD));
});

gulp.task("server", function () {
	nodemon({
		script: pathManager.BASE + "/server.js",
		watch: [
			pathManager.BASE + "/*.js",
			pathManager.SERVER + "/*.js"
		],
		ignore: [
			pathManager.APP + "/**/*.*",
			pathManager.TEST + "/**/*.js"
		]
	});
});

gulp.task("watch", function () {
	gulp.watch([
		pathManager.TEST + "/app/**/*.js",
		pathManager.APP + "/**/*.*",
		"!" + pathManager.APP_BUILD + "/**/*.*"
	], ["copy", "html", "lint", "test"]);
	
	gulp.watch([
		pathManager.BASE + "/*.js",
		pathManager.SERVER + "/*.js",
		pathManager.TEST + "/server/**/*.js"
	], ["server", "lint", "test"]);
});

gulp.task("lint", function () {
	return gulp.src([
		pathManager.BASE + "/*.js",
		pathManager.SERVER + "/*.js",
		pathManager.APP_SCRIPTS + "/**/*.js",
		"!" + pathManager.APP_SCRIPTS + "/build.js",
		"!" + pathManager.APP_BUILD + "/main-built.js",
	])
	.pipe(jshint())
	.pipe(jshint.reporter("default"));
});

gulp.task("test", function () {
	gulp.src(pathManager.TEST + "/**/*.js")
		.pipe(mocha())
		.on("error", function(err){
			console.log(err.toString());
		});
});

gulp.task("development", ["watch", "copy", "html", "lint", "server"]);
gulp.task("production", ["copy", "scripts", "html"]);
gulp.task("default", [config.env]);
