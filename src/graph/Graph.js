import React, {Component, createRef} from 'react'
import * as d3 from 'd3'
import * as d3bbox from 'd3-bboxCollide'
export class Graph extends Component {
  
  
  container = undefined
  setContainer = container => {
    if (!this.container) {
      this.container = container
      this.onContainerAdded()
    }
  }

  onContainerAdded() {
    
    window.container = this.container
    window.d3 = d3
    draw(this.container)
    
  }

  render() {
    return <div style={{width: '300px', height: '300px'}} ref={this.setContainer} />
  }

}

function draw(container) {

  var width = document.body.clientWidth
  var height = document.body.clientHeight
  var nodes = [{
    id: 'A',
    x: 100, y: 100
  }, {
    id: 'B',
    x: 100, y: 100
  }, {
    id: 'C',
    x: 100, y: 100
  }, {
    id: 'D',
    x: 100, y: 100
  }, {
    id: 'E',
    x: 100, y: 100
  }]

  var links = [
    {source: 'A', target: 'B'},
    {source: 'A', target: 'C'},
    {source: 'C', target: 'D'},
    {source: 'C', target: 'E'},
  ]

  var chart = d3.select(container)
  
  var svg = chart.append('svg').attr('width', width).attr('height', height)

  var draggable = d3.drag()
  .on('start', dragstarted)
  .on('drag', dragged)
  .on('end', dragended)
    
  function dragstarted() {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d3.event.subject.fx = d3.event.subject.x;
    d3.event.subject.fy = d3.event.subject.y;
  }
  
  function dragged() {
    d3.event.subject.fx = d3.event.x;
    d3.event.subject.fy = d3.event.y;
  }
  
  function dragended() {
    if (!d3.event.active) simulation.alphaTarget(0);
    d3.event.subject.fx = null;
    d3.event.subject.fy = null;
  }
  
  
  // const collide = d3.forceCollide()
  //   .radius(x => 5)
  //   .strength(10)

  const collide = d3bbox.bboxCollide(nodes)
    .bbox($ => [[$.x - 10, $.y - 5], [$.x + 10, $.y + 5]])
  const link = d3.forceLink()
    .id(x => x.id)
    .distance(x => 60)
    .links(links)

  var simulation = d3.forceSimulation(nodes)
    .force('collide', collide)
    .force('link', link)
    .on('tick', ticked);

  function ticked() {
    
    var l = svg
      .selectAll('line.edges')
      .data(links)

    l.enter()
    .append('line')
    .attr('class', 'edges')
    .attr('style', 'stroke:rgb(255,0,0);stroke-width:2')
    .merge(l)
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
    
    l.exit().remove()

    var u = svg
      .selectAll('rect.nodes')
      .data(nodes)

    u.enter()
      .append('rect')
        .attr('class', 'nodes')
        .attr('width', 20)
        .attr('height', 10)
      .merge(u)
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .call(draggable)

    u.exit().remove()

    var btns = svg
      .selectAll('circle.top-node-btn')
      .data(nodes)

    btns.enter()
      .append('circle')
        .attr('class', 'top-node-btn')
        .attr('r', 5)
        .attr('style', 'fill:rgb(255,255,255)')
      .merge(btns)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

    btns.exit().remove()
  }


}