import * as React from 'react'
import { Workspace, IWorkspace } from './Graph'
import { observer } from 'mobx-react'
import * as mobx from 'mobx'
import PropTypes from 'prop-types'
import { Screen, IScreen } from './Screen'
import { EditorState, IEditorState } from './EditorState'

import { GraphNodeLine, GraphNodeView } from './GraphNodeView'

import { buildRandomTree } from './buildRandomTree'
import { TreeLayout, ITreeLayout } from './TreeLayout';
import { render } from 'react-dom';
import { IGraphNode } from './GraphNode';



function loadRandom(ws): void {

  function createNodes(prototype, parent = null): IGraphNode {
    const node = ws.createNode({ parent })
    prototype.children.forEach(x => createNodes(x, node))
    return node
  }

  createNodes(buildRandomTree())
}

interface IGraphViewState extends mobx.IObservableObject {
  ws: IWorkspace
  screen: IScreen
  treeLayout: ITreeLayout
  editorState: IEditorState
}

export function createGraphViewState(): IGraphViewState {
  const ws = Workspace();
  loadRandom(ws)

  const screen = Screen(document.body);
  const editorState = EditorState(screen, ws);
  const treeLayout = TreeLayout(ws, screen)
  const minX = Math.min(...treeLayout.values.map(node => node.x - node.width / 2))
  const maxX = Math.max(...treeLayout.values.map(node => node.x + node.width / 2))
  const minY = Math.min(...treeLayout.values.map(node => node.y - node.height / 2))
  const maxY = Math.max(...treeLayout.values.map(node => node.y + node.height / 2))

  const margin = 100
  screen.fit([minX - 100, minY - 100], [maxX + 100, maxY + 100])

  return mobx.observable({
    ws, screen,
    treeLayout,
    editorState,
  })
}

@observer
export class GraphView extends React.Component<{ state: IGraphViewState }, {}, {}> {

  render() {
    const { ws, screen, editorState, treeLayout } = this.props.state
    return <div
      onWheel={editorState.onScroll}
      style={{ width: '100%', height: '100%' }} >
      <svg
        width={screen.clientWidth} height={screen.clientHeight}
        // overflow="visible"
        onMouseMove={editorState.onNodeDrag}
        onMouseDown={editorState.onMouseDown}
        onMouseUp={editorState.onMouseUp}
      >
        <Nodes screen={screen} ws={ws} editorState={editorState} treeLayout={treeLayout} />
        {/* <Ticks screen={screen} /> */}
      </svg>
    </div>
  }
}

const Ticks = observer(function Ticks({ screen }) {
  return <React.Fragment>
    {
      Array(Math.round(screen.clientWidth / 10)).fill(null).map((x, i) => <line
        key={i}
        style={{ stroke: 'rgb(200,200,200)', strokeWidth: 2 }}
        x1={i * 10} y1={0}
        x2={i * 10} y2={10}
      />)
    }
    {
      Array(Math.round(screen.clientHeight / 10)).fill(null).map((x, i) => <line
        key={i}
        style={{ stroke: 'rgb(200,200,200)', strokeWidth: 2 }}
        x1={0} y1={i * 10}
        x2={10} y2={i * 10}
      />)
    }
  </React.Fragment>
})

@observer
class Nodes extends React.Component<{
  screen: IScreen,
  ws: IWorkspace,
  editorState: IEditorState,
  treeLayout: ITreeLayout,
}, {}, {}> {

  render() {
    const {
      screen, ws, editorState, treeLayout
    } = this.props
    return <g
      style={{
        transform: `matrix(
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
            source={treeLayout.get(a.id)}
            target={treeLayout.get(b.id)}
          />)
      }
      {
        ws.nodes
          .map(n =>
            <GraphNodeView
              key={n.id}
              node={treeLayout.get(n.id)}
              editorState={editorState}
            />)
      }
    </g>
  }
}


