/**
 * @file State
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Contingency
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('lodash')
const debug = require('debug')('contingency:state')
const Promise = require('bluebird')

/**
 *
 * @module State
 */

class State {
  constructor(state) {
    this.Data = null
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
  currentState(){
    return this.state.name

  }

  init(Data){
    this.Data = Data
    this.initialized = true;
    this.lifecycle = 'initialize'
    return this._maybePromise(this.state.init.bind(this))

  }

  /**
   * enter - Called by the manager executes on entry to the state, in preparation for transition to the
   * run function.
   *
   * @returns {Promise}
   */
  enter(){
    this.lifecycle = 'enter'
    return this._maybePromise(this.state.enter.bind(this))

  }

  /**
   * run main code for this state.
   *
   * @param args
   * @returns {Promise}
   */
  run(...args){
    this.lifecycle = 'run'
    return this._maybePromise(this.state.run.bind(this, ...args))

  }

  /**
   * exit - Ran just prior to transition to next state.
   */
  exit(){
    this.lifecycle = 'exit'
    return this._maybePromise(this.state.exit.bind(this))
  }

  _maybePromise(suspectedPromiseO){

    try{
      var suspectedPromise = suspectedPromiseO()
    }
    catch(err){
      return Promise.reject(err)
    }

    let encounteredError

    if(suspectedPromise &&  _.isFunction(suspectedPromise.then)) {
      return suspectedPromise
        .then((result) =>{
            if(!result){
              throw new Error(`State ${this.name} failed ${this.lifecycle} step.`)
            }
            return result
        })

    }


    if(!_.isUndefined(suspectedPromise) && !suspectedPromise){

      encounteredError = new Error(`State ${this.name} failed ${this.lifecycle} step.`)
    }

    if(encounteredError) return Promise.reject(encounteredError)
    return  Promise.resolve(suspectedPromise)
  }
}

module.exports = State
