var gulp = require('gulp'),
    server = require('gulp-express'),
    util = require('gulp-util'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    coffee = require('gulp-coffee'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    bower_files = require('bower-files'),
    jeet = require('jeet');

var paths = {
    main: ['app.js'],
    static_files: ['static/**/*'],
    html_templates: ['html/**/*.jade'],
    html_files: ['html/**/*.html'],
    css_templates: ['css/**/*.styl'],
    css_files: ['css/**/*.css'],
    js_templates: ['js/**/*.coffee'],
    js_files: ['js/**/*.js'],
    bower: ['bower.json'],
    image_files: ['images/*']
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
        .pipe(stylus({use: [nib(), jeet()]})).on('error', util.log)
        .pipe(gulp.dest('static'));
});

gulp.task('compile_js_templates', function () {
    gulp.src(paths.js_templates)
        .pipe(coffee()).on('error', util.log)
        .pipe(gulp.dest('static'));
});

gulp.task('copy_html_files', function () {
    gulp.src(paths.html_files)
        .pipe(gulp.dest('static'));
});

gulp.task('copy_css_files', function () {
    gulp.src(paths.css_files)
        .pipe(gulp.dest('static'));
});

gulp.task('copy_js_files', function () {
    gulp.src(paths.js_files)
        .pipe(gulp.dest('static'));
});

gulp.task('copy_image_files', function () {
    gulp.src(paths.image_files)
        .pipe(gulp.dest('static'));
});

gulp.task('pull-vendor-deps', function () {
    return bower.commands.install();
});

gulp.task('update-vendor-deps', ['pull-vendor-deps'], function () {
    //TODO: unload and reload bower_files due to bug in plugin.
    var bowerFiles = bower_files();
    gulp.src((bowerFiles.js || [])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('static'));
    gulp.src((bowerFiles.css || [])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('static'));
});

gulp.task('watch', function() {
    gulp.watch(paths.html_templates, ['compile_html_templates']);
    gulp.watch(paths.css_templates, ['compile_css_templates']);
    gulp.watch(paths.js_templates, ['compile_js_templates']);
    gulp.watch(paths.html_files, ['copy_html_files']);
    gulp.watch(paths.css_files, ['copy_css_files']);
    gulp.watch(paths.js_files, ['copy_js_files']);
    gulp.watch(paths.image_files, ['copy_image_files']);
    gulp.watch(paths.bower, ['update-vendor-deps']);
});

gulp.task('build', [
    'update-vendor-deps', 
    'compile_html_templates', 
    'compile_css_templates', 
    'compile_js_templates', 
    'copy_html_files',
    'copy_css_files',
    'copy_js_files',
    'copy_image_files'
]);

gulp.task('default', ['server', 'watch']);