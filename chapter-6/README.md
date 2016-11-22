# Unit Testing
Let's get this first out of the way: yes, you should be testing your JavaScript code.  Period.  There is a smorgasbord of testing software available for JavaScript, it doesn't matter which one you pick but you should pick one.  For our purpose, we are going to setup our application testing with [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/).

# Mocha
>Mocha is a feature-rich JavaScript test framework"

It's basically a test runner that manages your tests.  You install it with npm:

```bash
$ npm install mocha --save-dev
```

Mocha itself does not come with an assertion library but it allows you to use any assertion library you wish.

# Chai
>Chai is a BDD / TDD assertion library for node and the browser that can be delightfully paired with any javascript testing framework."

Sounds like a perfect match for Mocha.  The nice thing about Chai is that it has several assertion styles (```should```, ```assert```, ```expect```) that allow the developer to choose the most comfortable.  Installation is a breeze:

```bash
$ npm install chai --save-dev
```

# Setup
Once you have the tools installed, we need to configure our application to start using them.

First create a ```test``` folder where we can put all our tests (this is the location where Mocha by default looks for tests):

```bash
$ mkdir test
```

Create a new file in this directory called ```sayHello-test.js``` and add the following content:

```JavaScript
import {expect} from 'chai';

describe('Application', () => {
  it('is a useless test but gets us started', () => {
    expect(true).to.be.true;
  });
});
```

We are going to use the ```expect``` assertion style, which we indicate with the ```import``` statement on the first line.  What follows is the ```describe``` block that holds out test "suite".  We can define multiple tests in a describe block, although here we only defined 1.  Our actual test is contained in an ```it``` block that clearly describes what that particular test is testing.  Finally, we have the test itself.  Note that this is obviously a useless test as it will always evaluate to true, but we can test our setup with this test.

To run our tests with Mocha, we issue the following command:

```bash
$ ./node_modules/mocha/bin/mocha
```

```SyntaxError: Unexpected token import```

hmmm, not what we were expecting.  The problem is that we are using ES6 code in our tests itself (```import``` is the ES6 way for importing modules) and currently, the way we are running Mocha, it doesn't recognize ES6.  The solution is to use the npm module ```babel-register``` which transpiles our source on the fly:

```bash
$ npm install babel-register --save-dev
```

And then tell Mocha that we want to use babel-register:

```bash
$ ./node_modules/mocha/bin/mocha --require babel-register
```

Rather than typing in this command all the time, lets add a "test" script to our ```package.json``` file and while we are at it, we can add the ```--watch``` flag to watch for changes:

```JSON
    "test":  "mocha --require babel-register --watch"
```

And now you can watch and test by running:

```bash
$ npm run test
```

You should now also see your test passing successfully.  Let's add some more useful tests.

# Add Tests
Change the content of ```sayHello-test.js``` to the following:

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
})
```

Note that we import the module that we want to test.  Because tests live in a different folder, we need to import it from ```../src/lib/sayHello```.  We then add 2 tests in our sayHello suite, one tests that the default parameter is working and the other tests the procedure when passing in a value for the name parameter.  You should see the tests passing as it stands since this is testing already existing functionality.

# Test Driven Development
However, this is not how you should be testing or rather developing.  Ideally, you __first__ create your __tests__ and __then__ you __create__ the minimal __code__ to pass that test.  This is called Test Driven Development or TDD.  Let's see that in action.

We are going to enhance our ```sayHello``` function to always capitalize the name that is being passed into it.  First we will add a test to test this use case:

```JavaScript
  it('Capitilizes the <userName>', () => {
    expect(sayHello('jake')).is.a('string').and.to.equal('Hello Jake')
  })
```

As soon as you save this (and you are still "watching" your tests), you will see that this fails your test, it should be nice and red.  We now have to add the code to our module to make this test pass and become green again which is why this is also known as red-green testing.  Open up ```sayHello.js``` and replace the content with:

```JavaScript
const sayHello = (name = 'Mark') => `Hello ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}`

export default sayHello
```

On save, it should immediately pass all tests again.  You can now also refactor this code with confidence given that you have a test that validates your functionality.
