/**
 * @file sendMail
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Trivnow-TaskRunner
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module sendMail
 */

module.exports = function(){
  return {
    name: 'gatherData',
    //Set up your state scope on this.
    init: function() {
      this.Data.count = 0
      return true
    },
    //Setup this state transition.
    enter: function() {
      return true
    },
    run: function() {
      return {to: 'increment'}
    },
    exit: function() {
      return true
    }
  }
}