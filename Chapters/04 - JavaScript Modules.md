# Modular JavaScript
Modularity has always been a staple of good development; it promotes code-reuse and enhances maintainability.  Unfortunately, writing modular JavaScript was not easy, at least not until node.js came along.  In fact, JavaScript did not have a way to write modules build into the language.  (Read that last sentence again, out loud.)  Over time, this lead to developers building their own strategies and tools to create modular JavaScript.  I will spare you the history lesson and the cornucopia of solutions this has lead to (but you should definitly Google it) and just let you know that, __finally__, ES2015 introduced a native feature in the JavaScript language that supports the creation of modules.  And since we are coding in ES2015 already, this is the only solution we will be using going foreward.

# Our first Module
Lets go back to our example ```app.js``` and introduce some JavaScript Modules to see how they work.  First we create a new folder called ```lib``` that will hold all our JavaScript Modules. 

```bash
$ mkdir lib
$ cd lib
```

In this directory, we create a file called sayHello.js and we move the sayHello function into this new file.  To turn this function into a module, all we need to do is export the function:

```javascript
export const sayHello = (name = 'Mark') => `Hello ${ name }`
```

To use the module in ```app.js``` we have to import the module:

```javascript
import { sayHello } from 'lib/sayHello'

document.getElementById('app').innerHTML = `<h1>${ sayHello() }<h1>`
```

We can actually simplify this a little bit.  A module can namely export multiple objects, but one of those can be set as the default:

```javascript
export default sayHello = (name = 'Mark') => `Hello ${ name }`
```

When you do this, the import statement does not require curly braces for the default object:

```javascript
import sayHello from 'lib/sayHello'

document.getElementById('app').innerHTML = `<h1>${ sayHello() }<h1>`
```

Note that you can name your imported object anything you want, I prefer to call it the same as the function that is being imported, but you don't have to, this works just as well:

```javascript
import welcome from 'lib/sayHello'

document.getElementById('app').innerHTML = `<h1>${ welcome() }<h1>`
```

After saving this, your browser should have already refreshed itself with the new code and you will see that ... it does not work.  You will see an error message in the console of your browser (e.g. DevTools in Chrome) that reads something like this:

```Uncaught ReferenceError: require is not defined(…)```

If you cannot remember having used ```require``` in your code, well, you are right, we didn't.  This error is coming from our compiled code, not from our source code.  And this is raising an interesting problem: how do I know which line in my source code is responsible for this error in the compiled code?  In other words, how does the source code map to the compiled code?

## Source Maps
Of course the JavaScript community has a solution for this issue.  "Source Maps" map your source code to your compiled code so that you can keep writing ES2015 code at development time, run ES5 code (compiled by Babel) in the browser, and still see where in the source code the error comes from (even though the browser never gets to see the actual source code).  This feature is actually build into Babel and can easily be switched on by using the ```-s``` or ```--source-maps``` flag, so lets add this to our ```package.json``` watch script:

```JSON
    "watch": "babel -w src -d dist -s"
```

At this point, you do actually have to stop Babel in the terminal that is "watching" and restart it.  Babel watch does only watch changes in JavaScript, not in the actual Babel configuration.  In order to pick up the fact that you now also want to generate Source Maps, you have to stop and restart watch:

```bash
$ npm run watch
```

Now you will see that the error actually comes from our ```import``` statement in ```app.js```.  So what is going on here?

# Module Loaders
As we discussed at the beginning of this chapter, before ES2015 there was no support for modules in the JavaScript language.  Instead, several tools had emerged that added this sort of functionality to the language.  Babel can actually transpile to most of those solutions but by default it transpiles to the CommonJS model (also used by Node.js), which is where the ```require``` comes from: it transpiles our ```import``` statement into a the following:

```JavaScript
var _sayHello = require('lib/sayHello');
```

Now, ```require``` is a function that is provided by e.g. Node.js, but not by the browser, hence the error ```require is not defined```.  So we are now in the interesting situation where we transpiled ```import```, which is not yet supported by any browser, to ```require```, which is also not supported by any browser.  In fact, none of the Module Loaders are supported by any browser.  There's actually a good reason for this; think about it, these modules are seperate files and ```require``` needs to load these files from the File System, but a browser does not have a File System, so how _could_ this work?

The solution to this problem is to "bundle" all the modules into 1 large file so that when the browser loads this 1 file, it has access to all modules.

## Rollup
There are several Module Bundlers out there but we are going to use [rollup.js](http://rollupjs.org/).  This is a relatively new kid on the block, but it has a few features that other ones are lacking, most importantly it has native suport for ES2015 modules.  Bacause it does, we don't actually have to transpile ```import``` anymore with Babel.  You can tell Babel to not transpile this by adding the following to your Babel configuration in ```.babelrc```:

```JSON
{
  "presets": [
    [
      "es2015",
      {
        "modules": false
      }
    ]
  ]
}
```

### Installation
rollup.js is a node package, so installation is simple:

```bash
$ npm install rollup --save-dev
```

Rather than running Babel directly, from now on, we are going to run rollup, which will invoke Babel.  In order to make this work, we need to install the Babel plugin for rollup.  Of course, this is an npm package:

```bash
$ npm install rollup-plugin-babel --save-dev
```

### Configuration
Once all this is installed we need to configure rollup.  This is done using a file called ```rollup.config.js```, so create this at the project root folder and add the following into it:

```JavaScript
// Rollup plugins
import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/app.js',
  dest: 'dist/app.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
}
```

### Build
Now we just have to change the build script in ```package.json``` to use rollup.js instead of Babel:

```JSON
    "build": "rollup -c",
```

### Watch
Rollup.js has also "watch" functionality, it just has to be installed seperately:

```bash
npm install rollup-watch --save-dev
```

Once this is installed, you can use the ```-w``` flag with the rollup command, lets change this as well in ````package.json```:

```JSON
    "watch": "rollup -c -w"
```

Now when you run ```npm run watch``` your web page should work again.  Rollup.js bundles all your JavaScripts using native ES2015 import/export and converts them into IIFE format (which browsers understand) and then uses Babel to convert all other ES2015 features into ES5 (which the browsers also understand).  You now have a fully functioning, modern JavaScript Front End tooling set up.

## Webpack
I must admit I never used Rollup myself until I started the research for this book and stumbled upon it, I have always used Webpack so I am going to devote this chapter to Webpack as an alternative to Rollup.  Feel free to skip it if you are happy using Rollup but for those that prefer Webpack, read on.

Webpack's scope is actually much broader than just a JavaScript bundler, it can also bundle CSS and even image files (e.g. png files) which is one of the reasons I hesitated to use it as my default in this beginner JavaScript setup book: all this functionality makes it very flexible, but also a bit trickier to configure.  Another reason is that Webpack does not natively support ES2015 modules yet (this is being addressed though in the upcoming WebPack 2).  As it turns out though, when you use Babel, this is actually a bit of an advantage over Rollup where we had to "re-configure" Babel to not convert modules.

So if you already configured your project for Rollup and now want to use Webpack instead, please undo the changes we did to the ```.babelrc``` file and revert it back to it's original:

```JSON
{
  "presets": [
    [
      "es2015"
    ]
  ]
}
```

### Installation
Webpack is a node package, so installation is simple:

```bash
$ npm install webpack --save-dev
```

>If you want to be thourough and uninstall Rollup.js, you do this as followed:

>```bash
>$ npm uninstall rollup rollup-plugin-babel rollup-watch --save-dev
>$ rm rollup.config.js
>```

Just like with rollup.js, rather than running Babel directly, from now on, we are going to run Webpack, which will invoke Babel.  And just like rollup.js we have to install a the Babel plugin for Webpack to make this work.  The plugins are called "loaders" in Webpack lingo, and they are (all together now!) available as node packages:

```bash
$ npm install babel-loader --save-dev
```

### Configuration
Once all this is installed we need to configure Webpack.  This is done using a file called ```webpack.config.js```, so create this at the project root folder and add the following into it:

```JavaScript
module.exports = {
  entry: './src/app.js',
  output: {
    path: './dist',
    filename: 'app.js',
  },
  devtool: 'inline-source-map',
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
```

This is the exact same setup as we did for rollup.js, with the same entry point, same output into the ```dist``` folder, Source Maps inlined and ignoring node_modules.

### Build
Now we just have to change the build script in ```package.json``` to use Webpack instead of rollup.js (or Babel):

```JSON
    "build": "webpack"
```

As you project grows, the compilation will take a bit longer.  You can make this a more pleasant experience by adding a progress bar and some colors.  If you like that sort of thing, change the build line to:

```JSON
    "build": "webpack --progress --colors"
```

### Watch
Webpack (unlike Rollup.js) has a build in Watch feature, which you enable with the ```---watch``` flag, so let's change the watch script in ```package.json``` to:

```JSON
    "watch": "webpack --progress --colors --watch"
```

### Additional Features
Webpack comes with a feature called the Webpack Development Server which offers somewhat similar functionality than browser-sync.  Since we are already using browser-sync, we are going to stick to that, but if you are going to do React.js development you should really look into this tool (with [Hot Module Replacement](https://webpack.github.io/docs/hot-module-replacement.html)).  You can install it with:

```bash
$ npm install webpack-dev-server --save-dev
```

And then, replace watch in ```package.json``` with the following line:

```JSON
    "watch": "webpack-dev-server --progress --colors"
```
