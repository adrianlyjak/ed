import * as mobx from 'mobx'

import * as _ from 'lodash'

function sig(x) {
  return 1 / (1 + Math.exp(-x))
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

    /** width of the screen viewport, in pixels */
    clientWidth: element.clientWidth || 0,

    /** height of the screen viewport, in pixels  */
    clientHeight: element.clientHeight || 0,

    /** cursor position while a zoom is occuring */
    zoomCenter: null,

    /** 
     * graph node positions within the screen. A screen observes it's workspace's nodes and adds and removes projections
     * projections compute their values from the screen and the source node
     */
    nodeProjections: mobx.observable.map(),
    modifyZoom(center, factor) {
    

      // sig to squish values,
      // sig is ranged (0, 1), * 2 - 1 to range (-1, 1)
      const dampen = 0.01
      const zoomChange = ((sig(factor * dampen) * 2) - 1) * this.zoom
      const z = this.zoom
      const nextZ = Math.min(Math.max(this.zoom + zoomChange, 0.01), 100)
      const changeX = (sToG(center.x, this.leftOffset, z) - sToG(center.x, this.leftOffset, nextZ)) / nextZ
      const changeY = (sToG(center.y, this.topOffset, z) - sToG(center.y, this.topOffset, nextZ)) / nextZ
      this.topOffset += changeY
      this.leftOffset += changeX
      this.zoom = nextZ      
      this.zoomCenter = gridToScreen(screenToGrid(center, this), this) 
      
    },
    
    dispose() {
      nodeObserveDisposer()
    }

  }, {
    // attach: mobx.action,
    modifyZoom: mobx.action,
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
    last: [],
    // get everyTen() {
    //   return this.last.filter((x, i) => i % 10 === 0)
    // },
    get x() {
      return gToS(node.x, screen.leftOffset, screen.zoom)
    },
    get y() {
      return gToS(node.y, screen.topOffset, screen.zoom)
    },
    get width() {
      return node.width / screen.zoom
    },
    get height() {
      return node.height / screen.zoom
    }
  }, {
    x: mobx.computed,
    y: mobx.computed,
    // everyTen: mobx.computed,
    width: mobx.computed,
    height: mobx.computed,
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


