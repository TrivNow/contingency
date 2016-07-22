/**
 * @file States
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var Promise = require('bluebird')

module.exports = {
  Basic: {
    name: 'basic',
    //Set up your state scope on this.
    init: function() {
      // return Promise.resolve(true)
      return true
    },
    //condition check, #run if ok, #exit if not
    enter: function() {
      return Promise.resolve(true)
    },
    run: function() {
      return {done: true}
    },
    exit: function() {
    }
  }
}