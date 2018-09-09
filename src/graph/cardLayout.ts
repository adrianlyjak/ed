

// export function treeLayout() {
//   var getNodeSize = node => node.dimensions
//   function layout(nodes) {


//     nodes.eachBefore(node => {
//       const parent = node.parent
//       const previousCol = parent && parent.parent && parent.parent.children
//       const parentIdx = node.parent.children.indexOf(node)
//       const previousSibling = parentIdx > 0 ? node.parent.children[node] : undefined
//       const lastWidth = previousCol.length ? previousCol.reduce((max, node) => {
//         const w = getNodeSize(node)[0] 
//         return w > max ? w : max
//       }, 0) : undefined
//     })
//   }

//   layout.nodeSize = (fn) => {
//     getNodeSize = fn
//     return layout
//   }

//   return layout
// }