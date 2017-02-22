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
