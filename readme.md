Starter
=================
Description: Starter for front-end projects <br>

**Contributors:**
Grant Kiely @gkiely

Build requirements
----
* Node & gulp.js
------------




Project Details
---
Issues/Bugs are located in todo.html


3 folders
>src: This is the folder you want to edit


>dev: Quick gulp build for development (concats html and other assets, minimal build)


>dist: Longer gulp build with all the trimmings (minification, etc)

* Using gulp-file-include to include the html files. It allows you to pass variables with the includes.
* `gulp dist` will generate minified prod code [still working on this]
* Im using bower indirectly, I download/update assets and then I copy them across to lib or app.

HTML
---
* /pages get copied across, partials do not (they are only for including with gulp-file-include).

JS
---
* Using babeljs, so you can use ES6 js code, yay classes.
* If you copy a file into the /lib folder it will get concated into lib.js, same for app, /nobuild does not build and is just for testing.

The reason I'm doing this as it saves adding a new script to your page everytime.

The reason I'm not minifying them for /dev is to keep the refresh as fast as possible
 - It's sourcemapped so you can still debug

The reason It's in two seperate files is because the lib will contain the libraries and take a lot longer, and its the one you rarely edit. SPEEEEED.

I think it also makes it easier to cache the lib.js on the clientside which is bigger and will not get updated as often as app.js.


SASS
---
If you copy a scss file into /lib folder it gets auto added to lib.scss. It's using gulp-include globbing pattern. Note I had to use gulp-include not gulp-file-include for this, they are two seperate packages. gi has globbing, gfi does not but is better for html & including using vars.
Will be upgrading to this: https://github.com/mathisonian/gulp-sass-bulk-import

Responsive Images
---
There is a task called imgResp that will generate 1/2 and 1/3 images.
So you include the highest res at x3 in your img directory, which covers the highest res device out there at the moment.

If you are a boss go here and get it installed. https://github.com/mahnunchik/gulp-responsive
You're reward is auto-generated images for different pixel densities.



Deployment
------
I have setup a subtree for the dist folder

When you want to push to production use the following command:

`git subtree push --prefix dist origin dist`

Details on how I set it up:
http://yeoman.io/learning/deployment.html