# Environment Set Up

## Prerequisites: Node.js and npm
The tools we are going to use are actually written in JavaScript.  In order to run these tools we will need a JavaScript runtime. Node.js is such a JavaScript runtime (built on Chrome's V8 JavaScript engine) so the first step is to install Node.js.

>We are not going to write any Node.js JavaScript ourselves at the moment, all our code will run in a Browser (which has it's own JavaScript runtime), we just need Node.js for our tool chain.

These build tools are delivered as "node packages".  Node packages can easily be managed (installed, upgraded, uninstalled) with the Node Package Manager or [__npm__](https://www.npmjs.com/).  This is very similar to how linux (e.g. APT or YUM), macOS (e.g. [Homebrew](http://brew.sh/)) and now even Windows ([OneGet](https://github.com/oneget/oneget)) handle software installation.  Since npm comes with Node.js you do not have to install it separately, but you will be using npm extensively during this setup phase and during development, so embrace it.

### Typical install (mandatory)
The installation process varies from platform to platform. [Please follow the instructions for yours](https://nodejs.org/en/download/).

### Alternative install method (optional)
As you start getting more and more into JavaScript development, you might want to start writing your own Node.js applications or tools.  When you go down this road, you will soon find that it is often necessary to switch versions of Node.js, either to support code you wrote a long time ago and don't want to upgrade (but e.g. you still need to be able to fix minor bugs) or maybe because the cloud platforms you deploy these applications to support only certain version of Node.js.  Whatever the reason, the typical install does not allow you to switch versions easily; you would have to uninstall and then re-install Node.js all the time.  Therefore, rather than installing Node.js directly, you can use something called a version management tool.

Node has several version managers, the most common once are [nvm](https://github.com/creationix/nvm) and [n](https://github.com/tj/n).  I personally use ```n``` because I use the [fish shell](https://fishshell.com/) and ```nvm``` does not support fish, but other members in our team use nvm without any issues.  The provided links give ample instructions on how to install either one.  We are not going to use this feature in this guide (we will stick to whatever version of node you installed earlier).  I am just mentioning it in case you start wondering how to accommodate coding using different version of the Node.js runtime.

### Alternative install method 2 (optional)
Facebook is very active in the JavaScript community these days and has released an alternative to npm called [Yarn](https://yarnpkg.com/).  It is supposed to be a much faster alternative to npm but it does not (yet) offer 100% coverage of npm functionality, so I have not made the switch yet.  We will be using npm.  However, you are free to use Yarn yourself.  It should work just as well as npm for what we are going to do.

## Initializing the Project
To start a new JavaScript project, we are going to create a new directory that will hold all our code and then change into that new directory:

```bash
$ mkdir newProject
$ cd newProject
```

We are going to manage our project as a node package.  This makes it much easier to manage our dependencies and our project as a whole.  For this we first have to initialize our node package which we do with the ```npm init``` command.  All this really does is create a ```package.json``` file in our project folder (you could create it manually too) that can hold our dependencies and some other interesting stuff.

```bash
$ npm init --yes
```

The ```--yes``` flag will create a ```package.json``` file with "reasonable guesses", i.e. default values, which for us, right now, is all we need.  We can now start installing our dependencies.


## Babel
ES2015 was a significant update to the JavaScript language, providing many new features that make programming in JavaScript more idiomatic.  Also, [the latest versions of most browsers have by now adopted almost all features of this standard](http://kangax.github.io/compat-table/es6/) and so you should really be coding using ES2015, which is what we will be doing.

Unfortunately, although browser vendors are getting better all the time at forcing users to upgrade to the latest versions, not everybody is.  Exposing ES2015 to those users will cause your JavaScript to fail for them.  This can be mitigated by techniques like 'progressive enhancement' or 'graceful degradation', but why not have your 🎂, and eat it too?  And you can, with a tool called a 'transpiler'.

Transpilers have been around for a while and they typically allow you to write code in one language (e.g. C) and then transpile it into another language (e.g. JS).  This usage of transpilers is typically used to ease the transition from one language to another.  An alternative usage of transpilers is to create abstractions of existing languages (e.g. CoffeeScript) and transpile that to the target language; JavaScript in the case of CoffeeScript.  The authors of those languages typically add features that they feel are missing from the target language.  The transpiler that we need to use though does not transpile cross-language, but cross-version within the same language, i.e. from ES2015 -> ES5.  There are actually several ES2015 -> ES5 transpilers but the one that has been emerging is called [Babel](https://babeljs.io/), and that is the one we will be using.  It allows you to develop your applications using ES2015, run your ES2015 code through Babel and out comes ES5 code.

### Installation
Babel is delivered as a node package (actually multiple packages as you will see).  npm packages can be installed globally (with the -g flag) or locally (default).  While you _can_ install Babel CLI globally on your machine, I prefer to install it locally, project by project.

There are two primary reasons for this (from the Babel documentation):

1. Different projects on the same machine can depend on different versions of Babel allowing you to update one at a time.
2. It means you do not have an implicit dependency on the environment you are working in. Making your project far more portable and easier to setup.
We can install Babel CLI locally by running:

```bash
$ npm install babel-cli --save-dev
```

Note the ```--save-dev``` flag passed to npm.  This records the dependency into the ```package.json``` file.  ```package.json``` can record 2 types of dependencies, development dependencies (using the --save-dev flag) which are packages that are only needed for development and testing.  Since we are only going to use Babel during development and testing (in production we will run the code produced by Babel, which itself obviously does not need Babel anymore, it's just ES5 JavaScript).  Dependencies that are also required during production are "regular" dependencies and get recorded using the ```-save``` flag.  When you deploy an npm project to production, you can tell it to skip installing devDependencies, saving resources on your Production machines.  Go ahead and open up the package.json file, you should see  a new line added under devDependencies that looks something like:

```JSON
"devDependencies": {
  "babel-cli": "^6.0.0"
}
```

Don't worry too much about this, just know that this is how we are going to manage our project dependencies: this line tells us that our project has a devDependency on babel-cli v6.0.0.

Now, out of the box, Babel doesn’t do anything (welcome to the weird and wonderful world of JavaScript tooling!). It parses your JavaScript code and then generates the same code back out again.  In order for it to actually do anything, you have to provide it plugins.  It is these plugins that perform the transformations on the parsed code.  And there are many, many plugins.  In fact, there is a plugin for each ES2015 feature that can be transformed (["Do one thing, and do it well"](https://en.wikipedia.org/wiki/Unix_philosophy)), e.g. there is a plugin for [ES2015 arrow functions](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-es2015-arrow-functions), [ES2015 Classes](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-es2015-classes), [ES2015 destructuring](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-es2015-destructuring) etc.  If you want to cover all of ES2015 features, you need to include all those plugins.  Obviously, if you would have to do this every time you create a new project, this would get annoying very quickly.

Luckily the Babel people thought of this and gave us what they call __Presets__.  These are pre-configured collections of plugins that cover most use cases.  E.g. there is a [Preset for ES2015](http://babeljs.io/docs/plugins/preset-es2015/) that contains all the plugins to transform all ES2015 features to ES5, that would be a good start for us.  These Presets are delivered as Node packages and can be installed with a simple npm command:

```javascript
$ npm install babel-preset-es2015 --save-dev
```

The only thing that remains now is telling Babel to use this "es2015" Preset.  You can do this by creating a file called .babelrc in your project root folder and add the following in this file:

```JSON
{
  "presets": [
    [
      "es2015",
    ]
  ]
}
```

And now, you can finally churn out ES5 code from your ES2015 source code.  Since we installed Babel locally, the executable actually resides in ```./node_modules/.bin/babel``` of your project.  Assuming that your source code lives in ./src and you want to write your compiled code to ./dist, the full command would be:

```bash
$ ./node_modules/.bin/babel src -d dist
```

Because this is a bit long to type every time, we can also create a script alias in the package.json file called "build".  Add the following to the existing ```scripts``` object:

```JSON
"scripts": {
  ...
  "build": "babel src -d dist"
  ...
},
```

>Note that in package.json you do not have to specify the location of the Babel executable.  It knows where it lives.

You can now run your build by simply executing:

```bash
$ npm run build
```

That's enough of setup for now, lets code something!
