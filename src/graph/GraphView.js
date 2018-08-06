import React, {Component} from 'react'
import {Workspace} from './Graph'
import {observer} from 'mobx-react'
import * as mobx from 'mobx'
import PropTypes from 'prop-types'
import {Screen, screenToGrid} from './Screen'


export const GraphView = observer(class GraphView extends Component {
  
  onNodeDragStart = (node) => {
    this._state.activeNode = node
    this._state.lastActiveNode = node;
  }

  onNodeDragEnd = (event) => {
    this._state.activeNode = null
  }

  _state = (() => {
    const ws = Workspace();
    const screen = Screen(ws, document.body);
    const editorState = EditorState(screen)
    
    const {clientWidth: x, clientHeight: y} = screen
    
    
    ws.createNode({ x: x * 0.5, y: y * 0.5 })

    ws.createNode({ x: x * 0.25, y: y * 0.75})
    ws.createNode({ x: x * 0.75, y: y * 0.75})
    ws.createNode({ x: x * 0.75, y: y * 0.25 })
    ws.createNode({ x: x * 0.25, y: y * 0.25 })
    

    return mobx.observable({
      ws, screen,
      editorState,
    })
  })()


  onMouseMove = (event) => {
    this._state.editorState.onNodeDrag(event)
  }

  onMouseDown = (event) => {
    const {x, y} = screenToGrid({ x: event.clientX, y: event.clientY }, this._state.screen)
    console.log({ 'event.clientX': event.clientX, x, zoom: this._state.screen.zoom })
    const node = this._state.ws.createNode({ x, y, parent: this._state.lastActiveNode})
    node.x -= node.width / 2
    node.y -= node.height / 2
  }
  
  onScroll = (event) => {
    this._state.screen.modifyZoom({x: event.clientX, y: event.clientY}, event.deltaY)
    event.preventDefault()
  }

  render() {
    const { ws, screen, editorState } = this._state
    return <div 
    onWheel={this.onScroll}
    style={{width: screen.clientWidth, height: screen.clientHeight}} >
      <svg 
        width={screen.clientWidth} height={screen.clientHeight}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
      >
      <Nodes screen={screen} ws={ws} editorState={editorState} />
      {
        Array(Math.round(screen.clientWidth / 10)).fill(null).map((x, i) => <line
        key={i}
        style={{stroke: 'rgb(200,200,200)', strokeWidth: 2}}
        x1={i * 10} y1={0}
        x2={i * 10} y2={10}
      />)
      }
      {
        Array(Math.round(screen.clientHeight / 10)).fill(null).map((x, i) => <line
        key={i}
        style={{stroke: 'rgb(200,200,200)', strokeWidth: 2}}
        x1={0} y1={i * 10}
        x2={10} y2={i * 10}
      />)
      }
      {
        screen.everySome.map((otherScreen, i) => {
          return <Nodes fillOpacity={0.5 / (screen.everySome.length - i)} screen={otherScreen} ws={ws} editorState={editorState} />
        })
      }
      {
        !screen.zoomCenter ? undefined : <circle 
          cx={screen.zoomCenter.x} cy={screen.zoomCenter.y} r={5} fill="blue"
        />
      }
      
      </svg>
    </div>
  }

})

/**
 * 
 * matrix(
      ${screen.zoom}, 
      0, 
      0, 
      ${screen.zoom}, 
      ${screen.leftOffset * screen.zoom}, 
      ${screen.topOffset * screen.zoom}
    )}
 */
const Nodes = observer(function Nodes({ screen, ws, editorState, ...props }) {
  return <g
    {...props}
    style={{ transform: `matrix(
      ${1 / screen.zoom}, 
      0, 
      0, 
      ${1 / screen.zoom}, 
      ${-screen.leftOffset}, 
      ${-screen.topOffset}
    )
    `
  }}
  >
    {
      ws.links.map(([a, b]) => <GraphNodeLine
        key={a.id + b.id}
        source={a}
        target={b}
      />)
    }
    {
      ws.nodes.map(n =>
        <GraphNodeView
          key={n.id}
          node={n}
          editorState={editorState}
        />)
    }
  </g>
})

function EditorState(screen) {
  return mobx.observable({
    selected: null,
    dragging: null,
    draggingLastPosition: null,
    onNodeDragStart(node, event) {
      event.stopPropagation()
      this.selected = node
      this.dragging = node
      this.draggingLastPosition = [event.clientX, event.clientY]
    },
    onNodeDragEnd(event) {
      this.dragging = null
      this.draggingLastPosition = null
    },
    onNodeDrag(event) {
      if (this.dragging) {
        const [lastX, lastY] = this.draggingLastPosition
        const node = this.dragging
        node.x += (event.clientX - lastX) * screen.zoom
        node.y += (event.clientY - lastY) * screen.zoom
        this.draggingLastPosition = [event.clientX, event.clientY]
      }
    },
  })
  
}
/**
 * 
 */
const GraphNodeLine = observer(class GraphNodeLine extends Component {
  render() {
    const a = this.props.source
    const b = this.props.target
  
    return <line
      style={{stroke: 'rgb(255,0,0)', strokeWidth: 2}}
      x1={a.x + a.width / 2} y1={a.y + a.height / 2}
      x2={b.x + b.width / 2} y2={b.y + b.height / 2}
    />
  }
})

/**
 * 
 */
const GraphNodeView = observer(class GraphNodeView extends Component {
  static propTypes = {
    workspace: PropTypes.any,
    node: PropTypes.any,
  }

  onMouseDown = (event) => {
    this.props.editorState.onNodeDragStart(this.props.node, event)
  }
  onMouseUp = (event) => {
    this.props.editorState.onNodeDragEnd(event)
  }
  render() {

    const { node } = this.props
    const { x, y, width, height } = node
    return <React.Fragment>
      <rect
        width={width} 
        height={height} 
        x={x} 
        y={y} 
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      />
    </React.Fragment>
  }
})