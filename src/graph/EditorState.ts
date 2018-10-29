import * as mobx from 'mobx'
import {screenToGrid, IScreen} from './Screen'
import { IGraph } from './Graph';
import { WheelEventHandler, MouseEventHandler, MouseEvent, WheelEvent } from 'react';
import { IGraphNode } from './GraphNode';
import { ITreeLayoutNode } from './TreeLayout';

export interface IEditorState extends mobx.IObservableObject {
  selected?: ITreeLayoutNode
  dragging?: ITreeLayoutNode
  panning: boolean
  panningLastPosition: number[]
  draggingLastPosition: number[]
  onNodeDragStart: (node: ITreeLayoutNode, event: MouseEvent<Element>) => void
  onNodeDragEnd: MouseEventHandler<Element>
  onNodeDrag: MouseEventHandler<Element>
  onMouseDown: MouseEventHandler<Element>
  onMouseUp: MouseEventHandler<Element>
  onScroll: WheelEventHandler<Element>
}

export function EditorState(screen: IScreen, workspace: IGraph): IEditorState {
  const self: IEditorState = mobx.observable({
    selected: null,
    dragging: null,
    panning: false,
    panningLastPosition: null,
    draggingLastPosition: null,
    onNodeDragStart: (node: ITreeLayoutNode, event: MouseEvent<Element>) => {
      event.stopPropagation()
      self.selected = node
      self.dragging = node
      self.draggingLastPosition = [event.clientX, event.clientY]
    },
    onNodeDragEnd: (event: MouseEvent<Element>) => {
      self.dragging = null
      self.draggingLastPosition = null
    },
    onNodeDrag: (event: MouseEvent<Element>) => {
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
    onMouseDown: (event: MouseEvent<Element>) => {
      self.panning = true
      self.panningLastPosition = [event.clientX, event.clientY]
      // const {x, y} = screenToGrid({ x: event.clientX, y: event.clientY }, screen)
      // const node = workspace.createNode({ x, y, parent: null})
      // node.x -= node.width / 2
      // node.y -= node.height / 2
    },
    onMouseUp: (event: MouseEvent<Element>) => {
      self.panning = false
    },
    onScroll: (event: WheelEvent) => {
      // screen.modifyZoom({x: event.clientX, y: event.clientY}, event.deltaY)
      screen.pan(event.deltaX, event.deltaY)
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