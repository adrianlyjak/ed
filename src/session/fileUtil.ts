import * as mobx from 'mobx'
import * as promisify from 'util.promisify'
import * as fs from 'fs'
import * as _ from 'lodash'

export interface IFlushOptions {
  throttle?: number
}

export interface IFlushDisposer {
  (): Promise<void>
}
/**
 * 
 * @param path 
 * @param jsonSerializableObservable 
 * @param options 
 */
export function flushJsonToDisk<T>(
  path: string, 
  jsonSerializableObservable: mobx.IObservable & T, 
  {
    throttle = 1000
  }: IFlushOptions = {}
): IFlushDisposer {

  var next: T = null
  var current: Promise<void> = null
  
  function flushNext(json: T) {
    if (!current) {
      current = promisify(fs.writeFile)(path, JSON.stringify(json))
      current.then(x => {
        current = null
        if (next) {
          flushNext(next)
          next = null
        }
      })
    } else {
      next = json
    }
  }

  const throttledFlushNext = _.throttle(flushNext, throttle, { leading: false, trailing: true })

  const disposeFlush = mobx.reaction(
    () => mobx.toJS(jsonSerializableObservable),
    (json) => throttledFlushNext(json)
  )

  let didDeactivate: Promise<void>;
  /**
   * stops watching, and flushes on final time. returns promise that is resolved once all writes are complete
   * @return {Promise.<void>}
   */
  return function dispose() {
    if (didDeactivate) {
      return didDeactivate
    } else {
      disposeFlush()
      next = null
      const watchDone = current ? current.then(() => {}) : Promise.resolve(null)
      didDeactivate = watchDone.then(() => flush(path, jsonSerializableObservable))
      return didDeactivate
    }
    
  }
}

export function flush(path: string, jsonSerializableObservable: mobx.IObservable): Promise<void> {
  return promisify(fs.writeFile)(path, JSON.stringify(mobx.toJS(jsonSerializableObservable)))
}