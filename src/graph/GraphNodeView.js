import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
/**
 * 
 */

function between(start, end)  {
  return start.map((dimension, i) => (dimension + end[i]) / 2)
}
export const GraphNodeLine = observer(class GraphNodeLine extends Component {
  render() {
    const a = this.props.source
    const b = this.props.target
  
  
    const start = [a.x + a.width / 2, a.y]
    const end = [b.x - b.width / 2, b.y]
    const middle = between(start, end) 
    // const firstQuarter = between(start, middle)
    // const lastQuarter = between(middle, end)
    
    const curveCenterA = [middle[0], start[1]]
    const curveCenterB = [middle[0], end[1]]
    
    
    return <path
      style={{stroke: 'rgb(255,0,0)', strokeWidth: 1, fill: "transparent"}}
      d={`M${start} C ${curveCenterA}, ${curveCenterA}, ${middle} C ${curveCenterB} ${curveCenterB} ${end}`}
    />
    
  }
})

/**
 * 
 */
export const GraphNodeView = observer(class GraphNodeView extends Component {
  static propTypes = {
    editorState: PropTypes.any,
    node: PropTypes.any,
  }

  onMouseDown = (event) => {
    this.props.editorState.onNodeDragStart(this.props.node, event)
  }
  render() {
    
    const { node, editorState } = this.props
    const { x, y, width, height } = node
    return !node.isOnScreen ? <React.Fragment /> : <React.Fragment>
      <rect
        width={width} 
        height={height} 
        x={x - width/2} 
        y={y - height/2}
        style={{fill: 'rgba(0,0,0,0.2)'}} 
        onMouseDown={this.onMouseDown}
        onMouseUp={editorState.onNodeDragEnd}
      />
      
      <foreignObject 
        width={width} 
        height={height} 
        x={x - width/2} 
        y={y - height/2}><div xmlns="http://www.w3.org/1999/xhtml" style={{fontSize: '5px'}}>{node.underlying.title}</div></foreignObject>
    </React.Fragment>
  }
})