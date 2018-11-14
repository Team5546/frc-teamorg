import React from 'react';
import PropTypes from 'prop-types';
import camelcase from 'camelcase';
import '../styles/Sidemenu.scss';

const Sidemenu = ({
  logout, setPage, isAdmin, links
}) => (
  <div className="col-2 sidemenu">
    <ul className="list-unstyled">
      {links.map((link) => {
        if (!link.requiresAdmin || (link.requiresAdmin && isAdmin)) {
          return (
            <li key={link.name || link.pageName}>
              <button
                type="button"
                className="btn btn-block btn-link"
                onClick={() => setPage(link.pageName || camelcase(link.name), {}, true)}
              >
                {link.displayName || link.pageName || link.name}
              </button>
            </li>
          );
        }
        return <div key={link.pageName} />;
      })}
      <li>
        <button type="button" className="btn btn-link btn-block" onClick={logout}>
          Signout
        </button>
      </li>
    </ul>
  </div>
);

Sidemenu.propTypes = {
  logout: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  links: PropTypes.array.isRequired
};

export default Sidemenu;
