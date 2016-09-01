/**
 * @file abort
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
let _ = require('lodash')
let tap = require('tap');
let Contingency = require('../../index')
let abortStates = require('../mocks/abort')
let workingIncrement = require('../mocks/abort/states/increment')
let workingGather = require('../mocks/abort/states/gatherData')
let actualAbort = require('../mocks/abort/states/actualAbort')


tap.test('Machine can be externally aborted, falls back to its default abort state.', (t) => {
  t.plan(2)

  let thisTestsStates = _.cloneDeep(abortStates)
  thisTestsStates.states.push(workingGather, workingIncrement)

  let testAbort = new Contingency(thisTestsStates, {derp: 'herp'})
  testAbort.start()
    .then(function(result) {
      t.notOk(result.aborted, 'Aborted is false in object returned by start')
    })
    .catch((err) => {
      console.log(err);
    })

  testAbort.on('abort', (result) => {
    t.ok(result.aborted, 'Abort called, aborted is true')
  })

  setTimeout(() => {
    testAbort.abort()
  }, 400)
})

tap.test('Machine can be externally aborted, uses a custom abort state', (t) => {
  t.plan(3)

  let thisTestsStates = _.cloneDeep(abortStates)
  thisTestsStates.states.push(workingGather, workingIncrement, actualAbort)

  let testAbort = new Contingency(thisTestsStates, {derp: 'herp'})
  testAbort.start()
    .then(function(result) {
      t.notOk(result.aborted, 'Aborted is false in object returned by start')
    })
    .catch((err) => {
      console.log(err);
    })

  testAbort.on('abort', (result) => {
    t.ok(result.aborted, 'Abort called, aborted is true')
    t.ok(result.output.actualAbort, 'Property set by abort override is present.')
  })

  setTimeout(() => {
    testAbort.abort()
  }, 400)
})