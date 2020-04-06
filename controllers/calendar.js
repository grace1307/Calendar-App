class CalendarControl {
  constructor () {
    this.chart = new CalendarChartControl()
    this.form = new CalendarFormControl()
    this.nav = new CalendarNavControl()
    this.header = new CalendarHeaderControl()
    this.schedules = []
    this.events = []

    this.geocoder = new google.maps.Geocoder

    this.fetchEvents = this.fetchEvents.bind(this)
    this.initialize = this.initialize.bind(this)
    this.initializeEvents = this.initializeEvents.bind(this)
    this.onEdit = this.onEdit.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onDeleteEvent = this.onDeleteEvent.bind(this)
    this.onCalendarRangeUpdate = this.onCalendarRangeUpdate.bind(this)
    this.onAfterModifyEvent = this.onAfterModifyEvent.bind(this)
    this.onAfterAddEvent = this.onAfterAddEvent.bind(this)
    this.onSetCalendarRange = this.onSetCalendarRange.bind(this)
    this.onClickPrevMonth = this.onClickPrevMonth.bind(this)
    this.onClickNextMonth = this.onClickNextMonth.bind(this)
    this.isUserValid = this.isUserValid.bind(this)
    this.setCurrentCalendarRange = this.setCurrentCalendarRange.bind(this)
    this.resetEvents = this.resetEvents.bind(this)
    this.getAddr = this.getAddr.bind(this)
  }

  setCurrentCalendarRange (year, month) {
    storeUtils.setStore('calendar', { year, month })
  }

  fetchEvents (year, month) {
    requestUtils.post(endpoints.getEvents, {
      year: stringUtils.numberToString(year, 4),
      month: stringUtils.numberToString(month, 2),
      token: storeUtils.getStore('user').token
    }, this.initializeEvents)
  }

  isUserValid () {
    const userInfo = storeUtils.getStore('user')

    return userInfo.isLogin && userInfo.token && userInfo.username
  }

  refresh () {
    if (this.isUserValid()) {
      const { year, month } = storeUtils.getStore('calendar')

      this.form.render()
      this.form.mount()
      this.form.bindHandlers()
    } else {
      this.form.unmount()
    }
    this.chart.refresh()
  }

  initialize () {
    this.chart.setProperty({
      anchor: '.calendarContainer',
      onCalendarRangeUpdate: this.onCalendarRangeUpdate,
      setCurrentCalendarRange: this.setCurrentCalendarRange
    })
    this.form.setProperty({
      anchor: '.calendarFormContainer',
      onAfterModifyEvent: this.onAfterModifyEvent,
      onAfterAddEvent: this.onAfterAddEvent,
      resetEvents: this.resetEvents
    })
    this.nav.setProperty({
      anchor: '.frameworkMainHeader',
      onSetCalendarRange: this.onSetCalendarRange,
      onClickPrevMonth: this.onClickPrevMonth,
      onClickNextMonth: this.onClickNextMonth
    })
    this.header.setProperty({
      anchor: '.calendarHeaderContainer'
    })
    this.chart.refresh()
    this.nav.refresh()
  }

  initializeEvents (resp) {
    const nts4 = num => stringUtils.numberToString(num, 4)
    const nts2 = num => stringUtils.numberToString(num, 2)

    this.events = resp.results.map(eventDetail => {
      const eventInst = new CalendarEventControl()

      eventInst.setProperty({
        anchor: `#calendar-${nts4(eventDetail.year)}-${nts2(eventDetail.month)}-${nts2(eventDetail.day)}-dayCell`,
        eventDetail,
        onEdit: this.onEdit,
        onDelete: this.onDelete,
        getAddr: this.getAddr
      })

      eventInst.refresh()

      return eventInst
    })
    this.schedules = resp.results.sort((a, b) => {
      const convertToDate = t => new Date(`${nts4(t.year)}-${nts2(t.month)}-${nts2(t.day)}T${nts2(t.startHr)}:${nts2(t.startMin)}:00`)

      return convertToDate(a) - convertToDate(b)
    }).map(eventDetail => {
      const scheduleInst = new CalendarScheduleControl()

      scheduleInst.setProperty({
        anchor: '.calendarScheduleContainer',
        eventDetail
      })

      scheduleInst.refresh()

      return scheduleInst
    })
  }

  getAddr (coord, callback) {
    this.geocoder.geocode({
      location: coord
    }, (results, status) => {
      if (status === 'OK' && results[0]) {
        callback(results[0].formatted_address)
      }
    })
  }

  onEdit (eventDetail) {
    this.form.setEvent(eventDetail)
  }

  onDelete (eventDetail, unmount) {
    this.onDeleteEvent(eventDetail, unmount)
  }

  onDeleteEvent (eventDetail, callback) {
    requestUtils.post(endpoints.deleteEvent, { id: eventDetail.id, token: storeUtils.getStore('user').token }, resp => {
      callback(resp)
      this.schedules = this.schedules.map(t => {
        if (t.property.eventDetail.id === eventDetail.id) t.unmount()

        return t
      }).filter(t => t.property.eventDetail.id !== eventDetail.id)
    })
  }

  resetEvents () {
    const { year, month } = storeUtils.getStore('calendar')

    this.onSetCalendarRange(year, month)
  }

  onCalendarRangeUpdate (year, month) {
    this.events.map(t => t.unmount())
    this.schedules.map(t => t.unmount())
    this.events = []
    this.schedules = []

    this.setCurrentCalendarRange(year, month)
    this.nav.setDateSelectorValue(year, month)
    this.header.refresh()
    if (this.isUserValid()) this.fetchEvents(year, month)
  }

  onAfterModifyEvent (newEvent) {
    const { year, month } = newEvent

    this.onSetCalendarRange({ year, month })
  }

  onAfterAddEvent (newEvent) {
    const eventInst = new CalendarEventControl()
    const scheduleInst = new CalendarScheduleControl()
    const nts4 = num => stringUtils.numberToString(num, 4)
    const nts2 = num => stringUtils.numberToString(num, 2)

    eventInst.setProperty({
      anchor: `#calendar-${newEvent.year}-${newEvent.month}-${newEvent.day}-dayCell`,
      eventDetail: newEvent,
      onEdit: this.onEdit,
      onDelete: this.onDelete,
      getAddr: this.getAddr
    })
    scheduleInst.setProperty({
      anchor: '.calendarScheduleContainer',
      eventDetail: newEvent
    })

    eventInst.refresh()

    this.events.push(eventInst)
    this.schedules.push(scheduleInst)
    this.schedules.sort((a, b) => {
      const convertToDate = t => new Date(`${nts4(t.year)}-${nts2(t.month)}-${nts2(t.day)}T${nts2(t.startHr)}:${nts2(t.startMin)}:00`)

      return convertToDate(a.property.eventDetail) - convertToDate(b.property.eventDetail)
    }).map(t => t.refresh())
  }

  onSetCalendarRange (date) {
    this.chart.setCalendarRange(date)
  }

  onClickPrevMonth () {
    this.chart.setPrevMonth()
  }

  onClickNextMonth () {
    this.chart.setNextMonth()
  }
}
