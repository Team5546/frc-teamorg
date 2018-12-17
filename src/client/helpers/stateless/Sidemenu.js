import React from 'react';
import PropTypes from 'prop-types';
import camelcase from 'camelcase';
import '../styles/Sidemenu.scss';
import { UserContext } from '../../UserContext';

const Sidemenu = ({
  logout, setPage, isAdmin, links
}) => (
  <UserContext.Consumer>
    {({ user }) => (
      <div id="sidebar-collapse" className="col-sm-3 col-lg-2 sidebar">
        <div className="profile-sidebar">
          <div className="profile-userpic">
            <img
              src={
                user.image
                || 'https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg'
              }
              className="img-responsive"
              alt=""
            />
          </div>
          <div className="profile-usertitle">
            <div className="profile-usertitle-name">
              {`${user.firstName} ${user.lastName}`}
            </div>
            <div className="profile-usertitle-status">
              {user.username}
            </div>
          </div>
          <div className="clear" />
        </div>
        <div className="divider" />
        {/* <form role="search">
          <div className="form-group">
            <input type="text" className="form-control" placeholder="Search" />
          </div>
            </form> */}
        <ul className="nav menu">
          {links.map((link) => {
            if (!link.requiresAdmin || (link.requiresAdmin && isAdmin)) {
              if (link.subItems) {
                return (
                  <li key={link.name || link.pageName} className="parent ">
                    <a data-toggle="collapse" href={`#${link.name || link.pageName}`}>
                      <em className={`fa fa-${link.icon || 'ellipsis-v'}`}>
&nbsp;
                      </em>
                      {' '}
                      {link.displayName || link.pageName || link.name}
                      {' '}
                      <span
                        data-toggle="collapse"
                        href={`#${link.name || link.pageName}`}
                        className="icon pull-right"
                      >
                        <em className="fa fa-plus" />
                      </span>
                    </a>
                    <ul className="children collapse" id={link.name || link.pageName}>
                      {link.subItems.map(subItem => (
                        <li key={subItem.name}>
                          <a
                            href="#"
                            onClick={() => setPage(subItem.pageName || camelcase(subItem.name), {}, true)
                            }
                          >
                            <span className="fa fa-arrow-right">
&nbsp;
                            </span>
                            {' '}
                            {subItem.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return (
                <li key={link.name || link.pageName}>
                  <a href="#" onClick={() => setPage(camelcase(link.name), {}, true)}>
                    <em className={`fa fa-${link.icon || 'ellipsis-v'}`}>
&nbsp;
                    </em>
                    {' '}
                    {link.name}
                  </a>
                </li>
              );
            }
            return <div key={link.name} />;
          })}
          <li>
            <a href="#" onClick={logout}>
              <em className="fa fa-power-off">
&nbsp;
              </em>
              Logout
            </a>
          </li>
        </ul>
      </div>
    )}
  </UserContext.Consumer>
);

Sidemenu.propTypes = {
  logout: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  links: PropTypes.array.isRequired
};

export default Sidemenu;
