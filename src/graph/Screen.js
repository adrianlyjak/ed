import * as mobx from 'mobx'

import * as _ from 'lodash'

import {sig} from './math'

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

export function Screen(ws, element = null) {


  const self = mobx.observable({
    /** number of grid units per screen pixel */
    zoom: 1,
    
    /** offset of screen from grid y zero in pixels */
    topOffset: 0,

    /** offset of screen from grid x zero in pixels */
    leftOffset: 0,

    /** offset of screen from grid y zero in grid units */
    get gridTopOffset() {
      
    },

    /** offset of screen from grid x zero in grid units */
    get gridLeftOffset() {
      
    },

    prev: [],

    /** width of the screen viewport, in pixels */
    clientWidth: element.clientWidth || 0,

    /** height of the screen viewport, in pixels  */
    clientHeight: element.clientHeight || 0,

    /** 
     * graph node positions within the screen. A screen observes it's workspace's nodes and adds and removes projections
     * projections compute their values from the screen and the source node
     */
    nodeProjections: mobx.observable.map(),

    get everySome() {
      return this.prev.filter((x, i) => i % 20 === 0)
    },

    fit([[minX, minY], [maxX, maxY]]) {
      const [gridX, gridY] = [maxX - minX, maxY - minY]
      const [zoomX, zoomY] = [gridX / this.clientWidth, gridY / this.clientHeight]

      this.zoom = Math.max(zoomX, zoomY)
      const diffX = this.clientWidth - gridX / this.zoom
      const diffY = this.clientHeight - gridY / this.zoom
      
      this.topOffset = minY / this.zoom - diffY / 2
      this.leftOffset = minX / this.zoom - diffX / 2
    },

    modifyZoom(center, factor) {
    
      this.prev.push({ topOffset: this.topOffset, leftOffset: this.leftOffset, zoom: this.zoom })
      // sig to squish values,
      // sig is ranged (0, 1), * 2 - 1 to range (-1, 1)
      const dampen = 0.005
      const zoomChange = ((sig(factor * dampen) * 2) - 1) * this.zoom
      const z = this.zoom
      const nextZ = Math.min(Math.max(this.zoom + zoomChange, 0.01), 100)
      const changeX = calcOffsetChange(center.x, this.leftOffset, z, nextZ)
      const changeY = calcOffsetChange(center.y, this.topOffset, z, nextZ)
      this.topOffset += changeY
      this.leftOffset += changeX
      this.zoom = nextZ      
    },
    
    dispose() {
      nodeObserveDisposer()
    }

  }, {
    // attach: mobx.action,
    modifyZoom: mobx.action,
    fit: mobx.action,
    everySome: mobx.computed,
    gridTopOffset: mobx.computed,
    gridLeftOffset: mobx.computed,
    dispose: mobx.action
  })
  const nodeObserveDisposer = ws.nodes.observe(change => {
    for (let add of change.added) {
      self.nodeProjections.set(add.id, Projection(add, self))
    }
    for (let remove of change.removed) {
      self.nodeProjections.delete(remove.id)
    }
    
  })

  function setWindowSize() {
    self.clientWidth = element.clientWidth
    self.clientHeight = element.clientHeight
  }
  setWindowSize()
  window.addEventListener("resize", setWindowSize);
  return self
}


function Projection(node, screen) {
  const self =  mobx.observable({
    get x() {
      return node.x //return gToS(node.x, screen.leftOffset, screen.zoom)
    },
    get y() {
      return node.y //return gToS(node.y, screen.topOffset, screen.zoom)
    },
    get width() {
      return node.width //return node.width / screen.zoom
    },
    get height() {
      return node.height //return node.height / screen.zoom
    },
    get isOnScreen() {
      const {x, y} = gridToScreen(node, screen)
      const halfWidth = node.width / screen.zoom / 2
      const halfHeight = node.height / screen.zoom / 2
      return 0 <= x + halfWidth && x - halfWidth <= screen.clientWidth &&
        0 <= y + halfHeight && y - halfHeight <= screen.clientHeight
    }
  }, {
    x: mobx.computed,
    y: mobx.computed,
    // everyTen: mobx.computed,
    width: mobx.computed,
    height: mobx.computed,
    isOnScreen: mobx.computed
  })
  
  // mobx.observe(screen, 'zoom', _.throttle(() => {
  //   self.last.unshift({ x: self.x, y: self.y, width: self.width, height: self.height })
  //   self.last.splice(60)
  // }, 100, { leading: true }))
  return self
}

/**
 * converts a unit on a grid dimension to a unit on the same screen dimension 
 * screen = grid/zoom - offset
 */
function gToS(grid, offsetScreen, zoom) {
  return (grid / zoom) - offsetScreen
}
/** 
 * converts a unit on a screen dimension to a unit on the same grid dimension. Algebraic opposite of gToS
 * grid = (screen + offsetScreen) * zoom
 * */
function sToG(screen, offsetScreen, zoom) {
  return (screen + offsetScreen) * zoom
}


export function gridToScreen(coordinates, screen) {
  return {
    x: gToS(coordinates.x, screen.leftOffset, screen.zoom),
    y: gToS(coordinates.y, screen.topOffset, screen.zoom),
  }
}

export function screenToGrid(coordinates, screen) {
  return {
    x: sToG(coordinates.x, screen.leftOffset, screen.zoom),
    y: sToG(coordinates.y, screen.topOffset, screen.zoom),
  }
}


