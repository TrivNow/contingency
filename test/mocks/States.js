/**
 * @file States
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */
var Promise = require('bluebird')

module.exports = {
  Plain: {
    name: 'plain',
    //Set up your state scope on this.
    init: function() {
      // return Promise.resolve(true)
      return true
    },
    //condition check, #run if ok, #exit if not
    enter: function() {
      return true
    },
    run: function() {
      return {done: true}
    },
    exit: function() {
      return true
    }
  },
  promise: {
    name: 'promise',
    //Set up your state scope on this.
    init: function() {
      return Promise.resolve(true)
    },
    //condition check, #run if ok, #exit if not
    enter: function() {
      return Promise.resolve(true)
    },
    run: function() {
      return Promise.resolve({done: true})
    },
    exit: function() {
      return Promise.resolve(true)
    }
  },
  bad: {
    name: 'bad',
    //Set up your state scope on this.
    init: function() {
      return Promise.reject(new Error())
    },
    //condition check, #run if ok, #exit if not
    enter: function() {
      return false
    },
    run: function() {
      return Promise.resolve(false)
    },
    exit: function() {
      throw new Error()
      return Promise.resolve(true)
    }
  }
}