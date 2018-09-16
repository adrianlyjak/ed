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
export function flushJsonToDisk(
  path: string, 
  getJson: () => Object, 
  {
    throttle = 1000
  }: IFlushOptions = {}
): IFlushDisposer {

  var next: Object = null
  var current: Promise<void> = null
  
  function flushNext(json: Object) {
    if (!current) {
      current = flush(path, json)
        .then(x => {
          // log?
        })
        .catch(ex => {
          console.error(`failed to flush to ${path}`, ex)
        })
      current.then(() => {
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
  // persist it immediately if it doesn't exist
  fs.exists(path, exists => {
    if (!exists) {
      flushNext(getJson())
    }
  })

  const throttledFlushNext = _.throttle(flushNext, throttle, { leading: false, trailing: true })

  

  const disposeFlush = mobx.reaction(
    () => getJson(),
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
      didDeactivate = watchDone.then(() => flush(path, getJson()))
      return didDeactivate
    }
    
  }
}

export function flush(
  path: string, 
  object: Object
): Promise<void> {
  return promisify(fs.writeFile)(path, JSON.stringify(object), { encoding: 'utf-8'})
}