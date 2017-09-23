const isFunction = function(obj) {
  return typeof obj == 'function' || false
}

export default class EventEmitter {
  constructor() {
    this.listeners = new Map()
  }

  on(event, callback) {
    // assume event is not registered before
    // create array inside listeners map
    this.listeners.has(event) || this.listeners.set(event, [])

    // register callback to event listeners' array
    this.listeners.get(event).push(callback)
  }

  off(event, callback) {
    const listeners = this.listeners.get(event)
    let index

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        // iterate to look for registered event listener
        return (isFunction(listener) && listener === callback) ?
            i = index :
            i
      }, -1)

      if (index > -1) {
        // assume found the listener
        // remove the callback from the event listeners' array
        listeners.splice(index, 1)

        // register it back to listeners
        this.listeners.set(event, listeners)
        return true
      }
    }
    return false
  }
  emit(event, ...args) {
      let listeners = this.listeners.get(event)

      if (listeners && listeners.length) {
        // assume has event listeners'
        listeners.forEach((listener) => {
          // execute all callback
          listener(...args)
        })
        return true;
      }
      return false;
  }
}
