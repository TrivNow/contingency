/**
 * @file actualAbort
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module actualAbort
 */

module.exports = {
  name: 'abort',
  //Set up your state scope on this.
  init: function() {
    return true
  },
  //Setup this state transition.
  enter: function() {
    this.Data.actualAbort = true
    return true
  },
  run: function() {
    return {to: 'increment'}
  },
  exit: function() {
    return true
  }
}