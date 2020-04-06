function setMapReady () {
  const login = new LoginControl()
  const calendar = new CalendarControl()
  const reloadLoginState = () => calendar.refresh()

  elementUtils.setInnerHtml(templates.getFrameworkHTML(), elementUtils.getElement('.root'))

  login.setProperty({
    anchor: '.frameworkBodySectionLeft',
    onLoginAttempt: reloadLoginState
  })
  login.refresh()
  calendar.initialize()
  login.checkEtched()
}
