import React from 'react';
import PropTypes from 'prop-types';
import './styles/AdminToolbar.scss';

const AdminToolbar = ({ setPage }) => (
  <div className="container-fluid pb-3 mb-3 admin-toolbar">
    <div className="row mt-3">
      <div className="col-auto">
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={() => setPage('users', { addUser: true })}
        >
          Add User
        </button>
      </div>
      <div className="col-auto">
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={() => setPage('interestForm')}
        >
          Interest Form
        </button>
      </div>
    </div>
  </div>
);

AdminToolbar.propTypes = {
  setPage: PropTypes.func.isRequired
};

export default AdminToolbar;
