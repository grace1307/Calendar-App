class LoginControl extends BaseControl {
  constructor () {
    super()
    this.state = Object.assign({}, this.state, {
      isLoginSending: false,
      isLogoutSending: false,
      isSignupSending: false,
      isShowingUserAcct: false,
      message: '',
      username: ''
    })
    this.handleLoginResp = this.handleLoginResp.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogoutResp = this.handleLogoutResp.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleSignupResp = this.handleSignupResp.bind(this)
    this.handleSignup = this.handleSignup.bind(this)
    this.checkEtched = this.checkEtched.bind(this)
  }

  checkEtched () {
    const etchedUsername = elementUtils.getElement('.credUsername').textContent
    const etchedToken = elementUtils.getElement('.credToken').textContent

    if (etchedUsername && etchedToken) {
      this.setState({ username: etchedUsername })
      this.handleLoginResp({
        isSuccessful: true,
        token: etchedToken
      })
    }
  }

  handleLoginResp (resp) {
    const { username } = this.state
    const { isSuccessful, token } = resp
    const { onLoginAttempt } = this.property

    this.setState({ isLoginSending: false })

    if (isSuccessful && token) {
      storeUtils.setStore('user', {
        isLogin: true,
        token,
        username
      })
      this.setState({
        message: '',
        isShowingUserAcct: true,
        username
      })
      onLoginAttempt()
    } else {
      this.setState({
        message: 'Username and Password does not match',
        username: '',
        isShowingUserAcct: false
      })
    }
    this.refresh()
  }

  handleLogin () {
    const { isLoginSending, isSignupSending } = this.state
    const usernameAttempt = elementUtils.getElement('.userAcctControlInputUsername').value
    const passwordAttempt = elementUtils.getElement('.userAcctControlInputPassword').value

    if (usernameAttempt && passwordAttempt && !storeUtils.getStore('user').isLogin && !isLoginSending && !isSignupSending) {
      this.setState({ username: usernameAttempt, isLoginSending: true })

      const data = {
        username: usernameAttempt,
        password: passwordAttempt
      }

      requestUtils.post(endpoints.login, data, this.handleLoginResp)
    }
  }

  handleLogoutResp (resp) {
    const { isSuccessful } = resp
    const { onLoginAttempt } = this.property

    if (isSuccessful) {
      this.setState({
        isLogoutSending: false,
        isShowingUserAcct: false,
        username: ''
      })
      storeUtils.setStore('user', {
        isLogin: false,
        token: '',
        username: ''
      })
      onLoginAttempt()
    } else {
      this.setState({ isLogoutSending: false })
    }

    this.refresh()
  }

  handleLogout () {
    const { isShowingUserAcct, isLogoutSending } = this.state

    if (isShowingUserAcct && !isLogoutSending) {
      this.setState({ isLogoutSending: true })

      const data = { token: storeUtils.getStore('user').token }

      requestUtils.post(endpoints.logout, data, this.handleLogoutResp)
    }
  }

  handleSignupResp (resp) {
    const { isSuccessful } = resp

    this.setState({ isSignupSending: false })

    if (isSuccessful) {
      this.setState({ message: 'Signup successful, please login with your credentials' })
    } else {
      this.setState({ message: 'We cannot sign you up with this credentials at the moment, please try again' })
    }

    this.refresh()
  }

  handleSignup () {
    const { isLoginSending, isSignupSending } = this.state
    const usernameAttempt = elementUtils.getElement('.userAcctControlInputUsername').value
    const passwordAttempt = elementUtils.getElement('.userAcctControlInputPassword').value

    if (usernameAttempt && passwordAttempt && !storeUtils.getStore('user').isLogin && !isLoginSending && !isSignupSending) {
      this.setState({ isSignupSending: true })

      const data = {
        username: usernameAttempt,
        password: passwordAttempt
      }

      requestUtils.post(endpoints.signup, data, this.handleSignupResp)
    }
  }

  render () {
    const { message, username } = this.state

    if (!storeUtils.getStore('user').isLogin) {
      this.setState({
        html: templates.getLoginElementsHTML(message)
      })
    } else {
      this.setState({
        html: templates.getUserAcctControlHTML(username)
      })
    }
  }

  bindHandlers () {
    this.setHandler('.userAcctControlButtonLogin', 'click', this.handleLogin)
    this.setHandler('.userAcctControlButtonSignup', 'click', this.handleSignup)
    this.setHandler('.userAcctControlButtonLogout', 'click', this.handleLogout)
  }
}