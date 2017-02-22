import _ from 'lodash'

const sayHello = (name = 'Mark') => `Hello ${_.trim(name).charAt(0).toUpperCase() + _.trim(name).slice(1).toLowerCase()}`

export default sayHello
