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
import Subteams from './pages/Subteams';
// Components
import Nav from './components/Nav';
import Sidemenu from './helpers/stateless/Sidemenu';
import AdminToolbar from './components/AdminToolbar';

import { UserContext, defaultUser } from './UserContext';
import AlertBox from './helpers/stateless/AlertBox';
import TeamMembers from './pages/TeamMembers';
import NavContext from './NavContext';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      sessionId: cookie.load('sessionId'),
      prevPages: [],
      userContext: defaultUser,
      navContext: {
        page: 'landing',
        setPage: this.setPage,
        props: {}
      }
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
    const { prevPages, navContext } = this.state;
    let tempPrevPages = prevPages;
    if (
      prevPages.length === 0
      || (!goingBack
        && navContext.page !== prevPages[prevPages.length - 1].name
        && page !== navContext.page)
    ) {
      tempPrevPages.push(Object.keys(navContext).length === 0 ? { page, props } : navContext);
    }
    if (page === 'home') tempPrevPages = [];
    this.setState({
      prevPages: tempPrevPages,
      navContext: {
        page,
        props,
        setPage: this.setPage
      }
    });
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
          this.setPage('home');
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
      user, showSideMenu, navContext, userContext, errors, prevPages
    } = this.state;
    let visiblePage = null;
    switch (navContext.page) {
      case 'users':
        visiblePage = <Users user={user} {...navContext.props} />;
        break;
      case 'home':
        visiblePage = <Home {...navContext.props} />;
        break;
      case 'dashboard':
        visiblePage = <Dashboard {...navContext.props} />;
        break;
      case 'interestForm':
        visiblePage = <RoboticsInterestForm {...navContext.props} />;
        break;
      case 'teamMembers':
        visiblePage = <TeamMembers {...navContext.props} />;
        break;
      case 'subTeams':
        visiblePage = <Subteams {...navContext.props} />;
        break;
      default:
        visiblePage = <Landing teamNum={5546} setPage={this.setPage} {...navContext.props} />;
    }
    return (
      <UserContext.Provider value={userContext}>
        <NavContext.Provider value={navContext}>
          <div className="container-fluid">
            <div className="row">
              <div className={`col${!navContext.page || navContext.page === '' ? ' p-0' : ''}`}>
                <Nav login={this.login} signup={this.signup} toggleSideMenu={this.toggleSideMenu} />
                {this.isAdmin() && <AdminToolbar setPage={this.setPage} />}
                {navContext.name
                  && navContext.name !== 'landing'
                  && navContext.name !== 'home' && (
                    <React.Fragment>
                      <div className="container-fluid my-2">
                        <div className="row">
                          <div className="col-auto">
                            {prevPages.map((page, i) => (
                              <button
                                type="button"
                                className="btn btn-link btn-breadcrumb"
                                key={page.name + i}
                                onClick={() => {
                                  const tempPrevPages = prevPages;
                                  tempPrevPages.splice(i + 1);
                                  const lastPage = tempPrevPages[i];
                                  this.setState({ prevPages: tempPrevPages });
                                  this.setPage(lastPage.name, lastPage.props, undefined, true);
                                }}
                              >
                                {page.name}
                                {' '}
\
                              </button>
                            ))}
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
                      displayName: 'Home',
                      pageName: 'home',
                      requiresAdmin: false
                    },
                    {
                      displayName: 'Users',
                      pageName: 'users',
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
                    },
                    {
                      pageName: 'subTeams',
                      displayName: 'Sub Teams',
                      requiresAdmin: true
                    }
                  ]}
                />
              ) : (
                <div />
              )}
            </div>
          </div>
        </NavContext.Provider>
      </UserContext.Provider>
    );
  }
}
