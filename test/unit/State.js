/**
 * @file State
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

let tap = require('tap');

let State = require('../../lib/State')
let States = require('../mocks/States')

tap.test('State lifecycle return values - Plain',(t) => {
  t.plan(9)
  let PlainState = new State(States.Plain)
  let init = PlainState.init()

  t.equal(PlainState.currentState(), States.Plain.name, 'Has the correct name property')

  t.type(init.then, 'function', 'Init wraps return values in a promise.')
  init.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })

  let enter = PlainState.enter()
  t.type(enter.then, 'function', 'Enter wraps return values in a promise.')
  enter.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })

  let run = PlainState.run()
  t.type(run.then, 'function', 'Run wraps return values in a promise.')
  run.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })

  let exit = PlainState.exit()
  t.type(exit.then, 'function', 'Exit wraps return values in a promise.')
  exit.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })
})

tap.test('State lifecycle return values - Promises',(t) => {
  t.plan(9)
  let PromiseState = new State(States.promise)
  let init = PromiseState.init()

  t.equal(PromiseState.currentState(), States.promise.name, 'Has the correct name property')

  t.type(init.then, 'function', 'Init wraps return values in a promise.')
  init.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })

  let enter = PromiseState.enter()
  t.type(enter.then, 'function', 'Enter wraps return values in a promise.')
  enter.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })

  let run = PromiseState.run()
  t.type(run.then, 'function', 'Run wraps return values in a promise.')
  run.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })

  let exit = PromiseState.exit()
  t.type(exit.then, 'function', 'Exit wraps return values in a promise.')
  exit.then(function(result){
    t.ok(result, 'Returns wrapped value')
  })
})

tap.test('Failing State lifecycle return values ',(t) => {
  t.plan(3)
  let PromiseState = new State(States.bad)
  let init = PromiseState.init().catch(function(err) {
    t.type(err, 'Error', 'Resolves to an error object.')
  })

  let enter = PromiseState.enter().catch(function(err) {
    t.type(err, 'Error', 'Resolves to an error object.')
  })

  let run = PromiseState.run().catch(function(err) {
    t.type(err, 'Error', 'Resolves to an error object.')
  })
})