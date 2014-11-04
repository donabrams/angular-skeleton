var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    bower = require('bower'),
    del = require('del'),
    nib = require('nib'),
    jeet = require('jeet'),
    _ = require('lodash'),
    rs = require('run-sequence');

// Change this to change the module tamples are cached on
var templates_module_name = 'myapp';
// For convenience
var paths = {
    dev_target: 'dev_target',
    prod_target: 'target',
    server_main: ['server.js'],
    bower_config: ['bower.json'],
    bower_files: 'bower_components',
    ng_templates: 'app/**/*.html',
    img_src: 'assets/images',
    html_src: 'dev_target/assets/html',
    dev_src: ['app/**/*.*', 'assets/**/*.*', 'index.html', 'index.jade']
};
// plugins that stylus uses
var stylus_libs = [
    nib(), // nib is like compass for sass
    jeet() // jeet is an amazing responsive grid framework
];

// Lint all the dev javascript
gulp.task('lint', function() {
    return gulp.src(paths.dev_src)
        .pipe(plugins.filter('**/*.js'))
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.jshint.reporter('fail'));
});

// Pull down bower dependencies
gulp.task('pull_vendor_deps', function () {
    return bower.commands.install();
});

// Clear out the dev_target folder
gulp.task('clean_dev', function(cb) {
    del([paths.dev_target + '/**'], cb);
});

function handleErr(err) {
    plugins.util.log(err);
    this.emit('end');
}

// Main dev task:
// 1. compiles coffeescript
// 2. compiles jade
// 3. compiles stylus 
// 4. wraps js files in IIFEs
// 5. creates the template cache from html files (Beware: may cache unused templates!)
// 6. copies all files to /dev_target
gulp.task('src_to_dev', function() {
    var jadeFilter = plugins.filter('**/*.jade');
    var stylFilter = plugins.filter('**/*.styl');
    var coffeeFilter = plugins.filter('**/*.coffee');
    var jsFilter = plugins.filter('**/*.js');
    var templateFilter = plugins.filter(paths.ng_templates);
    return gulp.src(paths.dev_src)
        .pipe(plugins.plumber({errorHandler: handleErr}))
        .pipe(plugins.rebase(__dirname + '/'))
        .pipe(jadeFilter)
        .pipe(plugins.jade())
        .pipe(jadeFilter.restore())
        .pipe(stylFilter)
        .pipe(plugins.stylus({use: stylus_libs}))
        .pipe(stylFilter.restore())
        .pipe(coffeeFilter)
        .pipe(plugins.coffee())
        .pipe(coffeeFilter.restore())
        .pipe(templateFilter)
        .pipe(plugins.angularTemplatecache({module: templates_module_name}))
        .pipe(templateFilter.restore())
        .pipe(jsFilter)
        .pipe(iife())
        .pipe(jsFilter.restore())
        .pipe(gulp.dest(paths.dev_target));
});

// Helper gulp plugin that wraps a file in an IIFE (keeps modules apart)
function iife() {
    return plugins.wrap('(function(){\n"use strict";\n<%= contents %>\n})();');
}

gulp.task('start_server', function() {
    plugins.express.run({
        file: 'server.js'
    });
})

// Start the server
gulp.task('dev_server', ['start_server'], function() {
    // notify server when files changes
    gulp.watch(paths.dev_target + '/**/*', plugins.express.notify);
    gulp.watch(paths.prod_target + '/**/*', plugins.express.notify);
    gulp.watch(paths.bower_files + '/**', plugins.express.notify);
    gulp.watch(paths.dev_target, plugins.express.notify);
    gulp.watch(paths.prod_target, plugins.express.notify);
    gulp.watch(paths.bower_files, plugins.express.notify);
    // restart the server when server changes
    gulp.watch(paths.server_main, ['start_server']);
});
/*
gulp.task('dev-server', function(cb) {
    rs('server-start',
        'server-watchers',
        cb
    );
});
*/

// Cleans target directory
gulp.task('clean_prod', function(cb) {
    del([paths.prod_target + '/**'], cb);
});

// Main build task:
// 1. Pull ordered list of css and js files from index.html
// 2. uglify and concat all js resources into main.js
// 3. concat and minify all css resources into main.css
// 4. replace css and js blocks in index.html with main.{js,css}
// 5. Copy all these files to /target
gulp.task('dev_to_prod', function() {
    var assets = plugins.useref.assets({
        addNotConcat: true, 
        searchPath: [paths.dev_target, '.']
    });
    var jsFilter = plugins.filter(['*.js', '!*.min.js']);
    var cssFilter = plugins.filter('*.css');
    var jadeFilter = plugins.filter('**/*.jade');
    return gulp.src(['index.html', 'index.jade'])
        .pipe(plugins.plumber({errorHandler: handleErr}))
        
        // WORKAROUND: Useref needs links and scripts on newlines or it fails,
        // so pretty compile index.html from source when using jade
        .pipe(jadeFilter)
        .pipe(plugins.jade({
            pretty: true
        }))
        .pipe(jadeFilter.restore())

        .pipe(assets)

        .pipe(jsFilter)
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.uglify())
        .pipe(jsFilter.restore())

        .pipe(cssFilter)
        .pipe(plugins.concat('main.css'))
        .pipe(plugins.minifyCss())
        .pipe(cssFilter.restore())

        .pipe(assets.restore())
        .pipe(plugins.useref())
        .pipe(gulp.dest(paths.prod_target))
});

// Copy image assets directory to /target
gulp.task('copy_images_to_prod', function() {
    return gulp.src(paths.img_src + '/**/*')
        .pipe(gulp.dest(paths.prod_target + '/images'));
});
// Copy html assets not used in templates to prod
// TODO: this could use rethinking
gulp.task('copy_html_to_prod', function() {
    return gulp.src(paths.html_src + '/**/*')
        .pipe(gulp.dest(paths.prod_target + '/assets/html'));
});

// dev rebuild task
gulp.task('rebuild_dev', function(cb) {
    rs(['clean_dev'],
        ['src_to_dev', 'pull_vendor_deps'],
        cb
    );
});

// main build task
gulp.task('build', function(cb) {
    rs(['clean_prod', 'rebuild_dev'],
        ['dev_to_prod', 'copy_images_to_prod'],
        cb
    );
});
// rebuild === build
gulp.task('rebuild', ['build']);

// watches for dev
gulp.task('dev_watch', function() {
    gulp.watch(paths.bower_config, ['pull_vendor_deps']);
    _.each(paths.dev_src, function(path) {
        gulp.watch(path, ['src_to_dev', 'lint']);
    });
});

// dev task
gulp.task('dev', function(cb) {
    rs('rebuild_dev',
        ['dev_server', 'dev_watch'],
        cb
    );
});

// clean everything
gulp.task('clean', ['clean_prod', 'clean_dev']);

// default is BUILD
gulp.task('default', ['build']);