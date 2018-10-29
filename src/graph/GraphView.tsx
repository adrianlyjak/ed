import * as React from 'react'
import { Graph, IGraph } from './Graph'
import { observer } from 'mobx-react'
import * as mobx from 'mobx'
import PropTypes from 'prop-types'
import { Screen, IScreen, throttleWithEaseOut } from './Screen'
import { EditorState, IEditorState } from './EditorState'

import { GraphNodeLine, GraphNodeEditors } from './GraphNodeView'

import { buildRandomTree } from './buildRandomTree'
import { TreeLayout, ITreeLayout } from './TreeLayout';
import { render } from 'react-dom';
import { IGraphNode } from './GraphNode';
import { parseTree, Node, node as n } from './parseTree';
import * as Hammer from 'hammerjs'
import {animate} from '../util/animate'


function createNodes(graph: IGraph, prototype: Node, parent = null): IGraphNode {
  const node = graph.createNode({ parent })
  prototype.children.forEach(x => createNodes(graph, x, node))
  return node
}

function loadRandom(ws): void {
  createNodes(ws, buildRandomTree())
}

interface IGraphViewState extends mobx.IObservableObject {
  ws: IGraph
  screen: IScreen
  treeLayout: ITreeLayout
  editorState: IEditorState
}

export function createGraphViewState(): IGraphViewState {
  const ws = Graph();
  const tree = n(
    n(),
    n(),
    n(),

    n(
      n(
        // n(),
        // n(
        //   n(
        //     n(), n(),
        //   ),
        //   n()
        // )
      ),
      n(),
      n(
        n(),
        n(
          n(
            n(), n(), n(), n(
              n(), n(),
            ),
          ),
          n(
            n(
              n(),
              n(
                n(
                  n(), n(), n(), n(
                    n(), n(
                      n(
                        n(),
                        n(
                          n(
                            n(
                              n(
                                n(),
                                n(
                                  n(
                                    n(), n(),
                                  ),
                                ),
                                n(), n(), n()
                              )
                            )
                          ), n(), n(), n(
                            n(), n(),
                          ),
                        ),
                        n()
                      )
                    )
                  ),
                ),
              ),
              n()
            ),
            n(
              n(
                n(),
                n(
                  n(
                    n(), n(), n(), n(
                      n(), n(
                        n(
                          n(),
                          n(
                            n(
                              n(
                                n(
                                  n(),
                                  n(
                                    n(
                                      n(), n(),
                                    ),
                                  ),
                                  n(), n(), n()
                                )
                              )
                            ), n(), n(), n(
                              n(), n(),
                            ),
                          ),
                          n()
                        )
                      )
                    ),
                  ),
                ),
                n()
              )
            )
          )
        )
      )
    )
  )

  createNodes(ws, tree)

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

  state = {
    container: null
  }

  hammer?: HammerManager;

  componentDidUpdate(prevProps, prevState) {
    if (prevState.container !== this.state.container) {
      this.buildHammer()
    }
  }

  componentWillUnmount() {
    this.destroyHammer()
  }

  destroyHammer() {
    if (this.hammer) this.hammer.destroy()
  }
  buildHammer() {
    this.destroyHammer()
    /*    var mc = new Hammer.Manager(el);
    
        mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    
        mc.add(new Hammer.Swipe()).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
        mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan'), mc.get('rotate')]);
    
        mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
        mc.add(new Hammer.Tap());
    
        mc.on("panstart panmove", onPan);
        mc.on("rotatestart rotatemove", onRotate);
        mc.on("pinchstart pinchmove", onPinch);
        mc.on("swipe", onSwipe);
        mc.on("tap", onTap);
        mc.on("doubletap", onDoubleTap);
    
        mc.on("hammer.input", function(ev) {
            if(ev.isFinal) {
                resetElement();
            }
        });*/

    let mc;
    this.hammer = mc = new Hammer.Manager(this.state.container)
    mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }))
    // mc.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(mc.get('pan'));
    mc.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([mc.get('pan')]);
    mc.add(new Hammer.Tap())
    mc.on('pinch pinchstart pinchmove', (() => {
      return (pinch: HammerInput) => {
        console.log({ pinch })
      }
    })())
    mc.on('tap', (() => {
      let which = false
      return (t: HammerInput) => {
        which = !which
        this.props.state.screen.animateZoomTo({ x: t.center.x, y: t.center.y }, undefined, which ? 0.5 : 2)
      }
    })())
    mc.on('pan', (() => {
      let lastX = 0
      let lastY = 0
      return (pan: HammerInput) => {
        let changeX = lastX - pan.deltaX
        let changeY = lastY - pan.deltaY
        this.props.state.screen.pan(changeX, changeY)
        if (pan.isFinal) {
          lastX = 0
          lastY = 0
        } else {
          lastX = pan.deltaX
          lastY = pan.deltaY
        }
      }
    })())
  }


  setContainer = (element: Element) => {

    this.setState({ container: element })
  }

  render() {
    const { ws, screen, editorState, treeLayout } = this.props.state
    return <div
      ref={this.setContainer}
      onWheel={editorState.onScroll}
      style={{ width: '100%', height: '100%' }} >
      <svg
        style={{ backgroundColor: 'lightblue' }}
        width={screen.clientWidth} height={screen.clientHeight}
      // overflow="visible"
      // onMouseMove={editorState.onNodeDrag}
      // onMouseDown={editorState.onMouseDown}
      // onMouseUp={editorState.onMouseUp}
      >
        <g
          style={{
            transition: `transform ${throttleWithEaseOut}ms ease-out`,
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
          <Nodes screen={screen} ws={ws} editorState={editorState} treeLayout={treeLayout} />
          {/* <Ticks screen={screen} /> */}
        </g>
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
  ws: IGraph,
  editorState: IEditorState,
  treeLayout: ITreeLayout,
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
    const {
      screen, ws, editorState, treeLayout
    } = this.props
    return <React.Fragment>
      {
        ws.links
          .map(([a, b]) => <GraphNodeLine
            key={a.id + b.id}
            source={treeLayout.get(a.id)}
            target={treeLayout.get(b.id)}
          />)
      }
      <GraphNodeEditors screen={screen} graph={ws} treeLayout={treeLayout}></GraphNodeEditors>
    </React.Fragment>
  }
}


