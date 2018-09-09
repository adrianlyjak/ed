import {Node} from './parseTree'

export function buildRandomTree({
  depth = 10,
  minDepth = 5,
  maxChildren = Math.floor(1 + Math.random() * 4),
  chanceHasChildren = 0.5,
} = {}): Node {

  function descend(node: Node = {children: []}, currentDepth = 0) {
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
