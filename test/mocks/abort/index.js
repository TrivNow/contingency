/**
 * @file index
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Trivnow-TaskRunner
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

/**
 *
 * @module index
 */

module.exports = {
  name: 'test.abort',
  initial: 'gatherData',
  states: [
    require('./states/gatherData')(),
    require('./states/increment')()
  ]
}