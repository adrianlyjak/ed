const requestAnimationFrame = window.requestAnimationFrame


type AnimationCallback = (position: number) => void



interface Cancellable {
  cancel: () => void
}

type EasingFunction = (progress: number) => number

function identity<T>(obj: T): T {
  return obj
}
/**
 * @param duration - number of milliseconds the animation should run for
 * @param easingFunction -
 * @param cb - 
 * 
 */
export function animate(duration: number, easingFunction: EasingFunction = identity) {

  return function withCallback(cb: AnimationCallback): Promise<void> & Cancellable {
    let start = performance.now();
    let id;
    let canceller: Cancellable = { cancel: undefined }
    const done: Promise<void> & any = new Promise((res, rej) => {
      canceller.cancel = () => {
        window.cancelAnimationFrame(id)
        rej(new Error('cancelled'))
      }

      function animate(now) {
        let ms = now - start
        if (ms >= duration) {
          cb(easingFunction(1))
          res(undefined)
        } else {
          id = requestAnimationFrame(animate)
          let progress = ms / duration
          cb(easingFunction(progress))
        }
      }

      id = requestAnimationFrame(animate)
    })

    return Object.assign(done, canceller)

  }
}