/**
 * @file abortState
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module abortState
 */

module.exports = {
  name: 'abort',
  //Set up your state scope on this.
  init: function() {
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
  }
}