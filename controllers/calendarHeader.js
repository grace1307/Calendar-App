class CalendarHeaderControl extends BaseControl {
  render () {
    const { year, month } = storeUtils.getStore('calendar')

    this.setState({ html: templates.getCalendarHeaderHtml(year, month) })
  }
}
