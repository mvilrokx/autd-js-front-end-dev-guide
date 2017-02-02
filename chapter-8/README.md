# Building for Production
So far, we have been using the "watch" script to run our application in development.  This is however not how we want to run our application in production.  For starters, let's look at the size of our bundled JavaScript; it tops out at 4.8K.  Considering we have barely any code in our source file (106B), that's pretty large, so we want to minimize this; smaller JavaScript means less bandwidth usage for our users and faster downloads.

## Webpack Config for Production
We are going to have to tinker with the Webpack configuration to create our production-ready build, however, rather than changing the (development) configuration we currently are using, we will keep that and create a separate configuration for production.  We can tell Webpack to use that configuration rather than the default ```webpack.config.js``` with a flag.  Make a copy of ```webpack.config.js``` and call it ```webpack.prod.config.js```:

```bash
$ cp webpack.config.js webpack.prod.config.js
```

The first configuration we are going to change is the ```devtool``` setting, currently this is set to ```inline-source-map``` which provides us with a source map for easy debugging in development, but we don't need this in production so let's set this to ```cheap-module-source-map```

Open up webpack.prod.config.js and change the ```devtool``` setting:

```JavaScript
  devtool: 'cheap-module-source-map'
```

Now let's rerun Webpack with the new production configuration file.  We can create a new script in ```package.json``` to facilitate this process:

```JSON
    "prod": "webpack --config webpack.prod.config.js -p"
```

Also notice the ```-p``` flag, this runs Webpack in production mode, which performs extra optimizations for production builds, including minification.

```bash
$ npm run prod
```

When you look at the produced JavaScript files now, you'll see a dramatic drop in file size, mine went from 4.8K to 596B, that's less than 15% of the development build.

This also tells Webpack to run in the node ```PRODUCTION``` environment.  This will remove various test helpers from our bundle which we do not need in production.

## Plugins to improve Production Building
There are [several Webpack plugins](https://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin) available that perform other enhancements to your code.  You can add them to your build process as required.

__For other plugins, and how to use them, please see https://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin__
