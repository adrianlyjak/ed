import * as d3 from 'd3'
import {flextree} from 'd3-flextree'


function buildRandomTree({
  depth = 10,
  minDepth = 5,
  maxChildren = Math.floor(1 + Math.random() * 4),
  chanceHasChildren = 0.5,
} = {}) {

  function descend(node = {children: []}, currentDepth = 0) {
    if (currentDepth <= depth && (Math.random() <= chanceHasChildren) || currentDepth < minDepth) {
      node.children = Array(Math.ceil(Math.random() * maxChildren)).fill(null).map(x => {
        return {
          parent: node,
          children: []
        }
      })
      node.children.forEach(x => descend(x, currentDepth + 1))
    }
    return node
  }

  const root = descend({children: []})
  return root
}


export function loadDefault(ws) {

  function createNodes(prototype, parent = null) {
    const node = ws.createNode({ parent })
    prototype.children.forEach(x => createNodes(x, node))
    return node
  }
  
  var root = buildRandomTree()
  var nodes = createNodes(root)

  const layout = flextree()
  .nodeSize(x => [x.data.height, x.data.width + 20])
  // .spacing(x => 5)
  .spacing((nodeA, nodeB) => {
    if (nodeA.parent && nodeA.parent.children.indexOf(nodeB) > -1) {
      return 5 
    } else {
      return 15
    }
  })
  
  const hierarchy = d3.hierarchy(nodes)

  layout(hierarchy)

  
  hierarchy.each(n => {
    n.data.x = n.y + (n.data.width / 2)
    n.data.y = n.x 
  })

}

function parse(str) {
  const depths = str.split('\n').map(x => {
    const split = x.split("")
    let depth = 0
    while (split.shift() === ' ') {
      depth++
    }
    return depth
  })
  const root = { children: [], depth: -1 }
  var current = root
  for (let d of depths) {
    if (d < current.depth) {
      const node = { depth: d, parent: current, children: [] }
      current.children.push(node)
      current = node
    } else {
      const parents = [current]
      while (parents[0].parent) {
        parents.unshift(parents[0].parent)
      }
      const parent = parents.reverse().find(x => x.depth < d)
      const node = { depth: d, parent, children: [] }
      parent.children.push(node)
      current = node
    }
  }
  return root
}

const instructions = `
x
  x
  x
  x
    x
    x
    x
      x
      x
        x
          x
          x
            x
          x
            x
            x
            x
            x
            x
            x
              x
                x
                  x
                  x
                  x
                  x
                x
                x
                x
              x
              x
              x
            x
              x
        
        x
        x
      x
      x
        x
        x
        x
        x
        x
      x
      x
    x 
      x
      x
      x
      x
x
  x
    x
    x
  x
    x
    x
      x
      x
        x
    x
  x
    x
      x
      x
        x
        x
    x
    x
      x
        x
        x
      x
      x
      x
x
  x
    x
    x
  x
    x
      x
        x
        x
        x
          x
          x
          x
          x
          x
          x
          x
        x
          x
          x
          x
          x
          x
        x
      x
        x
          x
          x
          x
          x
    x
    x
      x
        x
          x
          x
          x
          x
        x
        x
        x
      x
      x
      x
    x
      x

  x
    x
    x
    x
    x
    x
    x
      x
      x
        x
          x
          x
            x
          x
            x
            x
            x
            x
        x
        x
      x
      x
        x
        x
        x
        x
        x
      x
      x
    x 
      x
      x
      x
      x
  `
  