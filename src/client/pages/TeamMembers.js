/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/label-has-for */
import React, { Component } from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import Page from '../components/Page';
import AlertBox from '../helpers/stateless/AlertBox';
import Table from '../helpers/stateless/Table';

export default class TeamMembers extends Component {
  constructor() {
    super();
    this.state = {
      teamMembers: []
    };

    this.getTeamMembers();
  }

  getTeamMembers() {
    axios.get('/api/v1/teamMembers').then((response) => {
      this.setState({ teamMembers: response.data });
    });
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

  render() {
    const { teamMembers, errors } = this.state;
    return (
      <Page title="Team Members">
        <AlertBox
          condition={errors && errors.message}
          message={errors && errors.message}
          type="warning"
          close={() => this.setState({ errors: {} })}
        />
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <Table
                columns={[
                  {
                    name: 'First Name'
                  },
                  {
                    name: 'Last Name'
                  },
                  {
                    name: 'Email'
                  },
                  {
                    name: 'Grade'
                  },
                  {
                    name: 'Major'
                  },
                  {
                    name: 'Student Contract',
                    type: 'boolean'
                  },
                  {
                    name: 'Sub Teams',
                    type: 'array'
                  },
                  {
                    name: '',
                    type: 'controls',
                    editPage: 'interestForm'
                  }
                ]}
                data={teamMembers}
              />
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

TeamMembers.defaultProps = {};

TeamMembers.propTypes = {};
