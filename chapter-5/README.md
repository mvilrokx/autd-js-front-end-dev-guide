# Linting your Code
Linting is the practice of scanning your code and flagging "syntactic discrepancies".  A _linter_ is a software tool that compares your code against certain style guidelines and raises errors or warnings when it finds that your code deviates from those guidelines.  Think of it as the spell-checker or grammar-checker for the developer.

The problem is that there is no such thing as "correct" spelling or grammar when it comes to programming languages.  Developers have different styles of coding; some people use tabs for indentation, others use spaces, some use 2 spaces, others 4 etc.  One way isn't inherently better than the other, it's just ... different.

It turns out that JavaScript is particularly susceptible to this because it's so flexible, loosely-typed and it doesn't get compiled.  Some examples:

* semi-colons at the end of a line are optional
* single quotes and double quotes are interchangeable
* indentation is optional

Inevitably, this means that in your code base you will get a mix of all these different styles of coding (even if there is only 1 developer).  Although you might brush this aside as just an aesthetics issue and I "should just get over it", there are actually many reasons to have a common style guide and have your developers adhere to this.  If all code looks the same, it becomes much easier to share this code with other developers or with your future self.  They won't have to learn the ins-and-outs of your particular style, you all use the same style.  This makes code easier to maintain.  Developers also don't have to debate what is the best style, that decision has been made for them.  This should also improve onboarding of new developers.  They don't have to come up with their own style, it's all laid out for them already.

A linter will also catch issues before you run your code and provide less cryptic errors than your runtime engine would throw at you for those types of errors. _This is a major time saver_.

On top of all this, the JavaScript community has also consolidated around a bunch of "Best practices" for writing JavaScript (e.g. using === instead of == for comparisons) and these can also be enforced by linters.  In fact, the first linter, [JSLint](http://www.jslint.com/) was created for exactly this reason; to enforce the best practices discussed in the book "JavaScript, The Good Parts."

All of this to convince you that you really should be linting your JavaScript code!

## ESLint
True to form, there are several popular JavaScript linters out there, but we are going to settle on [ESLint](http://eslint.org/), which offers the [most flexibility](http://eslint.org/docs/rules/), and as a result seems to be the most poplar amongst JavaScript developers.  It also has the widest support of ES6 features.  To install it, run:

```bash
$ npm install eslint --save-dev
```

After that, you'll need to configure ESLint, basically tell it what JavaScript coding style you prefer.  This is where ESLint shines.  Remember at the beginning I mentioned that there are many different, all acceptable, ways to code JavaScript.  Well ESLint allows you to configure it to check any and all of those ways.  You tell it what to check for and it will enforce consistency.  The [list of rules](http://eslint.org/docs/rules/) is pretty overwhelming and you can even add your own ones.  However, instead of starting a configuration from scratch, you can actually use existing Style Guides, e.g. a popular Style Guide is maintained by Airbnb created, you just tell ESLint that you want to use that one, which is what we will be doing.

The easiest way to configure ESLint is to run:

```bash
$ ./node_modules/.bin/eslint --init
```

It will ask you a few questions which I answered as following:

```
? How would you like to configure ESLint? Use a popular style guide
? Which style guide do you want to follow? Airbnb
? What format do you want your config file to be in? JavaScript
```

Next we have to ensure packages are installed with correct version numbers by running:

```bash
$ (
  export PKG=eslint-config-airbnb;
  npm info "$PKG@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "$PKG@latest"
)
```

Which produces and runs a command like:

```bash
npm install --save-dev eslint-config-airbnb eslint@^#.#.# eslint-plugin-jsx-a11y@^#.#.# eslint-plugin-import@^#.#.# eslint-plugin-react@^#.#.#
```

This should suffice to configure ESLint for our needs.  You can now run ESLint on our code with the following command:

```bash
$ ./node_modules/.bin/eslint src/**
```

Of course, rather than running ESLint separate like this, we want to integrate it in our tool chain.  There are many ways you can integrate linters in your tool chain, including in your IDE, but we are going to add it to our "build", which means, depending which bundler you choose to use, adding it to Webpack.

## Integrate ESLint with Webpack

#### Installation
Just like with Babel, we need a loader to integrate ESLint into Webpack:

```bash
$ npm install eslint-loader --save-dev
```

#### Configuration
Once installed, we have to add some configuration to ```webpack.config.js``` to include it in our build process:

```
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }, {
            loader: 'eslint-loader'
          }
        ]
      }
    ]
  }
```

>Note that the order is important!  Webpack process each loader in the reverse order they appear in the loaders array.  Since we want to lint our Source Code, i.e. our ES6 code, not the Babel processed code, we have to put eslint-loader after babel-loader.  ESLint can lint ES6 code just fine.

## Fine Tuning Our Lint Configuration
When you run ESLint the first time, even on our small Source Code example, you will see that it immediately raises several errors.  Some of these are legit, but others are not, so let' s get rid of those errors by tweaking the configuration of ESLint.

When you ran ```./node_modules/.bin/eslint --init``` it actually created a config file for you, it is called ```.eslintrc.js``` and it is in this file that we modify the ESLint configurations so go ahead and open it up.

```JavaScript
module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ]
};
```

You can see here that we are using the Airbnb Style Guide, which in turn came with a few extra plugins that we actually don't need, so let's start by removing these.

Both the ```react``` and the ```jsx-a11j``` plugins are only needed if you do React.js development, which we are not, so you can remove those lines from the ```.eslintrc.js``` file:

```JavaScript
module.exports = {
  "extends": "airbnb",
  "plugins": [
    "import"
  ]
};
```

These plugins were actually also installed (when you ran ESLint init) using npm (you can see this in your ```package.json``` file). I tried removing them as we don't use them, but when I did, ESLint raised an error (not a linting error, a runtime error) so looks like we have to keep them.

## [Disallow Undeclared Variables (no-undef)](http://eslint.org/docs/rules/no-undef)
```3:1   error  'document' is not defined       no-undef``` 

This error gets raised when ESLint finds a variable in your code that you did not declare first, maybe because you forgot to declare it (which is totally acceptable in JavaScript but considered (very) bad practice because it makes those variables implicitly 'globals') or because you misspelled them.

In this case though it is raising the error on ```document```, and yes, of course we did not declare this; ```document``` is available in the browser environment by default, I don't have to declare it.  The same goes for e.g. ```console``` (if you'd have any ```console.log``` statements in your code, ESLint would have raised the same error on ```console```).  

There are actually 2 ways to get rid of this false negative.  You can configure [```globals```](http://eslint.org/docs/user-guide/configuring#specifying-globals) in ESLint which are then ignored, but there are quite a few globals in the browser environment and declaring all those every time is probably not a good idea.  Instead, you can actually tell ESLint which environment you are going to run your JavaScript code in.  These [```environments```](http://eslint.org/docs/user-guide/configuring#specifying-environments) define global variables that are predefined.  Since we are running our JavaScript in a browser, we will use the ```browser``` environment.  In your ```.eslintrc.js``` file, add the following:

```JavaScript
module.exports = {
  "extends": "airbnb",
  "plugins": [
    "import"
  ],
  __"env": {__
    __"browser": true__
  }
};
```

Now when you run ```npm run watch```, those types of errors will no longer appear.

## [require or disallow semicolons instead of ASI (semi)](http://eslint.org/docs/rules/semi)
```  1:38  error  Missing semicolon               semi```

I actually prefer not to use semi-colons in JavaScript so this is an example of where my preference deviates from the airbnb standards.  No problem though, you can add exceptions to ```.eslintrc.js``` to ignore or change these errors:

```JavaScript
module.exports = {
  'extends': 'airbnb',
  'plugins': [
    'import'
  ],
  __'rules': {__
    __'semi': [2, 'never']__
  },
  'env': {
    'browser': true
  }
}
```

Now ESLint will raise an error (0 = off, 1 = warn, __2 = error__) when it finds a semi-colon ('never' means never a semi-colon, the opposite, and default airbnb setting, is 'always').

## Automatically fix errors
A nice feature of ESLint is that it can actually automatically fix errors for you.  It's pretty conservative when it does this, so it is really safe.  You enable this by passing the ```--fix``` flag to ESLint.  Since we are using Webpack to run ESLint, we have to configure this in our ```webpack.config.js``` file:

```JavaScript
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
```

> Note that there is an [outstanding bug](https://github.com/webpack/webpack/issues/2538) for Webpack "watch" that causes ESLint NOT to re-run when you make a change to your source code that does not change the compiled code.  When you are in coding mode, this should not really be an issue as you are changing the code, but when you are fixing a few ESLint errors here or there and expect these errors to go away after you save the fix, it might now happen as you expect.  E.g. if you fix an issue with spaces in your source code, that usually doesn't affect the compiled code at all, so ESLint will not run in this case and it will appear as if the Linting errors are still there (they aren't though but because ESLint does not run, you cannot see this).  Simply adding some code and then deleting this code will run ESLint for you though.  Also note that enabling auto-fix will practically eliminate this issue as it will fix (and never report) all these issues for you anyway.
