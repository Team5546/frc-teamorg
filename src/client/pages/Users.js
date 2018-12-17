/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/label-has-for */
import React, { Component } from 'react';
import './styles/Users.scss';
import axios from 'axios';
import PropTypes from 'prop-types';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import Page from '../components/Page';

export default class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      selectedUser: undefined,
      duplicateUsername: false
    };

    this.getUsers();
    this.submitEdit = this.submitEdit.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
  }

  componentDidMount() {
    const { addUser } = this.props;
    if (addUser) {
      this.setState({ selectedUser: { isActive: true }, editing: false });
    }
  }

  getUsers() {
    axios.get('/api/v1/users').then((response) => {
      this.setState({ users: response.data });
    });
  }

  handleUserChange(event) {
    const { selectedUser } = this.state;
    this.setState({
      selectedUser: { ...selectedUser, [event.target.id]: event.target.value }
    });
    if (event.target.id === 'username') {
      axios
        .put('/api/v1/accounts/checkUsername', {
          username: event.target.value,
          id: selectedUser._id
        })
        .then(
          () => {
            this.setState({ duplicateUsername: false });
          },
          (err) => {
            // console.log(err.response.status);
            if (err.response.status === 422) {
              this.setState({ duplicateUsername: true });
            }
          }
        );
    }
  }

  handleCheckboxChange(event) {
    const { selectedUser } = this.state;
    this.setState({ selectedUser: { ...selectedUser, [event.target.id]: event.target.checked } });
  }

  submitEdit(currentUser, updateUserFunc) {
    const { selectedUser } = this.state;
    const modifiedAt = new Date();
    const newUser = {
      ...selectedUser,
      lastModified: modifiedAt,
      modifiedBy: currentUser.username
    };
    this.setState({ errors: undefined });
    axios.put(`/api/v1/users/${selectedUser._id}`, newUser).then(
      (response) => {
        this.getUsers();
        this.setState({ selectedUser: undefined });
        if (currentUser._id === response.data._id) {
          updateUserFunc(newUser);
        }
      },
      (err) => {
        if (err.response.status === 422) {
          this.setState({ ...err.response.data });
        } else {
          this.setState({ errors: { message: 'An unkown error has occurred' } });
        }
      }
    );
  }

  delete(userIndex) {
    const { users } = this.state;
    const updatedUsers = users.slice();
    updatedUsers[userIndex].reallySure = (updatedUsers[userIndex].reallySure || 0) + 1;
    this.setState({ users: updatedUsers });
    if (updatedUsers[userIndex].reallySure === 2) {
      this.deleteUserFinal(updatedUsers[userIndex]);
    }
  }

  deleteUserFinal(user) {
    axios
      .delete(`/api/v1/users/${user._id}`)
      .then(() => this.getUsers(), err => this.setState({ errors: err }));
  }

  cancelDelete(userIndex) {
    const { users } = this.state;
    const updatedUsers = users.slice();
    delete updatedUsers[userIndex].reallySure;
    this.setState({ users: updatedUsers });
  }

  addNewUser(currentUser) {
    const { selectedUser } = this.state;
    const newUser = {
      ...selectedUser,
      createdAt: new Date(),
      createdBy: currentUser.username
    };
    axios.post('api/v1/accounts/signup', newUser).then(
      () => {
        this.setState({ selectedUser: undefined });
        this.getUsers();
      },
      (err) => {
        console.log(err.response.data);
      }
    );
  }

  render() {
    const {
      users, selectedUser, errors, duplicateUsername, editing
    } = this.state;
    return (
      <Page title="Internal Users" parentPage="Users">
        {errors && errors.message ? (
          <div className="alert alert-danger">
            {errors.message}
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ) : (
          <div />
        )}
        {selectedUser ? (
          <UserForm
            selectedUser={selectedUser}
            submitEdit={this.submitEdit}
            handleUserChange={this.handleUserChange}
            handleCheckboxChange={this.handleCheckboxChange}
            cancel={() => this.setState({ selectedUser: undefined })}
            duplicateUsername={duplicateUsername}
            signup={this.addNewUser}
            editing={editing}
          />
        ) : (
          <div className="row">
            <div className="col-lg-12">
              <div className="panel panel-default">
                <div className="panel-header">
                  <div className="panel-heading">
                    <button
                      type="button"
                      className="pull-right btn btn-md btn-default"
                      onClick={() => this.setState({ selectedUser: { isActive: true }, editing: false })
                      }
                    >
                      <em className="fa fa-plus" />
                    </button>
                  </div>
                </div>
                <div className="panel-body">
                  <UserList
                    users={users}
                    selectUser={_user => this.setState({ selectedUser: _user, editing: true })}
                    deleteUser={index => this.delete(index)}
                    cancelDelete={index => this.cancelDelete(index)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Page>
    );
  }
}

Users.defaultProps = {
  addUser: false
};

Users.propTypes = {
  addUser: PropTypes.bool
};
