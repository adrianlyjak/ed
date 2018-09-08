
import {GraphNode} from './GraphNode'
import * as mobx from 'mobx'

/**
  @typedef Workspace
  @type {object}
  @property {ObservableArray} nodes
  @property {?*} selected
  @property {?*} lastSelected
  @property {function} createNode
  @property {function} select
  @property {Array} links
 */

 /* @return {Workspace} */
export function Workspace() {
  return mobx.observable({
    nodes: [],
    selected: null,
    lastSelected: null,
    createNode({ parent } = {}) {
      const node = GraphNode(this, { parent})
      this.nodes.push(node);
      return node;
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
    select: mobx.action,
    links: mobx.computed,
  })
}


