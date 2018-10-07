import React from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../UserContext';

const UserList = ({
  users, selectUser, deleteUser, cancelDelete
}) => (
  <UserContext.Consumer>
    {({ user }) => (
      <table className="table users-table">
        <thead>
          <tr>
            <th scope="col" />
            <th scope="col">
Username
            </th>
            <th scope="col">
Name
            </th>
            <th scope="col">
Created At
            </th>
            <th scope="col">
Created By
            </th>
            <th scope="col">
Last Login
            </th>
            <th scope="col">
Last Modified
            </th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {users.map((_user, index) => (
            <tr key={`user${_user._id}`}>
              <td>
                <i
                  className={`fa ${_user.isAdmin ? 'fa-toolbox' : 'fa-user'} ${
                    _user.isActive ? 'active' : 'inactive'
                  }`}
                />
              </td>
              <td>
                {_user.username}
              </td>
              <td>
                {_user.firstName}
                {' '}
                {_user.lastName}
              </td>
              <td>
                {_user.createdAt
                  && `${new Date(_user.createdAt).toLocaleDateString()} ${new Date(
                    _user.createdAt
                  ).toLocaleTimeString()}`}
                {!_user.createdAt && 'Never'}
              </td>
              <td>
                {_user.createdBy || ''}
              </td>
              <td>
                {_user.lastLogin
                  && `${new Date(_user.lastLogin).toLocaleDateString()} ${new Date(
                    _user.lastLogin
                  ).toLocaleTimeString()}`}
                {!_user.lastLogin && 'Never'}
              </td>
              <td>
                {_user.lastModified
                  && `${new Date(_user.lastModified).toLocaleDateString()} ${new Date(
                    _user.lastModified
                  ).toLocaleTimeString()}`}
                {!_user.lastModified && 'Never'}
              </td>
              <td>
                {_user._id !== user._id && !_user.reallySure ? (
                  <div className="btn-group btn-group-sm" role="group" aria-label="User Actions">
                    <button
                      type="button"
                      className="btn btn-outline-warning"
                      title="Edit"
                      onClick={() => selectUser(_user)}
                    >
                      <i className="fa fa-pencil-alt" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      title="Delete"
                      onClick={() => deleteUser(index)}
                    >
                      <i className="fa fa-trash" />
                    </button>
                  </div>
                ) : (
                  <div className="btn-group btn-group-sm" role="group" aria-label="User Actions">
                    <button
                      type="button"
                      className={`btn btn-sm btn-outline-${
                        _user.reallySure ? 'danger' : 'warning'
                      }`}
                      title={`${_user.reallySure ? 'Are you sure?' : 'Edit'}`}
                      onClick={() => {
                        if (_user.reallySure) {
                          deleteUser(index);
                        } else {
                          selectUser(_user);
                        }
                      }}
                    >
                      {_user.reallySure ? (
                        <i className="fa fa-trash" />
                      ) : (
                        <i className="fa fa-pencil-alt" />
                      )}
                    </button>
                    {_user.reallySure && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light"
                        title="Cancel"
                        onClick={() => cancelDelete(index)}
                      >
                        <i className="fa fa-times" />
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </UserContext.Consumer>
);

UserList.propTypes = {
  users: PropTypes.array.isRequired,
  selectUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  cancelDelete: PropTypes.func.isRequired
};

export default UserList;
