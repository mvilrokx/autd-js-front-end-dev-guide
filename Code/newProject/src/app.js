import sayHello from './lib/sayHello'

console.log('App is running')
document.getElementById('app').innerHTML = `<h1>${sayHello()}</h1>`
