# Quick Start
I'm sure you don't want to go through this whole guide everytime you start a new JavaScript project, so I've summerized everything to get you going quickly into as few steps as possible in this chapter.  

>If even this is too much for you, there is actually a started-project included in this repository, under the ```Code``` folder.  You could use that as a starter template for your projects, just copy it and rename the ```newProject ``` folder to your project name, cd into that folder and run:
>
>```bash
>$ npm init
>```

I am going to assume that you have [Node.js (and npm)](https://nodejs.org/en/download/) installed, if not please do so now.

## Prepare Your Project

```bash
$ mkdir -p <Your-Project-Name>/src/lib  && mkdir <Your-Project-Name>/dist
$ cd <Your-Project-Name>
$ npm init --yes
```

## Install Dependencies

```bash
$ npm install browser-sync babel-cli babel-preset-es2015 webpack babel-loader --save-dev
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

### Webpack
Create a ```webpack.config.js``` file with the folowing content:

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

### package.json scripts
Add the following to you ```package.json``` file:

```JSON
  "scripts": {
    "build": "webpack --progress --colors",
    "watch": "webpack --progress --colors --watch"
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
Create an ```sayHello.js``` file in the ```src/lib``` folder, add the following content:

```JavaScript
const sayHello = (name = 'Mark') => `Hello ${ name }`

export default sayHello
```

Create an ```app.js``` file in the ```src``` folder, add the following content:

```JavaScript
import sayHello from './lib/sayHello'

document.getElementById('app').innerHTML = `<h1>${ sayHello() }<h1>`
```

## Start Application

```bash
$ npm run watch
```

```bash
$ browser-sync start --server --files "dist/*.js, index.html"
```
