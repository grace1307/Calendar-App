class CalendarEventControl extends BaseControl {
  constructor () {
    super()

    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  handleEdit () {
    const {
      onEdit,
      eventDetail
    } = this.property

    onEdit(eventDetail)
  }

  handleDelete () {
    const {
      onDelete,
      eventDetail
    } = this.property

    onDelete(eventDetail, this.unmount)
  }

  render () {
    const { eventDetail } = this.property

    this.setState({ html: templates.getEventHTML(eventDetail) })
  }

  mount () {
    const { anchor, eventDetail, getAddr } = this.property
    const { html } = this.state
    const mountingElement = elementUtils.getElement(anchor)

    if (mountingElement) {
      elementUtils.appendToElement(html, mountingElement)
    }

    if (eventDetail.coord) {
      const coords = eventDetail.coord.split(',')

      getAddr({
        lat: parseFloat(coords[0]),
        lng: parseFloat(coords[1])
      }, addr => {
        const eventAddrElement = elementUtils.getElement(`#event-id-${eventDetail.id} .calendarEventAddr`)

        if (eventAddrElement) {
          eventAddrElement.textContent = addr
        }
      })
    }
  }

  unmount () {
    const { eventDetail } = this.property

    if (eventDetail.id) {
      const eventElement = elementUtils.getElement(`#event-id-${eventDetail.id}`)

      if (eventElement) elementUtils.removeElement(eventElement)
    }
  }

  bindHandlers () {
    this.setHandler('.calendarEventCtrlButtonEdit', 'click', this.handleEdit)
    this.setHandler('.calendarEventCtrlButtonDelete', 'click', this.handleDelete)
  }
}

/*
Property:
onEdit()
onDelete()

eventDetail:
  id,
  title,
  content,
  year,
  month,
  day,
  startHr,
  startMin,
  endHr,
  endMin,
  tag
 */
