import * as mobx from 'mobx'
import { Workspace } from './Graph';
import * as d3 from 'd3'
import {flextree} from 'd3-flextree'
import {gridToScreen} from './Screen'
/**
 * 
 * @param {Workspace} workspace
 */
export function TreeLayout({
  workspace,
  screen
}) {

  const self = mobx.observable({
    nodes: workspace.nodes.reduce((map, node) => {
      map.set(node.id, TreeLayoutNode({ underlying: node, screen }));
      return map
    }, mobx.observable.map()),
    get values () {
      return Array.from(this.nodes.values())
    },

    get(id) {
      return this.nodes.get(id)
    },
    dispose() {
      disposeObserver()
    },
    
  }, {
    values: mobx.computed
  })

  const layout = flextree()
    .nodeSize(x => [x.data.height, x.data.width + 20])
    .spacing((nodeA, nodeB) => {
      if (nodeA.parent && nodeA.parent.children.indexOf(nodeB) > -1) {
        return 5
      } else {
        return 15
      }
    })

  function relayout() {
    const root = self.values.find(x => !x.underlying.parent)
    const hierarchy = d3.hierarchy(root, treeNode => {
      return treeNode.underlying.children.map(x => self.nodes.get(x.id))
    })

    layout(hierarchy)
    hierarchy.each(n => {
      n.data.x = n.y + (n.data.width / 2)
      n.data.y = n.x
    })
  }

  const disposeObserver = workspace.nodes.observe(change => {
    for (let node of change.added) {
      self.nodes.set(node.id, TreeLayoutNode({ underlying: node, screen }))
    }
    for (let node of change.removed) {
      self.nodes.delete(node.id)
    }
    relayout()
  })
  
  relayout()
  
  return self
  

  

  
}


export function TreeLayoutNode({
  screen,
  underlying,

  // center of rectangle
  x = 0, y = 0,
  // dimensions of rectangle
  width = 100, height = 10
}) {
  const node = underlying
  return mobx.observable({
    underlying,
    x, y,
    width, height,
    get isOnScreen() {
      const {x, y} = gridToScreen(this, screen)
      const halfWidth = this.width / screen.zoom / 2
      const halfHeight = this.height / screen.zoom / 2
      return 0 <= x + halfWidth && x - halfWidth <= screen.clientWidth &&
        0 <= y + halfHeight && y - halfHeight <= screen.clientHeight
    }
  }, {
    isOnScreen: mobx.computed
  })
}