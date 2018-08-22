import * as mobx from 'mobx'
import {screenToGrid} from './Screen'

export function EditorState(screen, workspace) {
  const self = mobx.observable({
    selected: null,
    dragging: null,
    draggingLastPosition: null,
    onNodeDragStart: (node, event) => {
      event.stopPropagation()
      self.selected = node
      self.dragging = node
      self.draggingLastPosition = [event.clientX, event.clientY]
    },
    onNodeDragEnd: (event) => {
      self.dragging = null
      self.draggingLastPosition = null
    },
    onNodeDrag: (event) => {
      if (self.dragging) {
        const [lastX, lastY] = self.draggingLastPosition
        const node = self.dragging
        node.x += (event.clientX - lastX) * screen.zoom
        node.y += (event.clientY - lastY) * screen.zoom
        self.draggingLastPosition = [event.clientX, event.clientY]
      } else if (self.panning) {
        const [lastX, lastY] = self.panningLastPosition
        screen.leftOffset += (lastX - event.clientX)
        screen.topOffset += (lastY - event.clientY)
        self.panningLastPosition = [event.clientX, event.clientY]
      }
    },
    onMouseDown: (event) => {
      self.panning = true
      self.panningLastPosition = [event.clientX, event.clientY]
      // const {x, y} = screenToGrid({ x: event.clientX, y: event.clientY }, screen)
      // const node = workspace.createNode({ x, y, parent: null})
      // node.x -= node.width / 2
      // node.y -= node.height / 2
    },
    onMouseUp: event =>{
      self.panning = false
    },
    onScroll: (event) => {
      screen.modifyZoom({x: event.clientX, y: event.clientY}, event.deltaY)
      event.preventDefault()
    }
  }, {
    onNodeDragStart: mobx.action,
    onNodeDragEnd: mobx.action,
    onNodeDrag: mobx.action,
    onMouseDown: mobx.action,
    onMouseUp: mobx.action,
    onScroll: mobx.action
  })
  return self
  
}