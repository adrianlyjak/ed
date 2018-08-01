
import {createNode} from './GraphNode'
import * as mobx from 'mobx'
import uuid from 'uuid/v4'

export function createWorkspace() {
  return mobx.observable({
    nodes: [],
    selected: null,
    lastSelected: null,
    screen: createScreen(),
    createNode({ x, y, parent }) {
      const node = createNode(this, { x, y, parent})
      this.nodes.push(node);
      return node;
    },
    unregister(node) {
      const idx = this.nodes.indexOf(node)
      if (idx > -1) {
        this.nodes.splice(idx, 1)
      }
    },
    select(nodeOrNull) {
      this.selected = nodeOrNull;
      if (nodeOrNull) {
        this.lastSelected = nodeOrNull
      }
    },
    get links() {
      const ls = []
      for (let node of this.nodes) {
        for (let c of node.children) {
          ls.push([node, c])
        }
      }
      return ls;
    }

    
  }, {
    createNode: mobx.action,
    unregister: mobx.action,
    select: mobx.action,
    links: mobx.computed,
  })
}

function sig(x) {
  return 1 / (1 + Math.exp(-x))
}


function createScreen() {
  return mobx.observable({
    zoom: 1,
    gridTop: 0,
    gridLeft: 0,
    clientWidth: 0,
    clientHeight: 0,
    element: null,
    attach(element) {
      this.element = element
      this.clientWidth = element.clientWidth
      this.clientHeight = element.clientHeight
    },
    modifyZoom(center, factor) {
      const zoomChange = ((sig(factor / 1000) * 2) - 1) * this.zoom
      
      const z = this.zoom
      // equivalent to (sort of optimization of)
      // const beforeY = (center.y / this.zoom)
      // const afterY = (center.y / (this.zoom + zoomChange))
      // const changeTop = beforeY - afterY
      const denominator = z * z + z * zoomChange
      const changeTop = (center.y * zoomChange) / denominator 
      const changeLeft = (center.x * zoomChange) / denominator
      this.zoom += zoomChange
      this.gridTop += changeTop
      this.gridLeft += changeLeft
     
      
    },
    get gridBottom() {
      return this.gridTop + this.clientHeight
    },
    get gridRight() {
      return this.gridLeft + this.clientWidth
    }
  }, {
    attach: mobx.action,
    modifyZoom: mobx.action,
    gridBottom: mobx.computed,
    gridRight: mobx.computed
  })
}

/**
 * 
 * @param {x: number, y: number} coordinates 
 * @param {zoom: number, centerX: number, centerY: number, clientWidth: number, clientHeight: number} screen 
 * @return {x: number, y: number}
 */
export function gridToScreen(coordinates, screen) {
  return {
    x: (coordinates.x - screen.gridLeft) * screen.zoom,
    y: (coordinates.y - screen.gridTop) * screen.zoom
  }
}

/*
screen = (grid - screenStart) * zoom
(screen / zoom) + start = grid
*/
export function screenToGrid(coordinates, screen) {
  return {
    x: (coordinates.x / screen.zoom) + screen.gridLeft,
    y: (coordinates.y / screen.zoom) + screen.gridTop,
  }
}