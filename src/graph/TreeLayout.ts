import * as mobx from 'mobx'
import { Workspace } from './Graph';
import * as d3 from 'd3'
import { flextree } from 'd3-flextree'
import { gridToScreen, IScreen } from './Screen'
import { IWorkspace } from './Graph'
import { IGraphNode } from './GraphNode';

export interface ITreeLayout {
  nodes: mobx.ObservableMap<String, ITreeLayoutNode>
  readonly values: ITreeLayoutNode[]
  get: (id: string) => ITreeLayoutNode | null
  dispose: () => void
}

export function TreeLayout(
  workspace: IWorkspace,
  screen: IScreen
): ITreeLayout {

  const self: ITreeLayout = mobx.observable.object({
    nodes: workspace.nodes.reduce((map, node) => {
      map.set(node.id, TreeLayoutNode(screen, node));
      return map
    }, mobx.observable.map<String, ITreeLayoutNode>()),
    get values() {
      return Array.from(self.nodes.values())
    },

    get(id) {
      return self.nodes.get(id)
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

  function isArraySplice(change: mobx.IArrayChange | mobx.IArraySplice): change is mobx.IArraySplice {
    return 'added' in change
  }
  const disposeObserver = workspace.nodes.observe(change => {

    if (isArraySplice(change)) {
      change = change as mobx.IArraySplice
      for (let node of change.added) {
        self.nodes.set(node.id, TreeLayoutNode(screen, node))
      }
      for (let node of change.removed) {
        self.nodes.delete(node.id)
      }
      relayout()
    }
  })

  relayout()

  return self





}

export interface ITreeLayoutNode extends mobx.IObservableObject {
  underlying: IGraphNode
  x: number,
  y: number
  width: number,
  height: number
  readonly isOnScreen: boolean
}


export function TreeLayoutNode(
  screen: IScreen, underlying: IGraphNode,
  {
  // center of rectangle
  x = 0, y = 0,
  // dimensions of rectangle
  width = 100, height = 10
} = {}): ITreeLayoutNode {

  const self: ITreeLayoutNode = mobx.observable({
    underlying,
    x, y,
    width, height,
    get isOnScreen() {
      const { x, y } = gridToScreen(self, screen)
      const halfWidth = self.width / screen.zoom / 2
      const halfHeight = self.height / screen.zoom / 2
      return 0 <= x + halfWidth && x - halfWidth <= screen.clientWidth &&
        0 <= y + halfHeight && y - halfHeight <= screen.clientHeight
    }
  }, {
      isOnScreen: mobx.computed
    })
  return self
}