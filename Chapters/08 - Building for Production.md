# Building for Production
So far, we have been using the "watch" script to run our application in development.  This is however not how we want to run our application in production.  For starters, let's look at the size of our bundled JavaScript, it tops out at 4.8K.  Considering we have barely any code in our source file (106B), that's pretty large, so we want to minimize this; smaller JavaScript means less bandwidth usage for our users and faster downloads.

# Webpack Config for Production
We are going to have to tinker with the Webpack configuration to create our production ready build, however, rather than changing the (development) configuration we currently are using, we will keep that and create a separate configuration for production.  We can tell Webpack to use that configuration rather than the default ```webpack.config.js``` with a flag.  Make a copy of ```webpack.config.js``` and call it ```webpack.prod.config.js```:

```bash
$ cp webpack.config.js webpack.prod.config.js
```

The first configuration we are going to change is the ```devtool``` setting, currently this is set to ```inline-source-map``` which provides us with a source map for easy debugging in development, but we don't need this in production so let's set this to ```cheap-module-source-map```

Open up webpack.prod.config.js and change the ```devtool``` setting:

```JavaScript
  devtool: 'cheap-module-source-map'
```

Now let's rerun Webpack with the new production configuration file, we can create a new script in ```package.json``` to facilitate this process:

```JSON
    "prod": "webpack --config webpack.prod.config.js -p"
```

Also notice the ```-p``` flag, this runs Webpack in production mode, which performs extra optimizations for production builds, including minification.

```bash
$ npm run prod
```

When you look at the produced JavaScript files now, you'll see a dramatic drop in file size, mine went from 4.8K to 596B, that's more than 85% less than the development build.

We can push this even further down by telling Webpack to run in the node ```PRODUCTION``` environment.  This will remove various test helpers from our budle which we do not need in production.  Change your "prod" script to the following:

```JSON
    "prod": "NODE_ENV=production webpack --config webpack.prod.config.js -p"
```

>This actually did not change the size of my compiled files at all but this could be due to the extremely small size of the source code to begin with.  As your application gets more complex, this should reduce the size of your compiled code.

# Plugins to improve Production Building
There are [several Webpack plugins](https://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin) available that perform other enhancements to your code, you can add them to your build process as required.

## Remove debugging statements
```strip-loader``` is a Webpack plugin that can strip custom functions from your code. This can be useful if you want to use debug statements while developing your application but don't want this info exposed in your production code.  It comes as an npm package so you install it with:

```bash
$ npm install  strip-loader --save-dev
```

as you can see, it is just another loader (like Babel-loader and eslint-loader) and so we can include it in the loader array.  When you do, you pass it configuration in the form of a query string.  In our case, we want to strip console.log statements so add this to your ```webpack.prod.config.js``` file:

```JavaScript
      loaders: ['babel-loader', 'eslint-loader', 'strip-loader?strip[]=console.log']
```

If you want to strip other things, e.g. ```debug```, you can add them to the query string:

```JavaScript
      loaders: ['babel-loader', 'eslint-loader', 'strip-loader?strip[]=console.log,strip[]=debug']
```

__For other plugins, and how to use them, please see https://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin.__
