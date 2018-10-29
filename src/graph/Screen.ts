import * as mobx from 'mobx'

import * as _ from 'lodash'

import {sig} from './math'

import {animate as animateChange } from '../util/animate'
/**
 * 
 * @param {*} center - screen zoom center
 * @param {*} offset - offset that's being adjusted
 * @param {*} zoom - current zoom level
 * @param {*} nextZoom - next zoom level
 */
function calcOffsetChange(center, offset, zoom, nextZoom) {
  const before = sToG(center, offset, zoom)
  const after = sToG(center, offset, nextZoom)
  return (before - after) / nextZoom
  // return (sToG(center, offset, zoom) - sToG(center, offset, nextZoom)) / nextZoom
}

export const throttle = 33
export const throttleWithEaseOut = 50

export interface IScreen extends mobx.IObservableObject {
  /** number of grid units per screen pixel */
  zoom: number

  /** offset of screen from grid y zero in screen pixels */
  topOffset: number

  /** offset of screen from grid x zero in screen pixels */
  leftOffset: number,

  /** is in zooming state? */
  zooming: boolean,

  /** offset of screen from grid y zero in grid units */
  readonly gridTopOffset: number

  /** offset of screen from grid x zero in grid units */
  readonly gridLeftOffset: number
    
  /** width of the screen viewport, in pixels */
  clientWidth: number

  /** height of the screen viewport, in pixels  */
  clientHeight: number

  requestEvents: () => void

  /** fit screen to rect [minX, minY], [maxX, maxY] */
  fit: (min: number[], max: number[]) => void

  /**  */
  pan: (x: number, y: number) => void

  /** */
  modifyZoom: (center: XY, factor: number) => void

  /** */
  animateZoomTo: (center: XY, duration?: number, modification?: number) => void
}


export function Screen(element = null) {



  const animatedActionReducers = {
    scroll: (updates: XY[]) => {
      const y = updates.reduce((sum, { y }) => sum + y, 0)
      const x = updates.reduce((sum, { x }) => sum + x, 0)
      self.topOffset += y
      self.leftOffset += x
    },
    setZoom: (updates: { zoom: number, center: XY}[]) => {
      const {zoom: nextZ, center} = updates[updates.length - 1]
      const z = self.zoom
      const changeX = calcOffsetChange(center.x, self.leftOffset, z, nextZ)
      const changeY = calcOffsetChange(center.y, self.topOffset, z, nextZ)
      self.topOffset += changeY
      self.leftOffset += changeX
      self.zoom = nextZ
    },
    setZooming: (updates: boolean[]) => {
      self.zooming = updates[updates.length - 1]
    }
  }

  interface UpdateEvent<T> {
    name: string,
    update: T
  }
  let updates: Array<UpdateEvent<any>> = []


  const doActions = _.throttle(mobx.action('screenDoActions', (isRender) => {
      const actions = {}
      for (let update of updates) {
        const array = (actions[update.name] = actions[update.name] || [])
        array.push(update.update)
      }
      for (let name of Object.keys(actions)) {
        animatedActionReducers[name](actions[name])
      }
      updates = []
  }), throttle, {
    leading: true
  })

  function animate(events: {[name: string]: any}): void {
    for (let key of Object.keys(events)) {
      updates.push({ name: key, update: events[key]})
    }
    doActions(false)
  }

  const self: IScreen = mobx.observable({
    
    zoom: 1,
    topOffset: 0,
    leftOffset: 0,

    get gridTopOffset() {
      return self.topOffset * self.zoom
    },

    get gridLeftOffset() {
      return self.leftOffset * self.zoom
    },
    zooming: false,
    prev: [],
    clientWidth: element.clientWidth || 0,
    clientHeight: element.clientHeight || 0,

    get everySome() {
      return this.prev.filter((x, i) => i % 20 === 0)
    },

    requestEvents: () => {
      // doActions(true)
    },

    fit([minX, minY]: number[], [maxX, maxY]: number[]) {
      const [gridX, gridY] = [maxX - minX, maxY - minY]
      const [zoomX, zoomY] = [gridX / self.clientWidth, gridY / self.clientHeight]

      self.zoom = Math.max(zoomX, zoomY)
      const diffX = self.clientWidth - gridX / self.zoom
      const diffY = self.clientHeight - gridY / self.zoom
      
      self.topOffset = minY / self.zoom - diffY / 2
      self.leftOffset = minX / self.zoom - diffX / 2
    },

    pan(x, y) {
      animate({ scroll: { x, y } })
    },

    animateScroll(deltaX: number, y: number, easing: (x: number) => number) {

    },

    animateZoomTo(center: XY, duration: number = 200, modification: number = 0.5) {
      let start = self.zoom
      let end = self.zoom * modification
      let diff = end - start
      animate({ setZooming: true })
      animateChange(duration)((progress: number) => {
        animate({ setZoom: { zoom: start + (diff * progress), center }})
      })
      .catch(() => {})
      .then(() => {
        setTimeout(() => animate({ setZooming: false }), throttleWithEaseOut * 2)
      })
    },

    modifyZoom(center: XY, factor: number) {
    
      // self.prev.push({ topOffset: self.topOffset, leftOffset: self.leftOffset, zoom: self.zoom })
      // sig to squish values,
      // sig is ranged (0, 1), * 2 - 1 to range (-1, 1)
      const dampen = 0.005
      const zoomChange = ((sig(factor * dampen) * 2) - 1) * self.zoom
      const z = self.zoom
      const nextZ = Math.min(Math.max(self.zoom + zoomChange, 0.01), 100)
      const changeX = calcOffsetChange(center.x, self.leftOffset, z, nextZ)
      const changeY = calcOffsetChange(center.y, self.topOffset, z, nextZ)
      self.topOffset += changeY
      self.leftOffset += changeX
      self.zoom = nextZ      
    },
    
  }, {
    // attach: mobx.action,
    modifyZoom: mobx.action,
    fit: mobx.action,
    everySome: mobx.computed,
    gridTopOffset: mobx.computed,
    gridLeftOffset: mobx.computed,
    requestEvents: mobx.action,
  })

  function setWindowSize() {
    self.clientWidth = element.clientWidth
    self.clientHeight = element.clientHeight
  }
  setWindowSize()
  // window.addEventListener("resize", setWindowSize);
  return self
}

/**
 * converts a unit on a grid dimension to a unit on the same screen dimension 
 * screen = grid/zoom - offset
 */
function gToS(grid: number, offsetScreen: number, zoom: number): number {
  return (grid / zoom) - offsetScreen
}
/** 
 * converts a unit on a screen dimension to a unit on the same grid dimension. Algebraic opposite of gToS
 * grid = (screen + offsetScreen) * zoom
 * */
function sToG(screen: number, offsetScreen: number, zoom: number): number {
  return (screen + offsetScreen) * zoom
}

export type XY = { x: number, y: number }

export function gridToScreen(coordinates: XY, screen: IScreen): XY {
  return {
    x: gToS(coordinates.x, screen.leftOffset, screen.zoom),
    y: gToS(coordinates.y, screen.topOffset, screen.zoom),
  }
}

export function screenToGrid(coordinates: XY, screen: IScreen): XY {
  return {
    x: sToG(coordinates.x, screen.leftOffset, screen.zoom),
    y: sToG(coordinates.y, screen.topOffset, screen.zoom),
  }
}


