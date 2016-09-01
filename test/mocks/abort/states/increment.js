/**
 * @file buildTemplate
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Trivnow-TaskRunner
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module buildTemplate
 */

module.exports = {
  name: 'increment',
  //Set up your state scope on this.
  init: function() {
    return true
  },
  //Setup this state transition.
  enter: function() {
    if(this.Data.count >= 500){
      return {to: 'done'}
    }
    return true
  },
  run: function() {
    this.Data.count += 1
    return {to: 'increment', wait: 10}
  },
  exit: function() {
    return true
  }
}