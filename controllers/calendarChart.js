class CalendarChartControl extends BaseControl {
  constructor () {
    super()

    this.state = Object.assign({}, this.state, { year: 0, month: 0 })
    this.refresh = this.refresh.bind(this)
    this.setCalendarRange = this.setCalendarRange.bind(this)
    this.setNextMonth = this.setNextMonth.bind(this)
    this.setPrevMonth = this.setPrevMonth.bind(this)
  }

  refresh () {
    let { year, month } = this.state
    const { onCalendarRangeUpdate } = this.property

    if (!year || !month) {
      const today = new Date()
      year = today.getFullYear()
      month = today.getMonth() + 1

      this.setState({ year, month })
    }

    super.refresh()
    onCalendarRangeUpdate(year, month)
  }

  setCalendarRange (date) {
    const { year: yearCurrent, month: monthCurrent } = this.state
    let { year, month } = date

    year = parseInt(year || yearCurrent)
    month = parseInt(month || monthCurrent)

    this.setState({ year, month })
    this.refresh()
  }

  setNextMonth () {
    const { year, month } = this.state
    const isOverlap = month + 1 > 12

    this.setState({
      year: isOverlap ? year + 1 : year,
      month: isOverlap ? 1 : month + 1
    })
    this.refresh()
  }

  setPrevMonth () {
    const { year, month } = this.state
    const isOverlap = month - 1 === 0

    this.setState({
      year: isOverlap ? year - 1 : year,
      month: isOverlap ? 12 : month - 1
    })
    this.refresh()
  }

  render () {
    const { year, month } = this.state

    this.setState({ html: templates.getCalendarHtml(year, month) })
  }
}


/**
 * Property
 * onCalendarRangeUpdate
 */