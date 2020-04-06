class CalendarScheduleControl extends BaseControl {
  render () {
    const { eventDetail } = this.property

    this.setState({ html: templates.getScheduleEventHTML(eventDetail) })
  }

  mount () {
    const { anchor } = this.property
    const { html } = this.state
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement) {
      elementUtils.appendToElement(html, mountingElement)
    }
  }

  unmount () {
    const { eventDetail } = this.property

    if (eventDetail.id) {
      const eventElement = elementUtils.getElement(`#schedule-event-id-${eventDetail.id}`)

      if (eventElement) elementUtils.removeElement(eventElement)
    }
  }
}
