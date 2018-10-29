import * as uuid from 'uuid/v4'
import * as mobx from 'mobx'
import getPhrase from './getPhrase'
import { IGraph } from './Graph';

const scale = 50

export interface IGraphNode extends mobx.IObservableObject {
  id: string
  content: string
  children: any[]
  workspace: IGraph
  parent?: IGraphNode
  unlinkParent: () => void,
  linkParent: (parent: IGraphNode) => void
  delete: () => void
  setSelected: (isSelected: boolean) => void
  readonly isSelected: boolean
}

export function GraphNode(workspace, {
  parent = null
}): IGraphNode {
  const self: IGraphNode = mobx.observable({
    id: uuid(),
    content: "**" + getPhrase() + "** " + getPhrase(),
    children: [],
    workspace,
    parent: parent,
    unlinkParent() {
      if (this.parent) {
        const idx = this.parent.children.indexOf(this)
        if (idx > -1) {
          this.parent.children.splice(idx, 1)
        }
        this.parent = null
      }
    },
    linkParent(parent) {
      this.unlinkParent()
      this.parent = parent
      this.parent.children.push(this)
    },
    delete() {
      this.children.slice().forEach(x => x.unlinkParent());
      this.unlinkParent();
      const idx = this.workspace.nodes.indexOf(this)
      if (idx > -1) {
        this.workspace.nodes.splice(idx, 1)
      }
    },
    setSelected(isSelected) {
      if (!isSelected && this.isSelected) {
        this.workspace.select(null)
      } else if (isSelected) {
        this.workspace.select(this)
      }
    },
    get isSelected() {
      return this.workspace.selected === this
    }
  }, {
    unlinkParent: mobx.action,
    linkParent: mobx.action,
    setSelected: mobx.action,
    isSelected: mobx.computed,
  })
  if (parent) {
    self.linkParent(parent)
  }
  return self;
}