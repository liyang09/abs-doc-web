const cursorResize = {
  resizeEl: {},
  doMove: () => {
    let el = cursorResize.getTargetEl(event.srcElement)
    if (!el) return
    let dir = cursorResize.getDirection(event.srcElement)
    el.style.cursor = dir
  },
  doDown: () => {
    let el = cursorResize.getTargetEl(event.srcElement)
    if (!el) return
    let dir = cursorResize.getDirection(event.srcElement)
    if (dir !== 'e-resize') return
    cursorResize.resizeEl = {
      ifDown: true,
      el: el,
      width: parseInt(el.style.width),
      mouseDownX: event.clientX
    }
    document.onmousemove = () => {
      cursorResize.resizeEl.el.style.width = Math.max(237, cursorResize.resizeEl.width + event.clientX - cursorResize.resizeEl.mouseDownX) + 'px'
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        cursorResize.doUp()
      }
    }
  },
  doUp: () => {
    cursorResize.resizeEl = {}
    document.onmousemove = null
  },
  getTargetEl: (el) => {
    let tempEl = el
    if (tempEl.className === 'doc') return
    while (tempEl.className && !tempEl.className.includes('docSetting')) {
      tempEl = tempEl.parentElement
    }
    return tempEl
  },
  getDirection: (el) => {
    const offset = 15
    let direction = 'default'
    let xPos = event.offsetX
    if (xPos > el.offsetWidth - offset) {
      direction = 'e-resize'
    }
    return direction
  }
}

export { cursorResize }
