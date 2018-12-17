import React, { Component } from 'react';
// import './app.scss';
import cookie from 'react-cookies';
import axios from 'axios';
// Main pages
import Landing from './pages/Landing';
import Users from './pages/Users';
import Dashboard from './pages/Dashboard';
import RoboticsInterestForm from './pages/RoboticsInterestForm';
import Subteams from './pages/Subteams';
import MemberInfo from './pages/MemberInfo';
import Meetings from './pages/Meetings';
import Attendance from './pages/Attendance';
import MemberUpload from './pages/MemberUpload';
import Account from './pages/Account';
// Components
import Nav from './components/Nav';
import Sidemenu from './helpers/stateless/Sidemenu';

import { UserContext, defaultUser } from './UserContext';
import AlertBox from './helpers/stateless/AlertBox';
import TeamMembers from './pages/TeamMembers';
import NavContext from './NavContext';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      sessionId: cookie.load('sessionId'),
      userContext: defaultUser,
      navContext: {
        page: 'landing',
        setPage: this.setPage,
        showSideMenu: true,
        props: {}
      },
      showSideMenu: true
    };

    const { sessionId } = this.state;
    if (sessionId) {
      axios.get(`/api/v1/sessions/${sessionId}`).then(
        (response) => {
          this.setUser(response.data.userId);
        },
        () => {
          this.setErrorMessage('An unexpected error has occured. You have been logged out.');
          this.setPage('landing');
        }
      );
    }

    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.logout = this.logout.bind(this);
    this.toggleSideMenu = this.toggleSideMenu.bind(this);
    this.setPage = this.setPage.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.getShowSideMenu = this.getShowSideMenu.bind(this);
  }

  componentDidMount() {
    const { userContext } = this.state;
    this.setState({ userContext: { ...userContext, updateUser: this.updateUser } });
    const page = cookie.load('page');
    if (page) this.setPage(page);
  }

  getShowSideMenu() {
    const { showSideMenu } = this.state;
    return showSideMenu;
  }

  setUser(userId) {
    axios.get(`/api/v1/users/${userId}`).then((response) => {
      const { userContext } = this.state;
      this.setState({ userContext: { ...userContext, user: response.data } });
    });
  }

  setPage(page, props) {
    const { navContext } = this.state;
    cookie.save('page', page, { path: '/' });
    this.setState({
      navContext: {
        ...navContext,
        page,
        props,
        setPage: this.setPage
      }
    });
    // if (toggleSidemenu) this.toggleSideMenu();
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
    this.setState({ userContext: undefined, sessionId: undefined });
    cookie.remove('sessionId');
    window.location.reload();
  }

  toggleSideMenu() {
    const { showSideMenu, navContext } = this.state;
    this.setState({
      showSideMenu: !showSideMenu,
      navContext: { ...navContext, showSideMenu: !showSideMenu }
    });
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
      user, showSideMenu, navContext, userContext, errors
    } = this.state;
    let visiblePage = null;

    if (navContext.page === 'attendance' && !navContext.props) navContext.page = 'meetings';
    if (navContext.page === 'memberInfo' && !navContext.props) navContext.page = 'teamMembers';

    // console.log(navContext.props);

    switch (navContext.page) {
      case 'users':
        visiblePage = <Users user={user} {...navContext.props} />;
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
      case 'memberInfo':
        visiblePage = <MemberInfo {...navContext.props} />;
        break;
      case 'meetings':
        visiblePage = <Meetings {...navContext.props} />;
        break;
      case 'attendance':
        visiblePage = <Attendance {...navContext.props} />;
        break;
      case 'memberUpload':
        visiblePage = <MemberUpload {...navContext.props} />;
        break;
      case 'account':
        visiblePage = (
          <Account user={userContext.user} setPage={this.setPage} {...navContext.props} />
        );
        break;
      default:
        visiblePage = <Landing teamNum={5546} setPage={this.setPage} {...navContext.props} />;
    }

    return (
      <UserContext.Provider value={userContext}>
        <NavContext.Provider value={navContext}>
          {userContext.user._id ? (
            <React.Fragment>
              <Nav
                login={this.login}
                signup={this.signup}
                toggleSideMenu={this.toggleSideMenu}
                showSideMenu={showSideMenu}
              />
              <AlertBox
                condition={errors}
                message={`${(errors && errors.message) || ''}\n${(errors && errors.username)
                  || ''}\n${(errors && errors.password) || ''}`}
                close={() => this.setState({ errors: undefined })}
                type="danger"
              />
              {visiblePage}
              {showSideMenu ? (
                <Sidemenu
                  logout={this.logout}
                  isAdmin={this.isAdmin()}
                  setPage={this.setPage}
                  links={[
                    {
                      name: 'Dashboard',
                      icon: 'tachometer-alt',
                      requiresAdmin: true
                    },
                    {
                      name: 'Users',
                      icon: 'users',
                      requiresAdmin: true,
                      subItems: [
                        {
                          name: 'Internal Users',
                          pageName: 'users'
                        },
                        {
                          name: 'Team Members'
                        }
                      ]
                    },
                    {
                      name: 'Interest Form',
                      icon: 'address-book',
                      requiresAdmin: true
                    },
                    {
                      name: 'Sub Teams',
                      icon: 'list-ul',
                      requiresAdmin: true
                    },
                    {
                      name: 'Meetings',
                      icon: 'calendar',
                      requiresAdmin: true
                    },
                    {
                      name: 'Account',
                      icon: 'user-circle'
                    }
                  ]}
                />
              ) : (
                <div />
              )}
            </React.Fragment>
          ) : (
            <Landing />
          )}
        </NavContext.Provider>
      </UserContext.Provider>
    );
  }
}
