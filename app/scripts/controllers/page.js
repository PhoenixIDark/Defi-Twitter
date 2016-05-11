module.exports = (function page () {
  'use strict'
  
  const events = require('./../lib/events')

  let ctrl = {}
  const signals = require('signals')
  
  ctrl.init = function init (toRoute, state, id) {
    console.log('page.js - init page controller.')

    ctrl.changedState = new signals.Signal() // now trigger `ctrl.changedState.dispatch(state)` when your state changes to notify the router
    // Launch transition In
    ctrl.transitionIn(toRoute)
  }

  ctrl.transitionIn = function transitionIn (route) {
    events.transition.dispatch('transition-in-end', route)
  }
  
  ctrl.transitionOut = function transitionOut (fromRoute, toRoute, toState, toId) {
    events.transition.dispatch('transition-out-end', fromRoute, toRoute, toState, toId)
  } 

  ctrl.destroy = function destroy () {
  }

  return ctrl
})()
