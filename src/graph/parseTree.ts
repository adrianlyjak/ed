export interface Node {
  parent?: Node
  children: Node[]
}

export function node(...children): Node {
  const self: Node = { children }
  for (let c of self.children) {
    c.parent = self
  }
  return self
}

export function parseTree(str: string): Node {
  const depths = str.split('\n').map(x => {
    const split = x.split("")
    let depth = 0
    while (split.shift() === ' ') {
      depth++
    }
    return depth
  })
  type AndDepth = Node & {depth: number }
  const root: AndDepth = { children: [], depth: -1 }
  var current: AndDepth = root
  for (let d of depths) {
    if (d < current.depth - 1) {
      const node = { depth: d, parent: current, children: [] }
      current.children.push(node)
      current = node
    } else {
      const parents = [current]
      while (parents[0].parent) {
        parents.unshift(parents[0].parent as AndDepth)
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
  