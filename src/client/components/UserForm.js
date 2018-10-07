/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../UserContext';

const UserForm = ({
  selectedUser,
  submitEdit,
  handleUserChange,
  handleCheckboxChange,
  duplicateUsername,
  cancel,
  editing,
  signup
}) => (
  <UserContext.Consumer>
    {({ user, updateUser }) => (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (editing) submitEdit(user, updateUser);
          else signup(user);
        }}
        className="form"
      >
        <h4>
          <i
            className={`fa ${selectedUser.isAdmin ? 'fa-toolbox' : 'fa-user'} ${
              selectedUser.isActive ? 'active' : 'inactive'
            }`}
          />
          {editing
            ? ` - Editing User ${selectedUser.firstName} ${selectedUser.lastName}`
            : ` - New ${selectedUser.isAdmin ? 'Admin' : 'Standard'} User`}
        </h4>
        {editing && (
          <div className="form-group">
            <label htmlFor="id">
ID
            </label>
            <input
              type="text"
              className="form-control"
              id="id"
              aria-describedby="Id"
              placeholder="Id"
              value={selectedUser._id}
              readOnly
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="username">
Username
          </label>
          <input
            type="text"
            className={`form-control ${
              selectedUser.username && !duplicateUsername ? 'is-valid' : 'is-invalid'
            }`}
            id="username"
            aria-describedby="Username"
            placeholder="Username"
            value={selectedUser.username || ''}
            onChange={handleUserChange}
            required
          />
          <div className="invalid-feedback">
This Username Is Taken.
          </div>
          <div className="valid-feedback">
This Username Is Free To Use!
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="firstName">
First Name
          </label>
          <input
            type="text"
            className={`form-control ${selectedUser.firstName ? 'is-valid' : 'is-invalid'}`}
            id="firstName"
            placeholder="First Name"
            value={selectedUser.firstName || ''}
            onChange={handleUserChange}
            required
          />
          <div className="invalid-feedback">
Please provide a first name.
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="lastName">
Last Name
          </label>
          <input
            type="text"
            className={`form-control ${selectedUser.lastName ? 'is-valid' : 'is-invalid'}`}
            id="lastName"
            placeholder="Last Name"
            value={selectedUser.lastName || ''}
            onChange={handleUserChange}
            required
          />
          <div className="invalid-feedback">
Please provide a last name.
          </div>
        </div>
        {!editing && (
          <div className="form-group">
            <label htmlFor="password">
Password
            </label>
            <input
              type="password"
              className={`form-control ${
                selectedUser.password && selectedUser.password.length >= 8
                  ? 'is-valid'
                  : 'is-invalid'
              }`}
              id="password"
              placeholder="Password"
              value={selectedUser.password || ''}
              onChange={handleUserChange}
              required
            />
            <div className="invalid-feedback">
Password must be at least 8 characters.
            </div>
          </div>
        )}
        <div className="form-group row">
          <div className="col">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedUser.isActive || false}
                onChange={handleCheckboxChange}
                id="isActive"
              />
              <label className="form-check-label" htmlFor="isActive">
                Is Active?
              </label>
            </div>
          </div>
          <div className="col">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedUser.isAdmin || false}
                onChange={handleCheckboxChange}
                id="isAdmin"
              />
              <label className="form-check-label" htmlFor="isAdmin">
                Is Admin?
              </label>
            </div>
          </div>
        </div>
        <div className="btn-group full-width" role="group" aria-label="Basic example">
          <button type="submit" className="btn btn-outline-success">
            Submit
          </button>
          <button type="button" className="btn btn-outline-danger" onClick={cancel}>
            Cancel
          </button>
        </div>
      </form>
    )}
  </UserContext.Consumer>
);

UserForm.defaultProps = {
  selectedUser: {},
  editing: false
};

UserForm.propTypes = {
  selectedUser: PropTypes.object,
  submitEdit: PropTypes.func.isRequired,
  handleUserChange: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  duplicateUsername: PropTypes.bool.isRequired,
  cancel: PropTypes.func.isRequired,
  editing: PropTypes.bool,
  signup: PropTypes.func.isRequired
};

export default UserForm;
