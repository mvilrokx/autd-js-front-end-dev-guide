# Unit Testing
Let's get this first out of the way: yes, you should be testing your JavaScript code.  Period.  There is a smorgasbord of testing software available for JavaScript.  It doesn't matter which one you pick but you should pick one.  For our purposes, we are going to setup our application testing with [Tape](https://github.com/substack/tape).


## Tape
>"tap-producing test harness for node and browsers"

TAP stands for [Test Anything Protocol](https://en.wikipedia.org/wiki/Test_Anything_Protocol) and has been around for several decades.  Most automated testing tools actually support TAP output and because it is a standard, there are many processors (reporters) that can take TAP output and generate beautiful reports from it (we will see how, later in this chapter)

So Tape is just a CLI tool that takes in tests and generates TAP as output.

To install:
```bash
$ npm install tape --save-dev
```

## Setup
Once installed, we need to configure our application to start using it.

First create a ```test``` folder where we can put all our tests:

```bash
$ mkdir test
```

Create a new file in this directory called ```sayHello.spec.js``` and add the following content:

```JavaScript
import test from 'tape'

test('A passing test', (assert) => {
  assert.pass('This test will pass.')
  assert.end()
})
```

First we import ```tape``` (and call it ```test```).  Then we created a test using the ```test``` method with the name 'A passing test'.  ```test``` also takes a callback that receives the test object (called ```assert``` in this example).  We then use this test object in our callback to perform the actual test assertions.  In this case we use ```pass``` to generate a passing assertion with a message 'This test will pass.'.  You have to end the test with a call to ```end()``` (otherwise your test will hang).  Alternatively you can tell Tape how many assertions you are planning to run in a test using ```plan()```.  ```end()``` will be called automatically after the nth assertion. If there are any more assertions after the nth, or after ```end()``` is called, they will generate errors, so this is the same as above:

```JavaScript
import test from 'tape'

test('A passing test', (assert) => {
  assert.plan(1)
  assert.pass('This test will pass.')
})
```

To run this tests with Tape, we just run the script with ```node```:

```bash
$ node test/sayHello.spec.js
```

You can also run tests using the tape binary to utilize globbing, for example:

```bash
$ ./node_modules/.bin/tape ./test/*.js
```

```SyntaxError: Unexpected token import```

hmmm, not what we were expecting.  The problem is that we are using ES6 code in our test itself (```import``` is the ES6 way for importing modules) and currently, the way we are running Tape, it doesn't recognize ES6.  The solution is to use the npm module ```babel-register``` which transpiles our source on the fly.

```bash
$ npm install babel-register --save-dev
```

We tell Tape to use babel-register with the ```require``` flag (```-r``` or ```-require```):

```bash
$ ./node_modules/.bin/tape -r babel-register ./test/*.js
```

Rather than typing in this command all the time, lets add a "test" script to our ```package.json``` file (if it already exists, just replace it with this)and while we are at it, we can add the ```--watch``` flag to watch for changes:

```JSON
  "scripts": {
    ...,
    "test":  "tape --require babel-register test/**/*.js"
    ...,
  },
```

And now you can run our tests using:

```bash
$ npm test
```

You should now also see your test passing successfully.  As mentioned earlier, we can pipe TAP into tools that produce better looking reports.  An example of such a tool is ```faucet``` so lets install that

```bash
npm install faucet --save-dev
```

We can now run our results through ```faucet``` by simply piping the output of ```tape``` through ```faucet```.  Addapt your ```test script``` in ```package.json```:

```JSON
  "scripts": {
    ...,
    "test":  "tape --require babel-register test/**/*.js | faucet"
    ...,
  },
```

And now, let's add some more useful tests.

## Add Tests
Change the content of ```sayHello.spec.js``` to the following:

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
```

Note that we import the module that we want to test.  Because tests live in a different folder, we need to import it from ```../src/lib/sayHello```.  We then add 2 tests: one tests that the default parameter is working and the other tests the procedure when passing in a value for the name parameter.  You should see the tests passing as it stands since this is testing already existing functionality.

## Test Driven Development
However, this is not how you should be testing, or rather, developing.  Ideally, you __first__ create your __tests__ and __then__ you __create__ the minimal __code__ to pass that test.  This is called Test Driven Development or TDD.  Let's see that in action.

We are going to enhance our ```sayHello``` function to always capitalize the name that is being passed into it.  First we will add a test to test this use case:

```JavaScript
test('sayHello capitalizes the name', (t) => {
  const actual = sayHello('jake')
  const expected = 'Hello Jake'

  t.equal(actual, expected, 'When passing "jake" to sayHello(), the resulting string equals "Hello Jake"')
  t.end()
})
```

Now when you run your tests, you will see that this fails your test.  It should be nice and red.  We now have to add the code to our module to make this test pass and become green again, which is why this is also known as red-green testing.  Open up ```sayHello.js``` and replace the content with:

```JavaScript
const sayHello = (name = 'Mark') => `Hello ${name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()}`

export default sayHello
```

Rerun the tests and they should pass all tests again.  You can now also refactor this code with confidence given that you have a test that validates your functionality.
