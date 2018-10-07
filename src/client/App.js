import React, { Component } from 'react';
import './app.scss';
import cookie from 'react-cookies';
import axios from 'axios';
// Main pages
import Home from './pages/Home';
import Landing from './pages/Landing';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
// Components
import Nav from './components/Nav';
import Sidemenu from './helpers/stateless/Sidemenu';
import AdminToolbar from './components/AdminToolbar';

import { UserContext, defaultUser } from './UserContext';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      sessionId: cookie.load('sessionId'),
      currentPage: '',
      userContext: defaultUser
    };

    const { sessionId } = this.state;
    if (sessionId) {
      axios.get(`/api/v1/sessions/${sessionId}`).then((response) => {
        this.setUser(response.data.userId);
        this.setPage('home');
      });
    }

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
    this.setPage = this.setPage.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    const { userContext } = this.state;
    this.setState({ userContext: { ...userContext, updateUser: this.updateUser } });
  }

  setUser(userId) {
    axios.get(`/api/v1/users/${userId}`).then((response) => {
      const { userContext } = this.state;
      this.setState({ userContext: { ...userContext, user: response.data } });
    });
  }

  setPage(page, props, toggleSidemenu) {
    this.setState({ currentPage: { name: page, props } });
    if (toggleSidemenu) this.toggleSideMenu();
  }

  login(event, state) {
    this.setState({ errors: undefined });
    event.preventDefault();
    axios
      .post('/api/v1/login', {
        username: state.username,
        password: state.password
      })
      .then(
        (response) => {
          cookie.save('sessionId', response.data.sessionId, { path: '/' });
          this.setUser(response.data.userId);
          this.setPage('home');
        },
        (err) => {
          this.setState({ errors: { ...err.response.data.errors } });
        }
      );
  }

  signup(event, state) {
    this.setState({ errors: undefined });
    event.preventDefault();
    axios
      .post('/api/v1/signup', {
        username: state.username,
        password: state.password,
        firstName: state.firstName,
        lastName: state.lastName,
        createdAt: new Date()
      })
      .then(
        (response) => {
          cookie.save('sessionId', response.data.sessionId, { path: '/' });
          this.setUser(response.data.userId);
          this.setState({ currentPage: { name: 'home', props: {} } });
          this.forceUpdate();
        },
        (err) => {
          console.error(err);
          this.setState({ errors: err.response.data.errors });
        }
      );
  }

  logout() {
    this.setState({ user: undefined, sessionId: undefined });
    cookie.remove('sessionId');
    window.location.reload();
  }

  toggleSideMenu() {
    const { showSideMenu } = this.state;
    this.setState({ showSideMenu: !showSideMenu });
  }

  isAdmin() {
    const { userContext } = this.state;
    const { user } = userContext;
    if (!user) return false;
    return user.isAdmin === true;
  }

  updateUser(user) {
    const { userContext } = this.state;
    this.setState({ userContext: { ...userContext, user: { ...user } } });
  }

  render() {
    const {
      user, showSideMenu, currentPage, userContext, errors
    } = this.state;
    let visiblePage = null;
    switch (currentPage.name) {
      case 'users':
        visiblePage = <Users user={user} {...currentPage.props} />;
        break;
      case 'home':
        visiblePage = <Home {...currentPage.props} />;
        break;
      case 'dashboard':
        visiblePage = <Dashboard {...currentPage.props} />;
        break;
      default:
        visiblePage = <Landing teamNum={5546} {...currentPage.props} />;
    }
    return (
      <UserContext.Provider value={userContext}>
        <div className="container-fluid">
          <div className="row">
            <div className={`col ${currentPage === '' ? 'p-0' : ''}`}>
              <Nav login={this.login} signup={this.signup} toggleSideMenu={this.toggleSideMenu} />
              {this.isAdmin() && <AdminToolbar setPage={this.setPage} />}
              {errors && (
                <div className="alert alert-warning alert-dismissible fade show mb-0" role="alert">
                  {errors.message}
                  {errors.username}
                  {errors.password}
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={() => this.setState({ errors: undefined })}
                  >
                    <span aria-hidden="true">
&times;
                    </span>
                  </button>
                </div>
              )}
              {visiblePage}
            </div>
            {showSideMenu ? (
              <Sidemenu
                logout={this.logout}
                isAdmin={this.isAdmin()}
                setPage={this.setPage}
                links={[
                  {
                    pageName: 'home',
                    requiresAdmin: false
                  },
                  {
                    pageName: 'users',
                    requiresAdmin: true
                  },
                  {
                    pageName: 'dashboard',
                    requiresAdmin: true
                  }
                ]}
              />
            ) : (
              <div />
            )}
          </div>
        </div>
      </UserContext.Provider>
    );
  }
}
