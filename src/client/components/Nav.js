import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import './styles/Nav.scss';

export default class Nav extends Component {
  render() {
    const { toggleSideMenu, showSideMenu } = this.props;
    return (
      <nav
        className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top"
        role="navigation"
      >
        <a role="button" className="navbar-brand mr-auto">
          <span style={{ color: 'white' }}>
            <img
              src="http://argsrobotics.com/wp-content/uploads/2018/07/art.png"
              height="40"
              alt="Logo"
            />
            <span style={{ top: 15, position: 'absolute' }}>&nbsp; 5546 TEAM ORG</span>
          </span>
        </a>
        <button className="navbar-toggler" type="button" onClick={toggleSideMenu}>
          <span className="navbar-toggler-icon" />
        </button>

        <ul className="nav navbar-top-links navbar-left d-none d-lg-block">
          <li className="dropdown">
            <button
              type="button"
              className={`btn btn-${showSideMenu ? 'primary' : 'light'}`}
              href="#"
              onClick={toggleSideMenu}
            >
              <em className={`fa fa-toggle-${showSideMenu ? 'on' : 'off'}`} />
              {`Sidemenu ${showSideMenu ? 'On' : 'Off'}`}
            </button>
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
      </nav>
    );
  }
}

Nav.propTypes = {
  showSideMenu: PropTypes.bool.isRequired,
  toggleSideMenu: PropTypes.func.isRequired
};
