/**
 * @file abort
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';

let tap = require('tap');
let Contingency = require('../../index')
let abortStates = require('../mocks/abort')

let testAbort = new Contingency(abortStates, {derp: 'herp'})
testAbort.start()
.then(function(res) {
  console.log(res);
})
.catch((err) => {
  // console.log(err);
})

testAbort.on('start', (result) => {
  // console.log(result);
})

testAbort.on('error', (err) => {
  // console.log(err);
})

testAbort.on('complete', (result) => {
  console.log(result);
})

testAbort.on('abort', (result) => {
  console.log('aborted');
  console.log(result);
})

setTimeout(() => {
  testAbort.abort()
}, 400)