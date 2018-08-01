import React, {Component} from 'react'
import {createWorkspace, screenToGrid} from './Graph'
import {observer} from 'mobx-react'
import * as mobx from 'mobx'
import {ClickHandler} from './ClickHandler'
import {attachSimulation} from './simulation'


export const GraphView = observer(class GraphView extends Component {
  
  onNodeDragStart = (node) => {
    this._state.activeNode = node
    this._state.lastActiveNode = node;
  }

  onNodeDragEnd = (node) => {
    this._state.activeNode = null
  }

  _state = (() => {
    const y = document.body.clientHeight;
    const x = document.body.clientWidth;
    const ws = createWorkspace();
    attachSimulation(ws)
    ws.screen.attach(document.body)
    
    ws.createNode({ x: x / 2, y: y / 2 })
    ws.createNode({ x: x, y: y })
    ws.createNode({ x: 0, y: 0 })
    ws.createNode({ x: x * 0.75, y: y * 0.75 })
    
    return mobx.observable({
      ws, x, y, activeNode: null, lastActiveNode: null
    })
  })()


  onMouseMove = (event) => {
    if (this._state.ws.selected) {
      this._state.ws.selected.clickHandler.onMouseMove(event)
    }
  }

  onMouseDown = (event) => {
    const {x, y} = screenToGrid({ x: event.clientX, y: event.clientY }, this._state.ws.screen)
    const node = this._state.ws.createNode({ x, y, parent: this._state.lastActiveNode})
    node.x -= node.width / 2
    node.y -= node.height / 2
  }
  onScroll = (event) => {
    this._state.ws.screen.modifyZoom({x: event.clientX, y: event.clientY}, event.deltaY)
    event.preventDefault()
  }

  render() {
    const {x,y,ws} = this._state
    return <div 
    onWheel={this.onScroll}
    style={{width: x, height: y}} >
      <svg 
        width={x} height={y}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
      >
      {
        ws.links.map(([a, b]) => <GraphNodeLine key={a.id + b.id} source={a} target={b}/>)
      }
      {
        ws.nodes.map(n => <GraphNodeView key={n.id} node={n} workspace={this._state.ws}/>)
      }
      
      </svg>
    </div>
  }

})

const GraphNodeLine = observer(class GraphNodeLine extends Component {
  render() {
    const a = this.props.source
    const b = this.props.target
    const { x: ax, y: ay } = a.screen
    const { x: bx, y: by } = b.screen
    return <line
      style={{stroke: 'rgb(255,0,0)', strokeWidth: 2}}
      x1={ax + a.screenWidth / 2} y1={ay + a.screenHeight / 2}
      x2={bx + b.screenWidth / 2} y2={by + b.screenHeight / 2}
    />
  }
})

const GraphNodeView = observer(class GraphNodeView extends Component {
  constructor(props) {
    super(props)
    this.clickHandler = ClickHandler(this.props.node)
    this.props.node.clickHandler = this.clickHandler
    this.clickHandler.on('dragstart', this.props.parent.onNodeDragStart)
    this.clickHandler.on('dragend', this.props.parent.onNodeDragEnd)
  }
  render() {
    const clickHandler = this.clickHandler
    const n = this.props.node
    const {x,y} = n.screen
    const width = n.screenWidth
    const height = n.screenHeight
    return <rect
      width={width} height={height} x={x} y={y} 
      onMouseDown={clickHandler.onMouseDown}
      onMouseUp={clickHandler.onMouseUp}
    />
  }
})