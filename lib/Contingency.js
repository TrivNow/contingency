/**
 * @file Machine
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('lodash')
const Promise = require('bluebird')

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

class StateMachine{
  constructor(options) {
    this.ManagerName = options.name
    this.Cache = {rando: Math.random()}

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
      return state.init(this.Cache)
    })
  }

  start(){
    if(this.managerStarted) throw new Error('Manager is already running.')
    this.managerStarted = true
    return this.pendingInitial
      .then((results) => {
        console.log(`${results.length} states initialized.`);
        return this.transition({to: this.initialState})
      })
      .catch((err) => {
        throw err
      })
  }

  transition(transition) {
    if(this.state) this.state.exit && this.state.exit()
    let args = []
    let transitionTarget = transition.to
    if(transition.done){
      return {results: this.Cache}
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
        return this.transition(result)
      })
      .catch((err) => {
        console.log(err);})
  }
}

module.exports = StateMachine