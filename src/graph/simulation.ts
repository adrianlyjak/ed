import * as d3bbox from 'd3-bboxCollide'
import * as d3 from 'd3'
import { IGraph } from './Graph';


export function attachSimulation(ws: IGraph): void {
  const nodes = ws.nodes

  const collide = d3bbox.bboxCollide(nodes)
    .bbox(n => [
      [n.width / -2, n.height / -2], 
      [n.width / 2, n.height / 2]
    ])

  function getLinks() {
    return ws.links.map(([a, b]) => ({source: a.id, target: b.id}))
  }

  const link = d3.forceLink()
    .id(x => x.id)
    .distance(x => 180)
    .links(getLinks())

  const simulation = d3.forceSimulation(nodes)
    .force('collide', collide)
    .force('link', link)

  function restart() {
    simulation.nodes(ws.nodes);
    simulation.force('link').links(getLinks());
    simulation.alpha(0.1).restart();
  }

  ws.nodes.observe(x => {
    console.log('foo')
    restart() 
  })

}