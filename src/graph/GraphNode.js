import uuid from 'uuid/v4'
import * as mobx from 'mobx'
import {gridToScreen} from './Graph'

export function createNode(workspace, {
  x = 0, y = 0, 
  width = 60, height = 60,
  parent = null
}) {
  const self = mobx.observable({
    x, y, width, height,
    id: uuid(),
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
      this.parent.resortChildren()
    },
    resortChildren() {
      this.parent && this.parent.children.sort((a, b) => {
        return a.y - b.y
      })
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
    },
    get screen() {
      return gridToScreen(this, this.workspace.screen)
    },
    get screenWidth() {
      return this.workspace.screen.zoom * this.width
    },
    get screenHeight() {
      return this.workspace.screen.zoom * this.height
    }
  }, {
    unlinkParent: mobx.action,
    linkParent: mobx.action,
    resortChildren: mobx.action,
    setSelected: mobx.action,
    isSelected: mobx.computed,
    screen: mobx.computed,
    screenWidth: mobx.computed,
    screenHeight: mobx.computed,
  })
  if (parent) {
    self.linkParent(parent)
  }
  return self;
}