export function parseTree(str) {
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
  