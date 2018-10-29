import * as React from 'react'
import * as PropTypes from 'prop-types'
import * as mobx from 'mobx'
import { observer } from 'mobx-react'
import { ITreeLayoutNode, TreeLayout, ITreeLayout } from './TreeLayout';
import { IEditorState } from './EditorState';
import { withStyles, Card, createStyles, WithStyles, Portal } from '@material-ui/core';
import { GraphNode } from './GraphNode';
import ReactResizeDetector from 'react-resize-detector';
import { createPortal } from 'react-dom';
import { Editor } from '../editor/Editor';
import { IScreen, throttleWithEaseOut } from './Screen';

import * as materialUI from '../codemirror/theme/material-ui';
import { IGraph } from './Graph';

/**
 * 
 */

function between(start, end) {
  return start.map((dimension, i) => (dimension + end[i]) / 2)
}


const sizes = [
  'toosmall',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl'
]

export const GraphNodeLine = observer(class GraphNodeLine extends React.Component<{ source: ITreeLayoutNode, target: ITreeLayoutNode }> {
  render() {
    const a = this.props.source
    const b = this.props.target


    // const start = [a.screenPosition.x + a.screenDimensions.x / 2, a.screenPosition.y]
    // const end =   [b.screenPosition.x - b.screenDimensions.x / 2, b.screenPosition.y]

    const start = [a.x + a.width / 2, a.y]
    const end = [b.x - b.width / 2, b.y]
    const middle = between(start, end)
    // const firstQuarter = between(start, middle)
    // const lastQuarter = between(middle, end)

    const curveCenterA = [middle[0], start[1]]
    const curveCenterB = [middle[0], end[1]]


    return <path
      id={a.underlying.id + '-' + b.underlying.id}
      style={{ stroke: 'rgb(0, 0, 0, 0.5)', strokeWidth: 5, fill: "transparent" }}
      d={`M${start} C ${curveCenterA}, ${curveCenterA}, ${middle} C ${curveCenterB} ${curveCenterB} ${end}`}
    />

  }
})


@observer
export class GraphNodeEditors extends React.Component<{
  screen: IScreen,
  graph: IGraph,
  treeLayout: ITreeLayout
}, {}, {}> {

  container: HTMLElement = (() => {
    let c = document.createElement('div')
    document.body.appendChild(c)
    Object.assign(c.style, {
      position: 'absolute',
      top: '0',
      left: '0'
    })
    return c
  })()

  componentWillUnmount() {
    document.body.removeChild(this.container)
  }

  render() {
    const { graph, treeLayout, screen } = this.props
    return <Portal container={() => this.container}>
      <div
        style={{
          position: 'relative',
          transition: `top ${throttleWithEaseOut}ms ease-out, 
          left ${throttleWithEaseOut}ms ease-out`,
          top: screen.topOffset * -1,
          left: screen.leftOffset * -1,
        }}
      >
        <RenderGraphNodeEditors {...this.props}></RenderGraphNodeEditors>
      </div>
    </Portal>
  }
}

const RenderGraphNodeEditors = observer(({ graph, treeLayout, screen }: {
  screen: IScreen,
  graph: IGraph,
  treeLayout: ITreeLayout
}) => {
  return <React.Fragment>{
    graph.nonRootNodes.map(x => {
      const tree = treeLayout.nodes.get(x.id)
      return <GraphNodeCard key={x.id} screen={screen} node={tree} />
    })
  }</React.Fragment>
})


@observer
export class GraphNodeCard extends React.Component<{
  screen: IScreen,
  node: ITreeLayoutNode
}> {


  breakpoints: { name: string, width: number }[] = sizes.map((name, i) => {
    return { name, width: 40 * Math.pow(2, i + 1) }
  })

  getNameForWidth(width): string {
    return (this.breakpoints.find(bp => width <= bp.width) || this.breakpoints[this.breakpoints.length - 1]).name
  }
  render() {
    const { node, screen } = this.props

    const sizer = this.getNameForWidth(node.screenDimensions.x)

    return (
      <Card
        id={node.underlying.id}
        style={{
          position: 'absolute',
          // opacity: 0.5,
          transition: `top ${throttleWithEaseOut}ms ease-out, 
            left ${throttleWithEaseOut}ms ease-out, 
            width ${throttleWithEaseOut}ms ease-out, 
            height ${throttleWithEaseOut}ms ease-out`,
          width: node.screenDimensions.x,
          height: node.screenDimensions.y,
          top: (node.y - node.height / 2) / screen.zoom,
          left: (node.x - node.width / 2) / screen.zoom,
        }}
      >
        {
          // !screen.zooming && node.isOnScreen && 
          <Editor
            size={sizer}
            value={node.underlying.content} onChange={e => node.underlying.content = e} />
        }
      </Card >
    )
  }
}


