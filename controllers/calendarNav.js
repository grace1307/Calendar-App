class CalendarNavControl extends BaseControl {
  constructor () {
    super()

    this.handleDateSelectorChange = this.handleDateSelectorChange.bind(this)
  }
  handleDateSelectorChange () {
    const { onSetCalendarRange } = this.property
    const year = this.getElement('.calendarYearSelector').value || null
    const month = this.getElement('.calendarMonthSelector').value || null

    onSetCalendarRange({ year, month })
  }

  setDateSelectorValue (year, month) {
    this.getElement('.calendarYearSelector').value = year
    this.getElement('.calendarMonthSelector').value = month
  }

  handleToggleAgenda () {
    const scheduleElement = elementUtils.getElement('.calendarScheduleContainer')

    scheduleElement.hidden = !scheduleElement.hidden
  }

  render () {
    this.setState({ html: templates.getCalendarNavHtml() })
  }

  bindHandlers () {
    const { onSetCalendarRange, onClickPrevMonth, onClickNextMonth } = this.property
    const today = new Date()

    this.setHandler('.calendarControlMonthButtonPrev', 'click', onClickPrevMonth)
    this.setHandler('.calendarControlMonthButtonNext', 'click', onClickNextMonth)
    this.setHandler('.calendarControlTodayButton', 'click', () => onSetCalendarRange({ year: today.getFullYear(), month: today.getMonth() + 1 }))
    this.setHandler('.calendarControlViewControlButtonAgenda', 'click', this.handleToggleAgenda)

    this.setHandler('.calendarYearSelector', 'change', this.handleDateSelectorChange)
    this.setHandler('.calendarMonthSelector', 'change', this.handleDateSelectorChange)
  }
}

/*
Property
onSetCalendarRange, onClickPrevMonth, onClickNextMonth
 */