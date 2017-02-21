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
  webpack babel-loader eslint eslint-loader mocha chai \
  babel-register --save-dev
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
var path = require('path')

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
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
    "build": "webpack --progress --colors",
    "watch": "webpack --progress --colors --watch",
    "test": "mocha --require babel-register",
    "test:watch": "npm run test -- --watch",
    "prod": "npm run test && webpack --config webpack.prod.config.js -p"
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
    <script src="/dist/app.js"></script>
  </body>
</html>
```

### JavaScript
Create a ```sayHello.js``` file in the ```src/lib``` folder and add the following content:

```JavaScript
const sayHello = (name = 'Mark') => `Hello ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}`

export default sayHello
```

Create an ```app.js``` file in the ```src``` folder, add the following content:

```JavaScript
import sayHello from './lib/sayHello'

document.getElementById('app').innerHTML = `<h1>${ sayHello() }<h1>`
```

Create a ```sayHello-test.js``` file in the ```test``` folder and add the following content:

```JavaScript
import { expect } from 'chai'
import sayHello from '../src/lib/sayHello'

describe('sayHello', () => {
  it('returns the String "Hello <userName>" when passing <userName>', () => {
    expect(sayHello('Tony')).is.a('string').and.to.equal('Hello Tony')
  })
  it('returns the String "Hello Mark" when NOT passing any <userName>', () => {
    expect(sayHello()).is.a('string').and.to.equal('Hello Mark')
  })
  it('Capitilizes the <userName>', () => {
    expect(sayHello('jake')).is.a('string').and.to.equal('Hello Jake')
  })
})
```

## Test Application

```bash
$ npm run test
```

## Start Application

```bash
$ npm run watch
```

```bash
$ browser-sync start --server --files "dist/*.js, index.html"
```
