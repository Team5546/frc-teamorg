import React, { Component } from 'react';
import './app.scss';
import cookie from 'react-cookies';
import axios from 'axios';
// Main pages
import Home from './pages/Home';
import Landing from './pages/Landing';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import RoboticsInterestForm from './pages/RoboticsInterestForm';
// Components
import Nav from './components/Nav';
import Sidemenu from './helpers/stateless/Sidemenu';
import AdminToolbar from './components/AdminToolbar';

import { UserContext, defaultUser } from './UserContext';
import AlertBox from './helpers/stateless/AlertBox';
import TeamMembers from './pages/TeamMembers';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      sessionId: cookie.load('sessionId'),
      currentPage: {},
      prevPages: [],
      userContext: defaultUser
    };

    const { sessionId } = this.state;
    if (sessionId) {
      axios.get(`/api/v1/sessions/${sessionId}`).then(
        (response) => {
          this.setUser(response.data.userId);
          this.setPage('home');
        },
        () => {
          this.setErrorMessage('An unexpected error has occured. You have been logged out.');
        }
      );
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

  setPage(page, props, toggleSidemenu, goingBack) {
    const { currentPage, prevPages } = this.state;
    if (!goingBack) prevPages.push(currentPage);
    this.setState({ prevPages, currentPage: { name: page, props } });
    if (toggleSidemenu) this.toggleSideMenu();
  }

  setErrorMessage(message) {
    this.setState({ errors: { message } });
  }

  login(event, state) {
    this.setState({ errors: undefined });
    event.preventDefault();
    axios
      .post('/api/v1/accounts/login', {
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
          this.setState({ errors: { message: 'An unexpected error occured' } });
          this.setState({ errors: { ...err.response.data.errors } });
        }
      );
  }

  signup(event, state) {
    this.setState({ errors: undefined });
    event.preventDefault();
    axios
      .post('/api/v1/accounts/signup', {
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
      user, showSideMenu, currentPage, userContext, errors, prevPages
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
      case 'interestForm':
        visiblePage = <RoboticsInterestForm {...currentPage.props} />;
        break;
      case 'teamMembers':
        visiblePage = <TeamMembers {...currentPage.props} />;
        break;
      default:
        visiblePage = <Landing teamNum={5546} setPage={this.setPage} {...currentPage.props} />;
    }
    return (
      <UserContext.Provider value={userContext}>
        <div className="container-fluid">
          <div className="row">
            <div className={`col${!currentPage.name || currentPage.name === '' ? ' p-0' : ''}`}>
              <Nav login={this.login} signup={this.signup} toggleSideMenu={this.toggleSideMenu} />
              {this.isAdmin() && <AdminToolbar setPage={this.setPage} />}
              {currentPage.name
                && currentPage.name !== 'landing'
                && currentPage.name !== 'home' && (
                  <React.Fragment>
                    <div className="container-fluid my-2">
                      <div className="row">
                        <div className="col-auto">
                          <button
                            type="button"
                            onClick={() => {
                              const tempPrevPages = prevPages;
                              const lastPage = tempPrevPages.pop();
                              this.setState({ prevPages: tempPrevPages });
                              this.setPage(lastPage.name, lastPage.props, undefined, true);
                            }}
                            className="btn btn-outline-primary"
                          >
                            <i className="fa fa-chevron-circle-left" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
              )}
              <AlertBox
                condition={errors}
                message={`${(errors && errors.message) || ''}\n${(errors && errors.username)
                  || ''}\n${(errors && errors.password) || ''}`}
                close={() => this.setState({ errors: undefined })}
                type="danger"
              />
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
                    displayName: 'Home',
                    requiresAdmin: false
                  },
                  {
                    pageName: 'users',
                    displayName: 'Users',
                    requiresAdmin: true
                  },
                  {
                    pageName: 'dashboard',
                    displayName: 'Dashboard',
                    requiresAdmin: true
                  },
                  {
                    pageName: 'interestForm',
                    displayName: 'Interest Form',
                    requiresAdmin: true
                  },
                  {
                    pageName: 'teamMembers',
                    displayName: 'Team Members',
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
