class CalendarFormControl extends BaseControl {
  constructor () {
    super()

    // Why is there no enum in JS...
    this.operations = {
      add: 'add',
      modify: 'modify'
    }

    this.state = Object.assign({}, this.state, {
      eventDetail: {},
      operation: this.operations.add,
      isSending: false,
      currentCoord: null
    })

    this.marker = null
    this.map = null
    this.geocoder = null
    this.infowindow = null

    this.refresh = this.refresh.bind(this)
    this.isValid = this.isValid.bind(this)
    this.getEvent = this.getEvent.bind(this)
    this.setEvent = this.setEvent.bind(this)
    this.addEvent = this.addEvent.bind(this)
    this.modifyEvent = this.modifyEvent.bind(this)
    this.handleAfterSubmit = this.handleAfterSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
    this.initMap = this.initMap.bind(this)
    this.handleCoordUpdate = this.handleCoordUpdate.bind(this)
    this.clearCoordUpdate = this.clearCoordUpdate.bind(this)
    this.handleClickMapEvent = this.handleClickMapEvent.bind(this)
    this.updateGeocodeLatLng = this.updateGeocodeLatLng.bind(this)
    this.fulfillCoord = this.fulfillCoord.bind(this)
    this.clearMarker = this.clearMarker.bind(this)
  }

  refresh () {
    const { eventDetail } = this.state
    const {
      title,
      content,
      year,
      month,
      day,
      startHr,
      startMin,
      endHr,
      endMin,
      tag,
      coord
    } = eventDetail

    if (!year || !month || !day) {
      this.getElement('.calendarEventFormDateInput').value = ''
      this.getElement('.calendarEventFormTimeInputFrom').value = ''
      this.getElement('.calendarEventFormTimeInputTo').value = ''
      this.getElement('.calendarEventFormTitleInput').value = ''
      this.getElement('.calendarEventFormContentInput').value = ''
      this.getElement('.calendarEventFormTagSelect').value = ''
      this.clearMarker()
    } else {
      const dateInput = `${year}-${month}-${day}`
      const fromTimeInput = `${startHr}:${startMin}`
      const toTimeInput = `${endHr}:${endMin}`

      if (coord) {
        const coords = coord.split(',')

        this.fulfillCoord({
          lat: coords[0],
          lng: coords[1]
        })
      }

      this.getElement('.calendarEventFormDateInput').value = dateInput
      this.getElement('.calendarEventFormTimeInputFrom').value = fromTimeInput
      this.getElement('.calendarEventFormTimeInputTo').value = toTimeInput
      this.getElement('.calendarEventFormTitleInput').value = title
      this.getElement('.calendarEventFormContentInput').value = content
      this.getElement('.calendarEventFormTagSelect').value = tag
    }
  }

  isValid () {
    const { id } = this.state.eventDetail
    const { currentCoord } = this.state
    const eventId = id ? { id }: null

    const dateInput = this.getElement('.calendarEventFormDateInput').value
    const fromTimeInput = this.getElement('.calendarEventFormTimeInputFrom').value
    const toTimeInput = this.getElement('.calendarEventFormTimeInputTo').value
    const [year, month, day] = dateInput.split('-')
    const [startHr, startMin] = fromTimeInput.split(':')
    const [endHr, endMin] = toTimeInput.split(':')
    const coord = currentCoord ? stringUtils.coordObjToCoord(currentCoord) : null

    const eventDetail = {
      title: this.getElement('.calendarEventFormTitleInput').value,
      content: this.getElement('.calendarEventFormContentInput').value,
      year,
      month,
      day,
      startHr,
      startMin,
      endHr,
      endMin,
      tag: this.getElement('.calendarEventFormTagSelect').value,
      coord
    }

    if (Object.values(eventDetail).filter(t => t).length < 10) return false

    return Object.assign({}, eventDetail, eventId)
  }

  getEvent () {
    const eventDetail = this.isValid()

    if (!eventDetail) return

    this.setState({ eventDetail })
  }

  setEvent (eventDetail) {
    if (eventDetail.id) {
      this.setState({
        eventDetail,
        operation: this.operations.modify
      })
    } else {
      this.setState({
        eventDetail,
        operation: this.operations.add
      })
    }

    this.refresh()
  }

  addEvent () {
    const { eventDetail } = this.state

    requestUtils.post(endpoints.addEvent, Object.assign({}, eventDetail, timeUtils.getAPIDateObject(eventDetail), { token: storeUtils.getStore('user').token }), this.handleAfterSubmit)
    this.clearCoordUpdate()
  }

  modifyEvent () {
    const { eventDetail } = this.state

    requestUtils.post(endpoints.editEvent, Object.assign({}, eventDetail, timeUtils.getAPIDateObject(eventDetail), { token: storeUtils.getStore('user').token }), this.handleAfterSubmit)
    this.clearCoordUpdate()
  }

  handleAfterSubmit (resp) {
    const { onAfterModifyEvent, onAfterAddEvent } = this.property
    const { operation } = this.state
    const {
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
      tag,
      coord
    } = resp
    const newEvent = Object.assign({}, {
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
      tag,
      coord
    })

    this.setState({ isSending: false })

    switch (operation) {
    case this.operations.modify:
      onAfterModifyEvent(newEvent)
      break
    default:
      onAfterAddEvent(newEvent)
    }

    this.handleCancel()
  }

  handleSubmit () {
    const {
      operation,
      isSending
    } = this.state

    if (isSending) return

    this.setState({ isSending: true })
    this.getEvent()

    const handler = () => {
      let repeat = this.getElement('.calendarEventFormRepeatInput').value
      let cadence = this.getElement('.calendarEventFormCadenceInput').value

      repeat = repeat >= 0 ? repeat : 0
      cadence = cadence >= 0 ? cadence : 0

      if (repeat && cadence) {
        const eventDetail = this.isValid()

        if (eventDetail) {
          const eventDates = timeUtils.getRecurringDate(parseInt(eventDetail.year), parseInt(eventDetail.month), parseInt(eventDetail.day), parseInt(repeat), parseInt(cadence))

          for (let i = eventDates.length - 1; i >= 0; i--) {
            requestUtils.post(endpoints.addEvent, Object.assign({}, Object.assign({}, eventDetail, timeUtils.getAPIDateObject({
              year: `${eventDates[i].year}`,
              month: `${eventDates[i].month}`,
              day: `${eventDates[i].day}`
            })), {
              token: storeUtils.getStore('user').token
            }), () => {
              if (!i) {
                this.property.resetEvents()
                this.setState({ isSending: false })
              }
            })
          }

          this.clearCoordUpdate()
          this.handleCancel()
        }
      } else {
        this.addEvent()
      }
    }

    switch (operation) {
    case this.operations.modify:
      this.modifyEvent()
      break
    default:
      handler()
    }
  }

  handleCancel () {
    this.setState({
      eventDetail: {},
      operation: this.operations.add,
      currentCoord: null
    })
    this.getElement('.calendarEventFormRepeatInput').value = 0
    this.getElement('.calendarEventFormCadenceInput').value = 0
    this.refresh()
  }

  handleCoordUpdate (coord) {
    this.setState({ currentCoord: coord })
  }

  clearCoordUpdate () {
    this.setState({ currentCoord: null })
  }

  clearMarker () {
    if (this.marker) this.marker.setMap(null)
    this.clearCoordUpdate()
  }

  fulfillCoord ({ lat, lng }) {
    this.clearMarker()
    this.handleCoordUpdate({ lat, lng })

    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: this.map
    })

    this.updateGeocodeLatLng({ lat, lng })
  }

  handleClickMapEvent (event) {
    const center = {
      lat: event.latLng.lat().toFixed(5),
      lng: event.latLng.lng().toFixed(5)
    }

    this.fulfillCoord(center)
  }

  updateGeocodeLatLng (center) {
    const coord = {
      lat: parseFloat(center.lat),
      lng: parseFloat(center.lng)
    }

    this.geocoder.geocode({
      location: coord
    }, (results, status) => {
      if (status === 'OK' && results[0]) {
        this.infowindow.setContent(results[0].formatted_address)
        this.infowindow.open(this.map, this.marker)
      }
    })
  }

  initMap () {
    const stlCoord = {
      lat: 38.627003,
      lng: -90.199402
    }

    this.map = new google.maps.Map(this.getElement('.calendarEventFormMapBlock'), { zoom: 13, center: stlCoord })
    this.geocoder = new google.maps.Geocoder
    this.infowindow = new google.maps.InfoWindow

    google.maps.event.addListener(this.map, 'click', this.handleClickMapEvent)
  }

  render () {
    this.setState({ html: templates.getEventFormHTML() })
  }

  bindHandlers () {
    this.setHandler('.calendarEventFormButtonSubmit', 'click', this.handleSubmit)
    this.setHandler('.calendarEventFormButtonCancel', 'click', this.handleCancel)
    this.setHandler('.calendarEventFormMapCtrlButton', 'click', this.clearMarker)
    this.initMap()
  }
}

/*
Notes:
call mount()

onAfterModifyEvent()
onAfterAddEvent()

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
