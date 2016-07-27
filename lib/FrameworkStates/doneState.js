/**
 * @file finishedState
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Trivnow-Automation
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
let Promise = require('bluebird')

/**
 *
 * @module finishedState
 */

module.exports = {
  name: 'done',
  //Set up your state scope on this.
  init: function() {
    return true
  },
  //condition check, #run if ok, #exit if not
  enter: function() {
    return true
  },
  run: function() {
    console.log('State transitions finished for this manager instance. Nothing left to do.');
    return {done: true}
  },
  exit: function() {
  }
}