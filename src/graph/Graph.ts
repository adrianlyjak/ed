
import {GraphNode, IGraphNode} from './GraphNode'
import * as mobx from 'mobx'

 export interface IGraph extends mobx.IObservableObject {
   
  nodes: mobx.IObservableArray<IGraphNode>
  selected?: IGraphNode
  lastSelected?: IGraphNode
  createNode: (template: any) => IGraphNode
  select(node: IGraphNode | null): void
  readonly links: IGraphNode[][]
  readonly nonRootNodes: IGraphNode[]
 }


export function Graph(): IGraph {
  const self: IGraph = mobx.observable.object({
    nodes: mobx.observable.array([]),
    selected: null,
    lastSelected: null,
    createNode: (template: any = {}): any => {
      const node = GraphNode(this, template)
      self.nodes.push(node);
      return node;
    },
    select: (node: any | null) => {
      self.selected = node;
      if (node) {
        self.lastSelected = node
      }
    },
    get links() {
      const ls = []
      for (let node of self.nonRootNodes) {
        for (let c of node.children) {
          ls.push([node, c])
        }
      }
      return ls;
    },
    get nonRootNodes(): IGraphNode[] {
      return self.nodes.filter(x => !!x.parent)
    }
  }, {
    createNode: mobx.action,
    select: mobx.action,
    links: mobx.computed,
    nonRootNodes: mobx.computed
  })
  return self
}


