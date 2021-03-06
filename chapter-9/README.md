# Quick Start
I'm sure you don't want to go through this whole guide every time you start a new JavaScript project, so I've summarized everything to get you going quickly in as few steps as possible in this chapter.

>If _even this_ is _too much_ for you, there is actually a starter-project included in this repository, under the ```Code``` folder, called ```newProject```.  You could use that as a starter template for your projects.  Just copy it and rename the ```newProject ``` folder to your project name, cd into that folder and run:
>
>```bash
>$ npm init
>```

I am going to assume that you have [Node.js (and npm)](https://nodejs.org/en/download/) installed.  If not, please do so now.

## Prepare Your Project

```bash
$ mkdir -p <Your-Project-Name>/src/lib && mkdir <Your-Project-Name>/dist \
 && mkdir <Your-Project-Name>/test
$ cd <Your-Project-Name>
$ npm init --yes
```

## Install Dependencies

```bash
$ npm install browser-sync babel-cli babel-preset-es2015 \
  webpack babel-loader eslint eslint-loader lodash tape \
  html-webpack-plugin faucet babel-register --save-dev
```

## Configure
### Babel
Create a ```.babelrc``` file with the folowing content:

```JSON
{
  "presets": [
    [
      "es2015"
    ]
  ]
}
```

### ESLint
Run:

```bash
$ ./node_modules/.bin/eslint --init
```

```bash
$ (
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
)
```

Then edit ```.eslintrc.js```:

```JavaScript
module.exports = {
  'extends': 'airbnb-base',
  'plugins': [
    'import'
  ],
  'rules': {
    'semi': [2, 'never']
  },
  'env': {
    'browser': true
  }
}
```

### Webpack
Create a ```webpack.config.js``` file with the folowing content:

```JavaScript
var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
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

Create a ```webpack.prod.config.js``` file with the folowing content:

```JavaScript
var webpack = require('webpack')
var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'],
      minChunks: function (module) {
        // this assumes your vendor imports exist in the node_modules directory
        return module.context && module.context.indexOf('node_modules') !== -1;
      }
    })
  ],
  devtool: 'cheap-module-source-map',
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

### package.json scripts
Add the following to you ```package.json``` file in the ```scripts``` section:

```JSON
  "scripts": {
    "prebuild": "rm -rf ./dist",
    "build": "webpack --progress --colors",
    "watch": "webpack --progress --colors --watch",
    "test": "tape --require babel-register test/**/*.js | faucet",
    "preprod": "rm -rf ./dist",
    "prod": "npm test && webpack --config webpack.prod.config.js -p"
  }
```

## Start files (this is optional)
### HTML
Create an ```index.html``` file in the root folder, add the following content:

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <div id="app"><div>
    <script src="/dist/manifest.js"></script>
    <script src="/dist/vendor.js"></script>
    <script src="/dist/app.js"></script>
  </body>
</html>
```

### JavaScript
Create a ```sayHello.js``` file in the ```src/lib``` folder and add the following content:

```JavaScript
import _ from 'lodash'

const sayHello = (name = 'Mark') => `Hello ${_.trim(name).charAt(0).toUpperCase() + _.trim(name).slice(1).toLowerCase()}`

export default sayHello
```

Create an ```app.js``` file in the ```src``` folder, add the following content:

```JavaScript
import sayHello from './lib/sayHello'

document.getElementById('app').innerHTML = `<h1>${ sayHello() }<h1>`
```

Create a ```sayHello.spec.js``` file in the ```test``` folder and add the following content:

```JavaScript
import test from 'tape'
import sayHello from '../src/lib/sayHello'

test('sayHello without a parameter', (t) => {
  const actual = sayHello()
  const expected = 'Hello Mark'

  t.equal(actual, expected, 'When passing no parameters to sayHello(), the resulting string equals "Hello Mark"')
  t.end()
})

test('sayHello with a parameter', (t) => {
  const actual = sayHello('Tony')
  const expected = 'Hello Tony'

  t.equal(actual, expected, 'When passing "Tony" to sayHello(), the resulting string equals "Hello Tony"')
  t.end()
})

test('sayHello capitalizes the name', (t) => {
  const actual = sayHello('jake')
  const expected = 'Hello Jake'

  t.equal(actual, expected, 'When passing "jake" to sayHello(), the resulting string equals "Hello Jake"')
  t.end()
})


test('sayHello trims the name', (t) => {
  const actual = sayHello('  Thao  ')
  const expected = 'Hello Thao'

  t.equal(actual, expected, 'When passing "   Thao   " to sayHello(), the resulting string equals "Hello Thao"')
  t.end()
})
```

## Test Application

```bash
$ npm test
```

## Start Application

```bash
$ npm run watch
```

```bash
$ browser-sync start --server --files "dist/*.js, index.html"
```
