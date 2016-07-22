/**
 * @file State
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
let _ = require('lodash')
let Promise = require('bluebird')

/**
 *
 * @module State
 */

class State {
  constructor(state) {
    this.Cache = null
    this.state = state
    this.name = state.name
    this.initialized = false
  }

  /**
   * init - Initialize the base context of this state for the lifetime of the machine.
   *
   * @param Manager The State Manager handling this and other states in the machine
   * @param Cache The Shared storage object for the State machine.
   * @returns {Promise}
   */
  init(Cache){
    this.Cache = Cache
    this.initialized = true;
    this.lifecycle = 'initialize'
    let initialized = this.state.init.call(this)
    return this._maybePromise(initialized)

  }

  /**
   * enter - Called by the manager executes on entry to the state, in preparation for transition to the
   * run function.
   *
   * @returns {Promise}
   */
  enter(){
    this.lifecycle = 'enter'
    let entered = this.state.enter.call(this)
    return this._maybePromise(entered)

  }

  /**
   * run main code for this state.
   *
   * @param args
   * @returns {Promise}
   */
  run(...args){
    this.lifecycle = 'run'
    let ran = this.state.run.apply(this, args)
    return this._maybePromise(ran)

  }

  /**
   * exit - Ran just prior to transition to next state.
   */
  exit(){
    this.lifecycle = 'exit'
    let exited = this.state.exit.call(this)
    return this._maybePromise(exited)
  }

  _maybePromise(suspectedPromise){

    if(suspectedPromise &&  _.isFunction(suspectedPromise.then)) {
      return suspectedPromise.then((result) =>{
        if(!result){
          throw new Error(`State ${this.name} failed ${this.lifecycle} step.`)
        }
        return result
      })
    }
    if(!_.isUndefined(suspectedPromise) && !suspectedPromise){
      throw new Error(`State ${this.name} failed ${this.lifecycle} step.`)
    }

    return new Promise.resolve(suspectedPromise)
  }
}

module.exports = State
