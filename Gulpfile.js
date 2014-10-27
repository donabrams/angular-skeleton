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
    jeet = require('jeet'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    htmlReplace = require('gulp-html-replace'),
    ngTemplateCache = require('gulp-angular-templatecache'),
    gulpif = require('gulp-if'),
    gulpFilter = require('gulp-filter'),
    debug = require('gulp-debug'),
    useref = require('gulp-useref'),
    jshint = require('gulp-jshint'),
    wrap = require('gulp-wrap'),
    del = require('del'),
    changed = require('gulp-changed'),
    map = require('map-stream')
    _ = require('lodash');

var paths = {
    module_name: 'myapp',
    server_main: ['server.js'],
    bower: ['bower.json'],
    dev_src: ['app/**/*', 'assets/**/*', 'index.html', 'index.jade'],
    dev_target: 'dev_target',
    prod_target: 'target'
};

var stylus_libs = [nib(), jeet()];

gulp.task('lint', function() {
    return gulp.src(paths.dev_src)
        .pipe(gulpFilter('*.js')) 
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('pull_vendor_deps', function () {
    return bower.commands.install();
});

gulp.task('clean_dev', function(cb) {
    del([paths.dev_target + '/**'], cb);
});

gulp.task('src_to_dev', ['clean_dev'], function() {
    var templateFilter = gulpFilter('app/**/*.html')
    return gulp.src('**/*')
        .pipe(gulpFilter(paths.dev_src))
        .pipe(gulpif('*.coffee', coffee()))
        .pipe(gulpif('*.jade', jade()))
        .pipe(gulpif('*.styl', stylus({use: stylus_libs})))
        .pipe(templateFilter)
        .pipe(ngTemplateCache({module: paths.module_name}))
        .pipe(templateFilter.restore())
        .on('error', util.log)
        .pipe(gulp.dest(paths.dev_target));
});

gulp.task('dev_ready', ['src_to_dev', 'pull_vendor_deps']);

gulp.task('server', ['dev_ready'], function () {
    //start the server at the beginning of the task
    server.run({
        file: 'server.js'
    });

    // notify server when files changes
    gulp.watch(paths.dev_target + '/**/*', server.notify);
    gulp.watch(paths.prod_target + '/**/*', server.notify);
    gulp.watch('bower_components' + '/**/*', server.notify);
    // restart the server when server changes
    gulp.watch(paths.server_main, [server.run]);
});

gulp.task('dev_build', [
    'lint',
    'dev_ready'
]);

gulp.task('clean_prod', function(cb) {
    del([paths.prod_target + '/**'], cb);
});

gulp.task('dev_to_prod', ['dev_build'], function() {
    var assets = useref.assets({
        addNotConcat: true, 
        searchPath: [paths.dev_target, '.']
    });
    var jsFilter = gulpFilter(['*.js', '!*.min.js']);
    var cssFilter = gulpFilter('*.css');
    return gulp.src(paths.dev_target + '/index.html')
        .pipe(assets)

        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(concat('main.js'))
        .pipe(jsFilter.restore())

        .pipe(cssFilter)
        .pipe(concat('main.css'))
        .pipe(minifyCss())
        .pipe(cssFilter.restore())

        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(paths.prod_target))
        .on('error', util.log);
});

gulp.task('copy_images', ['clean_prod'], function() {
    return gulp.src('assets/images/**/*')
        .pipe(gulp.dest(paths.prod_target + '/images'));
});

gulp.task('build', [
    'clean_prod',
    'dev_to_prod',
    'copy_images'
]);

gulp.task('dev_watch', function() {
    gulp.watch(paths.bower, ['pull_vendor_deps']);
    gulp.watch('index.html', ['src_to_dev']);
    gulp.watch('app/**/*', ['src_to_dev']);
    gulp.watch('assets/**/*', ['src_to_dev']);
});

gulp.task('dev', ['server', 'dev_watch', 'dev_ready']);

gulp.task('clean', ['clean_prod', 'clean_dev']);

gulp.task('default', ['dev']);