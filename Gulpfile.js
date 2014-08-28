var gulp = require('gulp'),
    server = require('gulp-express'),
    util = require('gulp-util'),
    through = require('through2'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    coffee = require('gulp-coffee'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    bower_files = require('bower-files');

var paths = {
	main: ['app.js'],
	static_files: ['static/**/*'],
	html_templates: ['html/**/*.jade'],
	css_templates: ['css/**/*.styl'],
	js_templates: ['js/**/*.coffee'],
	bower: ['bower.json']
};

gulp.task('server', function () {
    //start the server at the beginning of the task
    server.run();

    //restart the server when file changes
    gulp.watch(paths.static_files, server.notify);
    gulp.watch(paths.main, [server.run]);
});

gulp.task('compile_html_templates', function () {
	gulp.src(paths.html_templates)
	    .pipe(jade()).on('error', util.log)
	    .pipe(gulp.dest('static'));
});

gulp.task('compile_css_templates', function () {
	gulp.src(paths.css_templates)
	    .pipe(stylus({use: [nib()]})).on('error', util.log)
	    .pipe(gulp.dest('static'));
});

gulp.task('compile_js_templates', function () {
	gulp.src(paths.js_templates)
	    .pipe(coffee()).on('error', util.log)
	    .pipe(gulp.dest('static'));
});

gulp.task('pull-vendor-deps', function () {
	return bower.commands.install();
});

gulp.task('update-vendor-deps', ['pull-vendor-deps'], function () {
	util.log(bower_files().js);
	gulp.src(bower_files().js)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('static'));
});

gulp.task('watch', function() {
	gulp.watch(paths.html_templates, ['compile_html_templates']);
	gulp.watch(paths.css_templates, ['compile_css_templates']);
	gulp.watch(paths.js_templates, ['compile_js_templates']);
	gulp.watch(paths.bower, ['update-vendor-deps']);
});

gulp.task('build', ['compile_html_templates', 'compile_css_templates', 'update-vendor-deps']);

gulp.task('default', ['server', 'watch']);