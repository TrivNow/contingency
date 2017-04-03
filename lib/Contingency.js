/**
 * @file Machine
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('lodash')
const debug = require('debug')('contingency:manager')
const Promise = require('bluebird')
const uuid = require('uuid/v4')

Promise.config({
  longStackTraces: false
})
const EventEmitter = require('events')

const State = require('./State')
// const finishedState = new State(require('./FrameworkStates/doneState'))
// const waitState = new State(require('./FrameworkStates/waitState'))
const FrameworkStates = [
  new State(require('./FrameworkStates/doneState')),
  new State(require('./FrameworkStates/waitState')),
  new State(require('./FrameworkStates/errorState'))
]

const abortState = new State(require('./FrameworkStates/abortState'))
/**
 *
 * @module StateMachine
 */

class StateMachine extends EventEmitter{
  constructor(options, initialData) {
    super()
    this.ManagerName = options.name
    this.TaskUUID = uuid()
    this.Data = initialData || {}
    this.startTime = new Date().getTime()
    this.transitionCount = 0

    this.states = new Map();
    _.each(options.states, (s) => {
      let st = new State(s)
      this.states.set(st.name, st)
    })

    if(!this.states.has('abort')){
      this.states.set('abort', abortState)
    }

    _.each(FrameworkStates, (s) => {
      this.states.set(s.name, s)
    })

    this.initialState = options.initial
    this.timeout = options.timeout
    this.initialized = false
    this.aborted = false

    let pending = []
    this.states.forEach((state, key) => {
      pending.push(state.init(this.Data))
    })

    this.pendingInitial = Promise.all(pending)

  }

  start(){
    if(this.managerStarted) throw new Error('Manager is already running.')
    this.managerStarted = true

    return this.pendingInitial
      .then((results) => {

        // Check that these all resolved true _.some()
        if(!_.every(results)){
          throw new Error('Some states failed to initialize')
        }

        debug('States initialized', results.length - 3);
        this.transition({to: this.initialState})
        // let retVal = {name: this.ManagerName, startTime: this.startTime, states: results.length - 3, input: this.Data}
        let retVal = this.getStatus({startTime: this.startTime, states: results.length - 4, input: this.Data})
        this.emit('start', retVal)
        return retVal
      })
      .catch((err) => {
        throw err
      })
  }

  abort(){
    if(this.timer){
      clearTimeout(this.timer)
    }
    // this.on('abort', () => {
    //   this.emit('complete', {})
    // })
    this.aborted = true
    this.transition({to: 'abort'}).then((res) => {
      this.emit('abort', this.getStatus({output: this.Data}))
    })
  }

  transition(transition) {
    debug('Request transition', transition);
    if(this.state) this.state.exit && this.state.exit()
    let args = []
    let transitionTarget = transition.to
    this.transitionCount += 1
    if(transition.done || this.done) {
      this.done = true
      let retVal = {name: this.ManagerName, transitions: this.transitionCount, elapsedTime: new Date().getTime() - this.startTime, output: this.Data}
      this.emit('complete', this.getStatus({output: this.Data}))
      return retVal
    }

    if(transition.wait && transition.wait > 0){
      transitionTarget = 'wait'
      args[0] = transition.wait
      args[1] = transition.to
      args[2] = (timer) => {
        this.timer = timer
      }
    }

    this.state = this.states.get(transitionTarget)
    return this.state.enter()
      .then((result) => {
        if(_.isObject(result)){
          return result
        }
        return this.state.run(...args)
      })
      .then((result) => {
        if(this.state.name === 'abort'){
          result = {to: 'done'}
        }
        this.transition(result)
        return null
      })
      .catch((err) => {
        let error = {
          instance: this.getStatus(),
          error: err
        }
        this.emit('error', error)
      })
  }

  getStatus(mergeWith) {
    mergeWith = mergeWith || {}
    return _.merge({
      name: this.ManagerName,
      uuid: this.TaskUUID,
      aborted: this.aborted,
      transitions: this.transitionCount,
      startTime: this.startTime,
      elapsedTime: new Date().getTime() - this.startTime,
    }, mergeWith)
  }
}

module.exports = StateMachine
