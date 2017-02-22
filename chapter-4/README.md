# Modular JavaScript
Modularity has always been a staple of good development; it promotes code reuse and enhances maintainability.  Unfortunately, writing modular JavaScript _was_ not easy, at least not until node.js came along.  In fact, JavaScript did not have a way to write modules built into the language.  (Read that last sentence again, out loud.)  Over time, this lead to developers building their own strategies and tools to create modular JavaScript.  I will spare you the history lesson and the cornucopia of solutions this has lead to (but you should definitely Google it) and just let you know that, _finally_, ES2015 introduced a native feature in the JavaScript language that supports the creation of modules.  And since we are coding in ES2015 already, this is the only solution we will be using going forward.

## Our first Module
Let's go back to our example ```app.js``` and introduce some JavaScript Modules to see how they work.  First we create a new folder called ```lib``` in our ```src``` folder that will hold all our JavaScript Modules. 

```bash
$ cd src
$ mkdir lib
$ cd lib
```

In this directory, we create a file called ```sayHello.js``` and we move the sayHello function into this new file.  To turn this function into a module, all we need to do is export the function:

```javascript
const sayHello = (name = 'Mark') => `Hello ${ name }`

export sayHello
```

To use the module in ```app.js``` we have to import the module:

```javascript
import { sayHello } from './lib/sayHello'

document.getElementById('app').innerHTML = `<h1>${ sayHello() }</h1>`
```

We can actually simplify ```sayHello.js``` a little bit, a module can namely export multiple objects, but one of those can be set as the default:

```javascript
const sayHello = (name = 'Mark') => `Hello ${ name }`

export default sayHello
```

When you do this, the import statement in ```app.js``` does not require curly braces for the default object:

```javascript
import sayHello from './lib/sayHello'

document.getElementById('app').innerHTML = `<h1>${ sayHello() }</h1>`
```

Note that you can name your imported object anything you want.  I prefer to call it the same as the function that is being imported, but you don't have to.  This works just as well:

```javascript
import welcome from './lib/sayHello'

document.getElementById('app').innerHTML = `<h1>${ welcome() }</h1>`
```

After saving this, your browser should have already refreshed itself with the new code and you will see that ... it does not work.  You will see an error message in the console of your browser (e.g. DevTools in Chrome) that reads something like this:

```Uncaught ReferenceError: require is not defined(…)```

If you cannot remember having used ```require``` in your code, well, you are right, you didn't.  This error is coming from our compiled code, not from our source code.  And this is raising an interesting problem: how do I know which line in my source code is responsible for this error in the compiled code?  In other words, how does the source code map to the compiled code?

### Source Maps
Of course the JavaScript community has a solution for this issue.  "Source Maps" map your source code to your compiled code so that you can keep writing ES2015 code at development time, run ES5 code (compiled by Babel) in the browser, and still see where in the source code the error comes from (even though the browser never gets to see the actual source code).  This feature is actually built into Babel and can easily be switched on by using the ```-s``` or ```--source-maps``` flag, so let's add this to our ```package.json``` watch script:

```JSON
    "watch": "babel -w src -d dist -s"
```

At this point, you do actually have to stop Babel in the terminal that is "watching" and restart it.  Babel only watches for changes in the JavaScript code, not in the actual Babel configuration.  In order to pick up the fact that you now also want to generate Source Maps, stop and restart watch:

```bash
$ npm run watch
```

Now you will see that the error actually comes from our ```import``` statement in ```app.js```.  So what is going on here?

## Module Loaders
As we discussed at the beginning of this chapter, before ES2015 there was no support for modules in the JavaScript language.  Instead, several tools had emerged that added this sort of functionality to the language.  Babel can actually transpile to most of those solutions but by default it transpiles to the CommonJS model (also used by Node.js), which is where the ```require``` comes from: it transpiles our ```import``` statement into the following:

```JavaScript
var _sayHello = require('lib/sayHello');
```

Now, ```require``` is a function that is provided by e.g. Node.js, but not by the browser, hence the error ```require is not defined```.  So we are now in the interesting situation where we transpiled ```import```, which is not yet supported by any browser, to ```require```, which is also not supported by any browser.  In fact, none of the Module Loaders are supported by any browser.  There's actually a good reason for this; think about it, these modules are separate files and ```require``` needs to load these files from the File System, but a browser does not have a File System, so how _could_ this work?

The solution to this problem is to "bundle" all the modules into 1 large file so that when the browser loads this 1 file, it has access to all modules.

>Note that these bundlers require quite a bit of setup (explained in the next sections), even for our simple setup.  However, over time, the advantages they provide far outweigh these annoyances.  Also, once you have 1 project set up it can serve as a template for any new projects, just clone it, run ```npm init``` and you are good to go.

## Webpack
There are several Module Bundlers out there but we are going to use [WebPack 2.x](https://webpack.js.org/).  Webpack's scope is actually much broader than just a JavaScript bundler, it can also bundle CSS and even image files (e.g. png files).  All this functionality makes it very flexible, but also a bit trickier to configure.

### Installation
Webpack is a node package, so installation is simple:

```bash
$ npm install webpack --save-dev
```

Rather than running Babel directly, from now on, we are going to run Webpack, which will invoke Babel.  We have to install the Babel plugin for Webpack to make this work.  The plugins are called "loaders" in Webpack lingo, and they are (all together now!) available as node packages:

```bash
$ npm install babel-loader --save-dev
```

### Configuration
Once all this is installed we need to configure Webpack.  This is done using a file called ```webpack.config.js```, so create this at the project root folder and add the following into it:

```JavaScript
var path = require('path')

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
}
```

Here we configure Webpack to 'start' (```entry```) from our ```./src/app.js``` file.  Webpack will analyze the dependencies of this file and then the dependencies of those files, etc. and 'bundle' them in a file called ```./dist/app.js``` (```output```).  We also set up Webpack to create inline source maps (```devtool```).

### Build
Now we just have to add a build script in ```package.json``` to use Webpack instead of Babel:

```JSON
    "build": "webpack"
```

As you project grows, the compilation will take a bit longer.  You can make this a more pleasant experience by adding a progress bar and some colors.  If you like that sort of thing, change the build line to:

```JSON
    "build": "webpack --progress --colors"
```

Additionally, you probably want to remove the dist folder right before you (re)build, just to avoid having left over scripts accumulate in that folder.  As webpack will comnpletely rebuild the dist folder every time you run build, this is good practice.  ```npm``` actually supports ```pre``` and ```post``` hooks for scripts. They are automatically run by ```npm``` before (pre) and after (post) their respectively script.  These pre/post scripts are just another script in your package.json file, except they start with either ```pre``` or ```post``` and they are automatically run by npm when you run their namesake script, so e.g. ```prebuild``` will run automatically before you run ```build```.  So let's add our ```prebuild``` script to ```package.json```:

```JSON
    "prebuild": "rm -rf dist",
    "build": "webpack --progress --colors"
```

>Note that this uses a cli-command (```rm```) which only works on a ```-nix``` OS like MacOS.  If you want to make this more OS agnostic you can use a tool like [del-cli](https://www.npmjs.com/package/del-cli).


### Watch
Webpack has a built-in Watch feature, which you enable with the ```---watch``` flag, so let's change the watch script in ```package.json``` to:

```JSON
    "watch": "webpack --progress --colors --watch"
```

### Code Splitting
At the moment, our application is not using any 3rd party libraries but a typical JavaScript application will.  With our current setup, when we ```build``` our bundle, any 3rd party library will be bundled with our custom application logic.

This is not ideal. Our application logic will change regularly whereas the code in the 3rd party libabry will not change at all, assuming we keep using the same version of that libabry.  Browsers can cache asset files if its contents does not change but, because there is only 1 bundle/file who's content will change every time we make a change to our application logic, browsers will have to download the whole bundle every time, including the large part of 3rd party code that did not change.

It would be much better if we could split the bundle into at least 2 chunks, 1 relatively small chunk that contains our application logic and that will change regularly, and one relatively large chunk that contains all the vendor libraries and rarely changes.  That way, browsers can cache the large vendor chunk and just have to download our application logic every time.

Luckily, with Webpack, this is relatively easy to configure.  Lets introduce a 3rd party libary and see what happens with the current setup.  We will use ```lodash``` as an example as it is a very popular libary that you most likely will be using yourself at some point.  Start by installing it from npm:

```bash
$ npm install lodash --save
```

Then introduce it in your code by importing it in ```sayHello.js``` (there are better ways to import from lodash, this is just an example) and use it, here we are using the ```trim()``` function:

```javascript
import _ from 'lodash'

const sayHello = (name = 'Mark') => `Hello ${ _.trim(name) }`

export default sayHello
```

And finally re-build your bundle:

```bash
$ npm run build
```

If you look at ```dist/app.js``` now, you will see that it now contains the lodash JavaScript bundled with your own JavaScript.  You will also notice that this significantly increased the size of your bundled JS from less than 8K to more than 1.4M!  And now, every time you make a change to your application logic, which makes up less than 0.5% of all the code, all your users will have to download the whole 1.4M file again.

So how do we split these files so the users only have to download what actually changed?  First we need to tell Webpack that we have multiple entry points.  So open up ```webpack.config.js``` and modify it like this:

```javascript
var path = require('path')

module.exports = {
  entry: {
    app: './src/app.js',
    vendor: 'lodash'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }, {
            loader: 'eslint-loader',
            options: { fix: true }
          }
        ]
      }
    ]
  }
}
```

Note that we added 2 entry points called ```app``` and ```vendor``` and that we tell it to produce output as ```[name].js``` instead of the old ```app.js```.  This is because we now need to produce 2 output files and so we cannot name it ```app.js``` anymore.  Instead we use a placeholder, ```[name]```, which will get replaced by the entry names (app and vendor).

Now when you run ```npm run build```, you'll see that two bundles will get created: ```app.js``` and ```vendor.js```.  But, if you inspect these, you will find that the code for ```lodash``` is present in both these files!  

To solve that, we will need to use the ```CommonsChunkPlugin```.  It allows us to extract all the common modules from different bundles and add them to the common bundle. If a common bundle does not exist, then it creates a new one.

We can modify our webpack config file to use the CommonsChunkPlugin as follows:

```javascript
var webpack = require('webpack')
var path = require('path')

module.exports = {
  entry: {
    app: './src/app.js',
    vendor: 'lodash'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'],
      minChunks: function (module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    })
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }, {
            loader: 'eslint-loader',
            options: { fix: true }
          }
        ]
      }
    ]
  }
}
```

When you run ```npm run build``` , you'll now see 3 bundles will get created: ```app.js```, ```manifest.js``` and ```vendor.js```.  ```app.js``` will only contain your application logic, ```manifest.js``` will contain all the  webpack runtime code which helps webpack do its job and ```vendor.js``` will contain the vendor's JavaScript.  Although now we have 3 "bundles" instead of the 1 we started with, the overhead is offset by the long term caching benefits that we obtain.

We now have to reference these 3 scripts in our HTML so please change index.html:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript FTW</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="/dist/manifest.js"></script>
    <script src="/dist/vendor.js"></script>
    <script src="/dist/app.js"></script>
  </body>
</html>
```


### Additional Features
Webpack comes with a feature called the Webpack Development Server which offers somewhat similar functionality to browser-sync.  Since we are already using browser-sync, we are going to stick to that, but if you are going to do ```React.js``` development you should really look into this tool (with [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)).  You can install it with:

```bash
$ npm install webpack-dev-server --save-dev
```

And then, replace watch in ```package.json``` with the following line:

```JSON
    "watch": "webpack-dev-server --progress --colors"
```
