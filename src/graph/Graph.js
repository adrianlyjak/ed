
import {GraphNode} from './GraphNode'
import * as mobx from 'mobx'


export function Workspace() {
  return mobx.observable({
    nodes: [],
    selected: null,
    lastSelected: null,
    createNode({ parent } = {}) {
      const node = GraphNode(this, { parent})
      this.nodes.push(node);
      if (parent) {
        node.x = parent.x + 100
        node.y = (parent.children.length - 1) * 100 + parent.y
      } else {
        node.x = 50
        node.y = 50
      }
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


