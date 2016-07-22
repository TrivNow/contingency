/**
 * @file State
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

let tap = require('tap');

let State = require('../../lib/State')
let States = require('../mocks/States')

tap.test('Basic State',(t) => {
  t.plan(6)
  let Basic = new State(States.Basic)
  let init = Basic.init()

  t.type(init.then, 'function', 'Init wraps return values in a promise.')
  init.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })

  let enter = Basic.enter()
  t.type(enter.then, 'function', 'Enter wraps return values in a promise.')
  enter.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })

  let run = Basic.run()
  t.type(run.then, 'function', 'Run wraps return values in a promise.')
  run.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })
})