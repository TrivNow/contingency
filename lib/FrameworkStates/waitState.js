/**
 * @file waitState
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Trivnow-Automation
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
let Promise = require('bluebird')

/**
 *
 * @module waitState
 */

module.exports = {
  name: 'wait',
  //Set up your state scope on this.
  init: function() {
    this.elapsed = 0
    return Promise.resolve(true)
  },
  //condition check, #run if ok, #exit if not
  enter: function() {
    return Promise.resolve(true)
  },
  run: function(waitTime, pendingTransition, setTimer) {
    return new Promise((resolve, reject) => {
      setTimer(setTimeout(() => {
        // console.log(`${this.elapsed += waitTime}ms Spent so far in wait state.`);
        resolve({to: pendingTransition})
      }, waitTime))
    })
  },
  exit: function() {
  }
}