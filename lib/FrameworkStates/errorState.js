/**
 * @file errorState
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */


module.exports = {
  name: 'error',
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