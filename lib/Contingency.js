/**
 * @file Machine
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('lodash')
const Promise = require('bluebird')
Promise.config({
  longStackTraces: false
})
const EventEmitter = require('events')

const State = require('./State')
const finishedState = new State(require('./FrameworkStates/doneState'))
const waitState = new State(require('./FrameworkStates/waitState'))
const FrameworkStates = [
  new State(require('./FrameworkStates/doneState')),
  new State(require('./FrameworkStates/waitState')),
  new State(require('./FrameworkStates/errorState'))
]
/**
 *
 * @module StateMachine
 */

class StateMachine extends EventEmitter{
  constructor(options, initialData) {
    super()
    this.ManagerName = options.name
    this.Data = initialData || {}

    let rawStates = _.map(options.states, (s) => {
      return new State(s)
    });

    [].push.apply(rawStates, FrameworkStates)

    // let m = new Map(_.map(rawStates, (rs) => { return [rs.name, rs]}))

    this.states = _.keyBy(rawStates, 'name')

    this.initialState = options.initial
    this.timeout = options.timeout
    this.initialized = false

    this.pendingInitial = Promise.mapSeries(rawStates, (state) => {
      return state.init(this.Data)
    })
  }

  start(){
    if(this.managerStarted) throw new Error('Manager is already running.')
    this.managerStarted = true
    return this.pendingInitial
      .then((results) => {
        console.log(`${results.length} states initialized.`);
        this.transition({to: this.initialState})
        return null
      })
      .catch((err) => {
        throw err
      })
  }

  transition(transition) {
    console.log(transition);
    if(this.state) this.state.exit && this.state.exit()
    let args = []
    let transitionTarget = transition.to
    if(transition.done){
      console.log('done');
      this.emit('finished', this.Data)
      return {results: this.Data}
    }

    if(transition.wait && transition.wait > 0){
      transitionTarget = 'wait'
      args[0] = transition.wait
      args[1] = transition.to
    }

    this.state = this.states[transitionTarget]
    return this.state.enter()
      .then((result) => {
        if(_.isObject(result)){
          return result
        }
        return this.state.run(...args)
      })
      .then((result) => {
        this.transition(result)
        return null
      })
      .catch((err) => {
        console.log(err);})
  }
}

module.exports = StateMachine