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
