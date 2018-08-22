import React, {Component} from 'react'
import {Workspace} from './Graph'
import {observer} from 'mobx-react'
import * as mobx from 'mobx'
import PropTypes from 'prop-types'
import {Screen, screenToGrid} from './Screen'
import {EditorState} from './EditorState'
import {loadDefault} from './sample'
import {GraphNodeLine, GraphNodeView} from './GraphNodeView'

export function createGraphViewState() {
  const ws = Workspace();
  const screen = Screen(ws, document.body);
  const editorState = EditorState(screen, ws)
  loadDefault(ws)
  const minX = Math.min(...ws.nodes.map(node => node.x - node.width / 2))
  const maxX = Math.max(...ws.nodes.map(node => node.x + node.width / 2))
  const minY = Math.min(...ws.nodes.map(node => node.y - node.height / 2))
  const maxY = Math.max(...ws.nodes.map(node => node.y + node.height / 2))

  const margin = 100
  screen.fit([[minX - 100, minY - 100], [maxX + 100, maxY + 100]])

  return mobx.observable({
    ws, screen,
    editorState,
  })
}

export const GraphView = observer(class GraphView extends Component {
  
  render() {
    const { ws, screen, editorState } = this.props.state
    return <div 
    onWheel={editorState.onScroll}
    style={{width: '100%', height: '100%'}} >
      <svg 
        width={screen.clientWidth} height={screen.clientHeight} 
        // overflow="visible"
        onMouseMove={editorState.onNodeDrag}
        onMouseDown={editorState.onMouseDown}
        onMouseUp={editorState.onMouseUp}
      >
      <Nodes screen={screen} ws={ws} editorState={editorState} />
      <Ticks screen={screen} />
      </svg>
    </div>
  }

})

const Ticks = observer(function Ticks({ screen }) {
  return <React.Fragment>
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
  </React.Fragment>
})

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
      ws.links
      .map(([a, b]) => <GraphNodeLine
        key={a.id + b.id}
        source={a}
        target={b}
      />)
    }
    {
      ws.nodes
        .map(n =>
        <GraphNodeView
          key={n.id}
          screen={screen}
          node={n}
          editorState={editorState}
        />)
    }
  </g>
})

