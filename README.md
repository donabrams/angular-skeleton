Dependencies
============
 1. node/npm installed
 2. git command line tools installed

Use
===
```
  git clone git@gitlab.cardinalsolutions.com:dabrams/angular-skeleton.git $PROJECT_NAME
  cd $PROJECT_NAME
  rm -rf .git
  git init
  git add .
  git commit -m "Initial commit"
  npm install
  gulp build
  gulp
  # goto http://localhost:8080/
```

Structure
=========

Slightly modified from [http://scotch.io/tutorials/javascript/angularjs-best-practices-directory-structure]

app/
----- shared/   // acts as reusable components or partials of our site
---------- sidebar/
--------------- sidebarDirective.js
--------------- sidebarView.html
---------- article/
--------------- articleDirective.js
--------------- articleView.html
----- components/   // each component is treated as a mini Angular app
---------- home/
--------------- homeController.js
--------------- homeService.js
--------------- homeView.html
---------- blog/
--------------- blogController.js
--------------- blogService.js
--------------- blogView.html
----- app.module.js
----- app.routes.js
assets/
----- img/      // Images and icons for your app
----- css/      // All styles and style related files (css & stylus files)
----- js/       // JavaScript files written for your app that are not for angular
----- libs/     // Third-party libraries such as jQuery, Moment, Underscore, etc.
index.html      // Primary loading of all libraries/angular elements
server.js       // Server (node app)
Gulpfile.js     // Build configuration
bower.json      // Browser dependencies
package.json    // Build & Server dependencies

Prod Build Process
==================

The prod build process creates 3 files and one directory:
 - main.js - concated dependencies in the same order as in index.html Angular templates will be inlined.
 - main.css - all css in one file
 - index.html - Single Page app file, scripts and css section will be replaced with reference to concated files
 - /images - all image resources

These files will go in the /target directory.

Dev Build Process
=================

During development (gulp dev), any changes in assets or bower.json will be copied to the 
/dev_target directory. Any angular html templates will be inlined.

Image references in css and html should be '/images/$IMAGE_NAME'

