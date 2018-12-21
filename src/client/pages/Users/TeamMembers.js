/* eslint-disable react/jsx-one-expression-per-line,
  jsx-a11y/label-has-for, class-methods-use-this, max-len */
import React, { Component } from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import Page from '../../components/Page';
import AlertBox from '../../helpers/stateless/AlertBox';
import Table from '../../helpers/stateless/Table';
import NavContext from '../../NavContext';

export default class TeamMembers extends Component {
  constructor() {
    super();
    this.state = {
      teamMembers: [],
      formattedTeamMembers: [],
      sortBy: 'nameDown'
    };

    this.sort = this.sort.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);

    this.getTeamMembers();
  }

  getTeamMembers() {
    axios.get('/api/v1/teamMembers').then((response) => {
      this.setState({ teamMembers: response.data });
      this.sort('name');
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

  sort(sort) {
    let { sortBy } = this.state;
    if (sortBy.substring(0, sort.length) !== sort) sortBy = `${sort}Up`;
    else if (sortBy.substring(sort.length) === 'Up') sortBy = `${sort}Down`;
    else sortBy = `${sort}Up`;
    this.setState({ sortBy });
    this.sortFilter(sortBy, undefined);
  }

  filter(filterBy) {
    this.setState({ filterBy });
    this.sortFilter(undefined, filterBy);
  }

  sortFilter(sort, filter) {
    const { teamMembers, sortBy, filterBy } = this.state;
    const sortOption = sort || sortBy;
    const filterOption = filter || filterBy;
    // console.log(sortOption, filterOption);
    let tempMembers = teamMembers;
    switch (sortOption) {
      case 'nameUp':
        tempMembers.sort((a, b) => {
          if (`${a.firstName} ${a.lastName}` < `${b.firstName} ${b.lastName}`) return -1;
          if (`${a.firstName} ${a.lastName}` > `${b.firstName} ${b.lastName}`) return 1;
          return 0;
        });
        break;
      case 'nameDown':
        tempMembers.sort((a, b) => {
          if (`${a.firstName} ${a.lastName}` > `${b.firstName} ${b.lastName}`) return -1;
          if (`${a.firstName} ${a.lastName}` < `${b.firstName} ${b.lastName}`) return 1;
          return 0;
        });
        break;
      case 'emailUp':
        tempMembers.sort((a, b) => {
          if (a.email < b.email) return -1;
          if (a.email > b.email) return 1;
          return 0;
        });
        break;
      case 'emailDown':
        tempMembers.sort((a, b) => {
          if (a.email > b.email) return -1;
          if (a.email < b.email) return 1;
          return 0;
        });
        break;
      case 'subTeamMeetingsAttendedUp':
        tempMembers.sort((a, b) => b.subTeamMeetingsAttended - a.subTeamMeetingsAttended);
        break;
      case 'subTeamMeetingsAttendedDown':
        tempMembers.sort((a, b) => a.subTeamMeetingsAttended - b.subTeamMeetingsAttended);
        break;
      case 'teamMeetingsAttendedUp':
        tempMembers.sort((a, b) => b.teamMeetingsAttended - a.teamMeetingsAttended);
        break;
      case 'teamMeetingsAttendedDown':
        tempMembers.sort((a, b) => a.teamMeetingsAttended - b.teamMeetingsAttended);
        break;
      case 'contractsUp':
        tempMembers.sort(
          (a, b) => [b.studentContract ? 1 : 0, b.parentContract ? 1 : 0, b.medicalForm ? 1 : 0].reduce(
            (total, num) => total + num
          )
            - [a.studentContract ? 1 : 0, a.parentContract ? 1 : 0, a.medicalForm ? 1 : 0].reduce(
              (total, num) => total + num
            )
        );
        break;
      case 'contractsDown':
        tempMembers.sort(
          (a, b) => [a.studentContract ? 1 : 0, a.parentContract ? 1 : 0, a.medicalForm ? 1 : 0].reduce(
            (total, num) => total + num
          )
            - [b.studentContract ? 1 : 0, b.parentContract ? 1 : 0, b.medicalForm ? 1 : 0].reduce(
              (total, num) => total + num
            )
        );
        break;
      case 'duesPaidUp':
        tempMembers.sort((a, b) => (b.duesPaid ? 1 : 0) - (a.duesPaid ? 1 : 0));
        break;
      case 'duesPaidDown':
        tempMembers.sort((a, b) => (a.duesPaid ? 1 : 0) - (b.duesPaid ? 1 : 0));
        break;
      default:
        tempMembers.sort((a, b) => {
          if (`${a.firstName} ${a.lastName}` < `${b.firstName} ${b.lastName}`) return -1;
          if (`${a.firstName} ${a.lastName}` > `${b.firstName} ${b.lastName}`) return 1;
          return 0;
        });
        break;
    }
    switch (filterOption) {
      case 'duesPaid':
        tempMembers = tempMembers.filter(val => val.duesPaid);
        break;
      case 'missingFormsDues':
        tempMembers = tempMembers.filter(
          val => !val.duesPaid || !val.studentContract || !val.parentContract || !val.medicalForm
        );
        break;
      case 'nothingMissing':
        tempMembers = tempMembers.filter(
          val => val.duesPaid && val.studentContract && val.parentContract && val.medicalForm
        );
        break;
      case 'missingMeetings':
        tempMembers = tempMembers.filter(
          val => val.subTeamMeetingsAttended < 80 || val.teamMeetingsAttended < 50
        );
        break;
      default:
        break;
    }
    this.setState({ formattedTeamMembers: tempMembers, membersLength: tempMembers.length });
  }

  render() {
    const {
      formattedTeamMembers, errors, membersLength, sortBy
    } = this.state;
    return (
      <Page title="Team Members" parentPage="Users">
        <AlertBox
          condition={errors && errors.message}
          message={errors && errors.message}
          type="warning"
          close={() => this.setState({ errors: {} })}
        />
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-header">
                <div className="panel-heading">
                  <div className="col-md-1">
                    <h4>Filter:</h4>
                  </div>
                  <div className="col-md-2">
                    <select className="form-control" onChange={e => this.filter(e.target.value)}>
                      <option value="none">None</option>
                      <option value="missingMeetings">Not Going To Meetings</option>
                      <option value="duesPaid">Dues Paid</option>
                      <option value="missingFormsDues">Missing Forms/Dues</option>
                      <option value="nothingMissing">Nothing Missing</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <h4>{`Total: ${membersLength}`}</h4>
                  </div>
                  <NavContext.Consumer>
                    {({ setPage }) => (
                      <React.Fragment>
                        <button
                          type="button"
                          className="pull-right btn btn-md btn-default"
                          style={{
                            marginLeft: 0,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0
                          }}
                          onClick={() => setPage('interestForm')}
                        >
                          <em className="fa fa-plus" />
                        </button>
                        <button
                          type="button"
                          className="pull-right btn btn-md btn-default"
                          style={{
                            marginLeft: 0,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                            borderRight: '1px solid lightGray'
                          }}
                          onClick={() => setPage('memberUpload')}
                        >
                          <em className="fa fa-upload" />
                        </button>
                      </React.Fragment>
                    )}
                  </NavContext.Consumer>
                </div>
              </div>
              <div className="panel-body">
                <Table
                  columns={[
                    {
                      name: 'Name',
                      sortKey: 'name',
                      specialData: 'name'
                    },
                    {
                      name: 'Email',
                      type: 'text'
                    },
                    {
                      name: 'STM %',
                      key: 'subTeamMeetingsAttended',
                      type: 'text'
                    },
                    {
                      name: 'TM %',
                      key: 'teamMeetingsAttended',
                      type: 'text'
                    },
                    {
                      name: 'Contracts (S/P/M)',
                      sortKey: 'contracts',
                      type: 'booleanList',
                      specialData: 'contracts'
                    },
                    {
                      name: 'Dues Paid',
                      type: 'boolean'
                    },
                    {
                      name: '',
                      type: 'controls',
                      editPage: 'interestForm',
                      infoPage: 'memberInfo'
                    }
                  ]}
                  data={formattedTeamMembers}
                  handleSort={this.sort}
                  currentSort={sortBy}
                  specialData={{
                    name: formattedTeamMembers.map(
                      member => `${member.firstName} ${member.lastName}`
                    ),
                    contracts: formattedTeamMembers.map(member => [
                      member.studentContract,
                      member.parentContract,
                      member.medicalForm
                    ])
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }
}

TeamMembers.defaultProps = {};

TeamMembers.propTypes = {};
