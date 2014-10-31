Angular Skeleton
================

This should be a nice starting point for developing angular apps (front-end only).

TLDR;
=====

```
  git clone git@github.com:donabrams/angular-skeleton.git $PROJECT_NAME
  cd $PROJECT_NAME
  rm -rf .git # 'rd /s .git' on windows
  git init
  git add .
  git commit -m "Initial commit"
  npm install # You may have to run this twice on windows
  gulp
  gulp dev
```

Dependencies
============

 1. node/npm installed
 2. git command line tools installed

In windows, make sure you're using a 'Node command prompt'.

Structure
=========

Slightly modified from [scotch.io](http://scotch.io/tutorials/javascript/angularjs-best-practices-directory-structure)

    app/
    ----- shared/   // acts as reusable components or partials of our site
    ---------- sidebar/
    --------------- sidebarDirective.js
    --------------- sidebarView.html
    --------------- sidebarView.css
    ---------- article/
    --------------- articleDirective.js
    --------------- articleService.js
    --------------- articleView.html
    --------------- articleView.css
    ---------- httpServiceDecorator.js
    ---------- user/
    --------------- userService.js
    ---------- login/
    --------------- loginService.js
    --------------- loginView.html
    --------------- loginView.css
    ----- components/   // each component is treated as a mini Angular app
    ---------- home/
    --------------- homeController.js
    --------------- homeService.js
    --------------- homeView.html
    --------------- homeView.css
    ---------- blog/
    --------------- blogController.js
    --------------- blogService.coffee
    --------------- blogView.jade
    --------------- homeView.styl
    ----- app.module.js
    ----- app.routes.js
    assets/
    ----- images/   // Images and icons for your app
    ----- css/      // Global styling and style related files (css & stylus files)
    ----- js/       // JavaScript files written for your app that are not for angular
    index.html      // Primary loading of all libraries/angular elements
    server.js       // Server (node app)
    Gulpfile.js     // Build configuration
    bower.json      // Browser dependencies
    package.json    // Build & Server dependencies

How This Build System Assists You
=================================

1. By default, builds the app optimally for production
------------------------------------------------------
It's just ```gulp```. Which in turn:
 - Compiles templateUrls into a templates.js file so html templates are precached.
 - Compiles all js files into one main.js file and minimizes it.
 - Compiles all css files into one main.css file and minimizes it.
 - Compiles all images files into one images folder
 - Alters index.html to include the main.js and main.css files
 - This prod ready app is deployed to /target

2. Makes it easy to ensure code correctness when changes are made
-----------------------------------------------------------------
 - JsHint is required to pass before prod builds are created
 - Tests are required to pass before prod builds are created
 - JsHint and Tests are run when changes to js files during dev
 - JsHint can be tweaked by altering .jshintrc

3. Makes it easy to add dependencies and pull them in
-----------------------------------------------------
 - devDependencies are added via npm/package.json
```
    npm install some-dep --save-dev
```
 - front-end dependencies are added via bower/bower.json
```
    bower install some-dep --save
````
 - back-end dependencies are added via npm/package.json
```
    npm install some-dep --save
```
 - for front-end, index.html contains all the scripts and css, in the order they will be concatenated, in a commented code block. This is annoying because you have to add a dependency twice, but this is the best way: I'd use bower main to pull in deps, but many bower packages have terrible main declarations so we can't trust them.

4. Gives immediate feedback during dev
--------------------------------------
 The dev environment is started by using ```gulp dev```. It:
 - Sets up a server to serve both prod and dev (server.js). The server can be started without gulp via ```node server.js```.
 - Starts livereload and listens to changes to files in /dev_target. Note that it will not reload iframes.
 - Compiles stylus, coffee, and jade templates on change and updates /dev-target (triggering reloads)
 - Runs jsHint and tests, printing any errors to the console.
 - Compiles html templates into templates.js (so you don't have suprises in prod)

5. Is clear and easy to change
------------------------------
Well this is just a matter of opinion. See for yourself in Gulpfile.js.

