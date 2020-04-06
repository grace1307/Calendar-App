const templates = {
  getDayHTMLOfDay: (yearS, monthS, dayS) => {
    return `<div class="calendarDayCell" id="calendar-${yearS}-${monthS}-${dayS}-dayCell">
  <div class="calendarDayCellHeader">${dayS}</div>
  <div class="calendarDayCellBody"></div>
</div>`
  },
  getWeekHTMLOfDaysHTML: dayHtmlList => `<div class="calendarWeekRow">${dayHtmlList.join('')}</div>`,
  getWeekHeaderHTML: () => `<div class="calendarWeekHeaderRow"><div class="calendarHeaderDayCell">Sun</div><div class="calendarHeaderDayCell">Mon</div><div class="calendarHeaderDayCell">Tue</div><div class="calendarHeaderDayCell">Wed</div><div class="calendarHeaderDayCell">Thu</div><div class="calendarHeaderDayCell">Fri</div><div class="calendarHeaderDayCell">Sat</div></div>`,
  getMonthTableHTMLOfWeeksList: (weekHeaderHtml, weekHtmlList) => `<div class="calendarTable">
  <div class="calendarMonth">
    ${weekHeaderHtml}
    ${weekHtmlList.join('')}
  </div>
</div>`,
  getCalendarYearSelectorHTML: () => `<select class="calendarYearSelector">${[...Array(100)].map((_, t) => t + 1970).map(t => `<option value="${t}"${t === (new Date()).getFullYear() ? ' selected' : ''}>${t}</option>`).join('')}</select>`,
  getCalendarMonthSelectorHTML: () => `<select class="calendarMonthSelector">${[...Array(12)].map((_, t) => t + 1).map(t => `<option value="${t}"${t === (new Date()).getMonth() + 1 ? ' selected' : ''}>${t}</option>`).join('')}</select>`,
  getCalendarHtml: (year, month) => {
    const weekList = timeUtils.getWeeksListOfYearMonth(year, month)
    const nts4 = num => stringUtils.numberToString(num, 4)
    const nts2 = num => stringUtils.numberToString(num, 2)

    return templates.getMonthTableHTMLOfWeeksList(templates.getWeekHeaderHTML(), weekList.map(week => templates.getWeekHTMLOfDaysHTML(week.map(weekDay => templates.getDayHTMLOfDay(nts4(weekDay.year), nts2(weekDay.month), nts2(weekDay.day))))))
  },
  getCalendarHeaderHtml: (year, month) => `<div class="calendarHeader">${timeUtils.getMonthName(year, month, 1)} ${year}</div>`,
  getCalendarNavHtml: () => {
    return `<div class="calendarControl">
    <div class="calendarControlViewControlBlock">
      <button type="button" class="calendarControlViewControlButton calendarControlViewControlButtonAgenda">Toggle Agenda</button>
    </div>
    <div class="calendarControlRangeSelectorBlock">
      ${templates.getCalendarYearSelectorHTML()}
      ${templates.getCalendarMonthSelectorHTML()}
    </div>
    <div class="calendarControlTodayButtonBlock">
      <button type="button" class="calendarControlTodayButton">Today</button>
    </div>
    <div class="calendarControlMonthButtonBlock">
      <button type="button" class="calendarControlMonthButton calendarControlMonthButtonPrev">Previous</button>
      <button type="button" class="calendarControlMonthButton calendarControlMonthButtonNext">Next</button>
    </div>
  </div>`
  },
  getLoginElementsHTML: (errorMsg = '') => {
    return `<div class="userAcctControl">
    <div class="userAcctControlMessage">${errorMsg}</div>
    <div class="userAcctControlFormBlock">
      <form method="POST">
        <input type="text" autocomplete="username" class="userAcctControlInput userAcctControlInputUsername" placeholder="Username..."/>
        <input type="password" autocomplete="current-password" class="userAcctControlInput userAcctControlInputPassword" placeholder="Password..."/>
      </form>
    </div>
    <div class="userAcctControlButtonBlock">
      <button type="button" class="userAcctControlButton userAcctControlButtonLogin">Login</button>
      <button type="button" class="userAcctControlButton userAcctControlButtonSignup">Sign Up</button>
    </div>
  </div>`
  },
  getUserAcctControlHTML: username => {
    return `<div class="userAcctControl">
    <div class="userAcctControlMessage">Welcome, ${username}</div>
    <div class="userAcctControlButtonBlock">
      <button type="button" class="userAcctControlButton userAcctControlButtonLogout">Logout</button>
    </div>
  </div>`
  },
  getEventHTML: eventObject => {
    const { id, title, content, startHr, startMin, endHr, endMin, tag } = eventObject
    const nts = num => stringUtils.numberToString(num, 2)
    const timeMark = `${nts(startHr)}:${nts(startMin)} - ${nts(endHr)}:${nts(endMin)}`

    return `<div class="calendarEvent" id="event-id-${id}">
    <div class="calendarEventTag calendarEventTag${tag}">&nbsp;</div>
    <div class="calendarEventTime">${timeMark}</div>
    <div class="calendarEventCtrl">
      <button type="button" class="calendarEventCtrlButton calendarEventCtrlButtonEdit" id="event-editButton-event-id-${id}">Edit</button>
      <button type="button" class="calendarEventCtrlButton calendarEventCtrlButtonDelete" id="event-deleteButton-event-id-${id}">Delete</button>
    </div>
    <div class="calendarEventContentContainer">
      <div class="calendarEventHeader">${title}</div>
      <div class="calendarEventTime">${timeMark}</div>
      <div class="calendarEventContent">${content}</div>
      <div class="calendarEventAddr"></div>
    </div>
  </div>`
  },
  getScheduleEventHTML: eventObject => {
    const { id, title, content, month, day, startHr, startMin, endHr, endMin, tag } = eventObject
    const nts = num => stringUtils.numberToString(num, 2)
    const timeMark = `${nts(startHr)}:${nts(startMin)} - ${nts(endHr)}:${nts(endMin)}`

    return `<div class="calendarScheduleEvent" id="schedule-event-id-${id}">
    <div class="calendarScheduleEventTag calendarScheduleEventTag${tag}">&nbsp;</div>
    <div class="calendarScheduleEventDate">${month}/${day}</div>
    <div class="calendarScheduleEventTime">${timeMark}</div>
    <div class="calendarScheduleEventContentContainer">
      <div class="calendarScheduleEventHeader">${title}</div>
      <div class="calendarScheduleEventTime">${timeMark}</div>
      <div class="calendarScheduleEventContent">${content}</div>
    </div>
  </div>`
  },
  getEventFormHTML: () => {
    const tags = ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
    const tagSelector = `<select class="calendarEventFormTagSelect" id="calendarEventFormTagSelect">
    <option value="NULL"></option>
    ${tags.map(t => `<option value="${t}">${t}</option>`).join('')}
  </select>`

    return `<div class="calendarEventFormBlock">
    <form class="calendarEventForm">
      <div class="calendarEventFormTitleBlock">
        <label class="calendarEventFormTitleInputLabel" for="calendarEventFormTitleInput">Title</label>
        <input type="text" class="calendarEventFormTitleInput" id="calendarEventFormTitleInput" />
      </div>
      <div class="calendarEventFormDatetimeBlock">
        <label class="calendarEventFormDateInputLabel" for="calendarEventFormDateInput">Date</label>
        <input type="date" class="calendarEventFormDateInput" id="calendarEventFormDateInput" />
        <label class="calendarEventFormTimeInputLabel" for="calendarEventFormTimeInputFrom">From</label>
        <input type="time" class="calendarEventFormTimeInput calendarEventFormTimeInputFrom" id="calendarEventFormTimeInputFrom" />
        <label class="calendarEventFormTimeInputLabel" for="calendarEventFormTimeInputTo">To</label>
        <input type="time" class="calendarEventFormTimeInput calendarEventFormTimeInputTo" id="calendarEventFormTimeInputTo" />
        <label class="calendarEventFormTagSelectLabel" for="calendarEventFormTagSelect">Tag</label>
        ${tagSelector}
        <label class="calendarEventFormCadenceInputLabel" for="calendarEventFormCadenceInput">Repeat Every ? Days</label>
        <input type="number" min="0" max="10" step="1" class="calendarEventFormCadenceInput" id="calendarEventFormCadenceInput" />
        <label class="calendarEventFormRepeatInputLabel" for="calendarEventFormRepeatInput">Repeat For ? Times</label>
        <input type="number" min="0" max="10" step="1" class="calendarEventFormRepeatInput" id="calendarEventFormRepeatInput" />
      </div>
      <div class="calendarEventFormContentBlock">
        <textarea class="calendarEventFormContentInput" placeholder="Event Content..."></textarea>
      </div>
      <div class="calendarEventFormMapBlock"></div>
      <div class="calendarEventFormMapCtrlBlock">
        <button type="button" class="calendarEventFormMapCtrlButton">Reset Location</button>
      </div>
      <div class="calendarEventFormButtonBlock">
        <button type="button" class="calendarEventFormButton calendarEventFormButtonSubmit">Submit</button>
        <button type="button" class="calendarEventFormButton calendarEventFormButtonCancel">Cancel</button>
      </div>
    </form>
  </div>`
  },
  getFrameworkHTML: () => {
    return `<div class="framework">
    <div class="frameworkHeader">Calendar Service</div>
    <div class="frameworkBody">
      <div class="frameworkBodySection frameworkBodySectionLeft"></div><div class="frameworkBodySection frameworkBodySectionRight">
        <div class="frameworkMainBlock">
          <div class="frameworkMainHeader"></div>
          <div class="frameworkMainBody">
            <div class="frameworkMainContent calendarHeaderContainer"></div>
            <div class="frameworkMainContent calendarContainer"></div>
            <div class="frameworkMainContent calendarScheduleContainer" hidden></div>
            <div class="frameworkMainContent calendarFormContainer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>`
  }
}