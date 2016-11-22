# HTML Starter Page
As we are going to build JavaScript that runs in the browser, we need a web page that can be loaded in the browser.  For now, this page will be blank, it will just contain a reference to our JavaScript so that it runs when we load the web page.  Open you favorite IDE, create an ```index.html``` file in the root folder of your project and put the following HTML in that file:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript FTW</title>
  </head>
  <body>
    <div id="app"><div>
    <script src="/dist/app.js"></script>
  </body>
</html>
```

This will show an empty Web Page to the user.  Next, we will create some JavaScript that will add content to this Web Page.

# Our First JavaScript
As you can see, we are referencing a JavaScript file called ```app.js``` that lives in the ```dist``` folder, so lets create this folder (but hold off on creating the file!):

```bash
$ mkdir dist
```

This ```dist``` folder is where our "compiled" javascript code will live, our source code will live in a ```src``` folder, so lets create that folder next:

```bash
$ mkdir src
```

And in there, we create our ```app.js``` file

```bash
$ touch ./src/app.js
```

Open ```app.js``` in the ```src``` folder and add the following JavaScript:

```javascript
document.getElementById('app').innerHTML = 'It Works!'
```

This will simply grab the html element with an id of ```app``` and replace it's content (which is blank at the moment), with 'It Works!', resulting in that string showing up on the Web Page.

Now we can transpile using the setup we did earlier:

```bash
$ npm run build
```

This should have created the transpiled version of ```app.js``` in the ```dist``` folder.  If you open up that file you will see it looks exactly the same as the source file because we have not used any ES2015 features, so Babel did not have to transform any of our source code (don't worry, it soon will).

## Setup a Simple Webserver (mandatory)
You can now try to open up the ```index.html``` file in your browser, but nothing will happen.  It won't load the JavaScript file and as a result, nothing will be shown on the Web Page.  In order to get the JavaScript to load you need an actual Web Server that serves the ```index.html``` page and can then also serve the JavaScript that page is requesting.  The simplest way to to this (at least on Macs), is to use Python.  It comes preinstalled on most systems and it has a simple webserver build in.  You can invoke it from the command line, in the project root folder:

```bash
$ python -m SimpleHTTPServer
```

If you now open ```http://localhost:8000/``` in your browser, you should see the message you wrote in JavaScript appear on the Web Page.

# ES2015 JavaScript Example
Let's make our JavaScript example a little bit more interesting by introducing some ES2015 features.  Go ahead and replace the content of the app.js file with the following:

```javascript
const sayHello = (name = 'Mark') => `Hello ${ name }`

document.getElementById('app').innerHTML = `<h1>${ sayHello() }<h1>`
```

Here we create a function called ```sayHello``` that takes in 1 parameter called ```name```.  The function is written as an Arrow Function which is a ES2015 feature.  To learn more about arrow functions and the difference between regular functions, feel free to go [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), but 1 feature of an arrow function is that it provides a more concise syntax than creating a regular function (it also doesn't bind to ```this```).  The function is assigned to a Constant called ```sayHello```, Constants are also a new ES2015 feature.  The function sets a default value  ```Mark``` for the ```name``` parameter; another ES2015 feature.  And finally the function returns (note that the return keyword is not needed as a single line arrow function performs an implicit return, also known as a __lambda function__) a string created using the new ES2015 Template Strings, which provides string interpolation.

Of course, before we can see this new code in action, we first have to re-transpile our ES2015 code into ES5 code by running:

```bash
$ npm run build
```

and then re-loading our browser window.  When you look at the compiled code now, you will that there is a big difference between your source code, and the code created by Babel.

These 2 steps (recompiling the JavaScript and refreshing the browser window) will have to be performed every time we make the slightest change to our JavaScript.  This might not seem like a big deal, but I can tell you from experience, this gets very annoying very quickly.  Worse, over time, it will actually slow down your iterations: you will try to avoid these steps as much as possible, writing a lot more code between compile/refresh cycles.  When you eventually do compile/refresh to see what all that beautiful code you wrote actually does, you will eventually get errors or unexpected results.  Because you wrote a lot more code since the last iteration, it will be a lot harder to track down your errors.  Let's fix both these issues.

# I'm Watching!
## JavaScript
Babel actually comes with a feature that allows you to "watch" your source files and trigger an automatic recompilation when it detects a change.  Lets add this to our ```package.json``` file as a new script, just add the following to the ```scripts``` section:

```JSON
    "watch": "babel -w src -d dist"
```

Now run this new script:

```bash
$ npm run watch
```

You will see that, other than with the ```build``` script, this script does not finish, it just sits there ... watching.  Go ahead and make a change to the ```app.js``` file now and save it, e.g. change the ```h1``` tags to ```h2``` tags.  As soon as you save the JavaScript, you will see that Babel triggers a recompilation.  To kill the watch process you just hit ```ctrl-c```.

## HTML
To automatically refresh our browser (a feature usually called __live-reload__) we are going to leave behind our simple python web server and switch to something more powerful ... much much more powerful.  Fear not though, it is extremely easy to install and use, thanks to npm!

[Browsersync](https://www.browsersync.io/) is the swiss army knife for Web Developers with an amazing array of features, 1 of them being live-reload.  We are going to leverage that feature to re-establish our fast iteration cycle.  Since Browsersync is a node package, you can easily install it with npm.  Unlike previous npm packages though, which we installed locally, I prefer to install Browsersync globally.  The reason for this is that there are many live-reload solutions out there and just because I prefer Browsersync does not mean that the next developer who is going to work on my projects will too.  Therefore I do not want to "pollute" the project with what in my opinion is the best live-reload solution.  If however you decide to install it locally, remember that Browsersync is a devDependency, so use the ```--save-dev``` flag.  To install Browsersync globally, run the following command:

```bash
$ npm install -g browser-sync
```

Just like Babel, Browsersync comes with a "watch" feature.  When you start the server, you tell it which files to watch for and it will refresh the browser when any of those files change.  Note that these files can be anything, including JavaScript, CSS and HTML files.  Let's run ```browser-sync``` so that it watches all our JavaScript changes _and_ any changes to our index.html file, run the following from the root folder of your project:

```bash
$ browser-sync start --server --files "dist/*.js, index.html"
```

This will immediately open up your web page in your default browser.

Make sure that Babel watch is still running in a separate terminal.  Now make a change to your app.js source file and save it, you should see the browser window refresh on save, reflecting your JavaScript update.  Do the same with the index.html file, make a change and save.  Again, you should see the browser window refresh on save, this time reflecting your html update.  Later, when we add CSS, we will also add CSS changes to watch list of ```browser-sync```.

You can now hide the 2 terminals that run Babel watch and Browsersync and never have to worry about them again (well, almost never as you will see later).  Just leave your browser window open and put your IDE next to it.  Write some code, save it, and review it in the auto-refreshed browser window!
