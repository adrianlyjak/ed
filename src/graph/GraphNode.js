import uuid from 'uuid/v4'
import * as mobx from 'mobx'
import {GraphNodeView, GraphNodeLine } from './GraphNodeView'
import getPhrase from './getPhrase'

const scale = 50

export function GraphNode(workspace, {
  x = 0, y = 0, 
  width = scale + Math.random() * scale, height = scale + Math.random() * scale,
  parent = null
}) {
  const self = mobx.observable({
    x, y, width, height,
    id: uuid(),
    title: getPhrase(),
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
      this.workspace.unregister(this);
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