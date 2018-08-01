import EventEmitter from 'wolfy87-eventemitter'

export function ClickHandler(workspace, node) {
  const emitter = new EventEmitter()
  let active = false
  let lastPosition = null
  
  return Object.assign(emitter, {
    onMouseDown(event) {
      if (!active) {
        emitter.emit('dragstart', node)
        active = true
      }
      event.stopPropagation()
      lastPosition = [event.clientX, event.clientY]
    },
    onMouseUp(event) {
      if (active) {
        active = false
        emitter.emit('dragend', node)
      }
    },
    onMouseMove(event) {
      if (active) {
        const [lastX, lastY] = lastPosition
        node.x += (event.clientX - lastX) * workspace.screen.zoom
        node.y += (event.clientY - lastY) * workspace.screen.zoom
        lastPosition = [event.clientX, event.clientY]
      }
    }
  })
}