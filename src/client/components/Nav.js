import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import './styles/Nav.scss';

export default class Nav extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: ''
    };

    this.toggleLogin = this.toggleLogin.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  toggleLogin(type) {
    const { showLogin } = this.state;
    this.setState({ showLogin: !showLogin, loginType: type });
  }

  handleInput(key, event) {
    const object = {};
    object[key] = event.target.value;
    this.setState(object);
  }

  render() {
    const {
      login, signup, toggleSideMenu, showSideMenu
    } = this.props;
    const { loginType, showLogin } = this.state;
    return (
      <nav className="navbar navbar-custom navbar-fixed-top" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#sidebar-collapse"
            >
              <span className="sr-only">
Toggle navigation
              </span>
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </button>
            <a role="button" className="navbar-brand" style={{ paddingTop: 10 }}>
              <span style={{ color: 'white' }}>
                <img src="/public/logo.png" height="40" alt="Logo" />
                &nbsp; 5546 TEAM ORG
              </span>
            </a>
            <ul className="nav navbar-top-links navbar-left">
              <li className="dropdown">
                <a
                  className={`btn btn-sm btn-${showSideMenu ? 'primary' : 'default'}`}
                  href="#"
                  onClick={toggleSideMenu}
                >
                  <em className={`fa fa-toggle-${showSideMenu ? 'on' : 'off'}`} />
                  {`Sidemenu ${showSideMenu ? 'On' : 'Off'}`}
                </a>
              </li>
            </ul>
            {/* <ul className="nav navbar-top-links navbar-right">
              <li className="dropdown">
                <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                  <em className="fa fa-envelope" />
                  <span className="label label-danger">
15
                  </span>
                </a>
                <ul className="dropdown-menu dropdown-messages">
                  <li>
                    <div className="dropdown-messages-box">
                      <a href="profile.html" className="pull-left">
                        <img
                          alt="image"
                          className="img-circle"
                          src="http://placehold.it/40/30a5ff/fff"
                        />
                        >
                      </a>
                      <div className="message-body">
                        <small className="pull-right">
3 mins ago
                        </small>
                        <a href="#">
                          <strong>
John Doe
                          </strong>
                          {' '}
commented on
                          <strong>
your photo
                          </strong>
.
                        </a>
                        <br />
                        <small className="text-muted">
1:24 pm - 25/03/2015
                        </small>
                      </div>
                    </div>
                  </li>
                  <li className="divider" />
                  <li>
                    <div className="dropdown-messages-box">
                      <a href="profile.html" className="pull-left">
                        <img
                          alt="image"
                          className="img-circle"
                          src="http://placehold.it/40/30a5ff/fff"
                        />
                        >
                      </a>
                      <div className="message-body">
                        <small className="pull-right">
1 hour ago
                        </small>
                        <a href="#">
                          New message from
                          {' '}
                          <strong>
Jane Doe
                          </strong>
.
                        </a>
                        <br />
                        <small className="text-muted">
12:27 pm - 25/03/2015
                        </small>
                      </div>
                    </div>
                  </li>
                  <li className="divider" />
                  <li>
                    <div className="all-button">
                      <a href="#">
                        <em className="fa fa-inbox" />
                        {' '}
                        <strong>
All Messages
                        </strong>
                      </a>
                    </div>
                  </li>
                </ul>
              </li>
              <li className="dropdown">
                <a className="dropdown-toggle count-info" data-toggle="dropdown" href="#">
                  <em className="fa fa-bell" />
                  <span className="label label-info">
5
                  </span>
                </a>
                <ul className="dropdown-menu dropdown-alerts">
                  <li>
                    <a href="#">
                      <div>
                        <em className="fa fa-envelope" />
                        {' '}
1 New Message
                        <span className="pull-right text-muted small">
3 mins ago
                        </span>
                      </div>
                    </a>
                  </li>
                  <li className="divider" />
                  <li>
                    <a href="#">
                      <div>
                        <em className="fa fa-heart" />
                        {' '}
12 New Likes
                        <span className="pull-right text-muted small">
4 mins ago
                        </span>
                      </div>
                    </a>
                  </li>
                  <li className="divider" />
                  <li>
                    <a href="#">
                      <div>
                        <em className="fa fa-user" />
                        {' '}
5 New Followers
                        <span className="pull-right text-muted small">
4 mins ago
                        </span>
                      </div>
                    </a>
                  </li>
                </ul>
              </li>
    </ul> */}
          </div>
        </div>
      </nav>
    );
  }
}

Nav.propTypes = {
  login: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
  toggleSideMenu: PropTypes.func.isRequired
};
