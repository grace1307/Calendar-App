class BaseControl {
  constructor () {
    this.state = {
      html: ''
    }

    this.setProperty = this.setProperty.bind(this)
    this.mount = this.mount.bind(this)
    this.unmount = this.unmount.bind(this)
    this.refresh = this.refresh.bind(this)
  }

  // Internal
  setProperty (property = { anchor: '' }) {
    this.property = property
  }

  setState (newState) {
    this.state = Object.assign({}, this.state, newState)
  }

  setHandler (selector, eventType, handler) {
    const { anchor } = this.property
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement && mountingElement.childNodes) {
      [...mountingElement.childNodes].map(childNode => {
        if (childNode.nodeType !== Node.TEXT_NODE) {
          const targetElement = elementUtils.getElement(selector, childNode)

          if (targetElement) targetElement.addEventListener(eventType, handler)
        }
      })
    }
  }

  getElement (selector) {
    const { anchor } = this.property
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement && mountingElement.childNodes) {
      const [targetElement] = [...mountingElement.childNodes].map(childNode => {
        if (childNode.nodeType !== Node.TEXT_NODE) {
          return elementUtils.getElement(selector, childNode)
        } else {
          return null
        }
      }).filter(t => t)

      if (targetElement) return targetElement
    }

    return {}
  }

  // Cycle
  mount () {
    const { anchor } = this.property
    const { html } = this.state
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement) {
      elementUtils.setInnerHtml(html, mountingElement)
    }
  }

  unmount () {
    const { anchor } = this.property
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement && mountingElement.childNodes) [...mountingElement.childNodes].map(elementUtils.removeElement)
  }

  refresh () {
    this.unmount()
    this.render()
    this.mount()
    this.bindHandlers()
  }

  // Custom
  render () {} // Update state.html with setState
  bindHandlers () {} // Bind event listeners with property and setHandler
}