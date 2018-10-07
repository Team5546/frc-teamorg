import React from 'react';
import PropTypes from 'prop-types';

const AdminToolbar = ({ setPage }) => (
  <div className="container-fluid">
    <div className="row mt-3">
      <div className="col">
        <button
          type="button"
          className="btn btn-outline-light"
          onClick={() => setPage('users', { addUser: true })}
        >
          Add User
        </button>
      </div>
    </div>
    <hr />
  </div>
);

AdminToolbar.propTypes = {
  setPage: PropTypes.func.isRequired
};

export default AdminToolbar;
