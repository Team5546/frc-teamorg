/* eslint-disable react/jsx-one-expression-per-line,
  jsx-a11y/label-has-for, class-methods-use-this, max-len */
import React, { Component } from 'react';
import axios from 'axios';
// import PropTypes from 'prop-types';
import Page from '../../components/Page';
import AlertBox from '../../helpers/stateless/AlertBox';
import Table from '../../helpers/stateless/Table';
import NavContext from '../../NavContext';
import Panel from '../../helpers/stateless/Panel';

export default class TeamMembers extends Component {
  constructor() {
    super();
    this.state = {
      teamMembers: [],
      formattedTeamMembers: [],
      sortBy: 'nameDown',
      search: ''
    };

    this.sort = this.sort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.getTeamMembers();
  }

  getTeamMembers() {
    axios.get('/api/v1/teamMembers').then(response => {
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
    this.setState({ sortBy }, this.sortFilterSearch);
  }

  filter(filterBy) {
    this.setState({ filterBy }, this.sortFilterSearch);
  }

  sortFilterSearch() {
    const { teamMembers, sortBy, filterBy, search } = this.state;
    const sortOption = sortBy;
    const filterOption = filterBy;
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
          (a, b) =>
            [b.studentContract ? 1 : 0, b.parentContract ? 1 : 0, b.medicalForm ? 1 : 0].reduce(
              (total, num) => total + num
            ) -
            [a.studentContract ? 1 : 0, a.parentContract ? 1 : 0, a.medicalForm ? 1 : 0].reduce(
              (total, num) => total + num
            )
        );
        break;
      case 'contractsDown':
        tempMembers.sort(
          (a, b) =>
            [a.studentContract ? 1 : 0, a.parentContract ? 1 : 0, a.medicalForm ? 1 : 0].reduce(
              (total, num) => total + num
            ) -
            [b.studentContract ? 1 : 0, b.parentContract ? 1 : 0, b.medicalForm ? 1 : 0].reduce(
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
    if (search) {
      tempMembers = tempMembers.filter(
        member =>
          `${member.firstName} ${member.lastName}`.toLowerCase().indexOf(search.toLowerCase()) >
            -1 ||
          member.email
            .substring(0, member.email.indexOf('@'))
            .toLowerCase()
            .indexOf(search.toLowerCase()) > -1
      );
    }

    this.setState({ formattedTeamMembers: tempMembers, membersLength: tempMembers.length });
  }

  handleSearch(e) {
    const { value } = e.target;
    this.setState({ search: value }, this.sortFilterSearch);
  }

  render() {
    const { formattedTeamMembers, errors, membersLength, sortBy, search } = this.state;
    return (
      <Page title="Team Members" parentPage="Users">
        <AlertBox
          condition={errors && errors.message}
          message={errors && errors.message}
          type="warning"
          close={() => this.setState({ errors: {} })}
        />
        <div className="row">
          <div className="col">
            <Panel
              header={
                <div className="row">
                  <div className="col-4">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onChange={this.handleSearch}
                        placeholder="Search by name or email..."
                        value={search}
                        style={{ height: '39px' }}
                      />
                      <div className="input-group-btn">
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={() => this.handleSearch({ target: { value: '' } })}
                          style={{ height: '39px' }}
                        >
                          <em className="fa fa-times" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto d-flex align-items-center">
                    <h4 className="my-auto">Filter:</h4>
                  </div>
                  <div className="col-auto">
                    <select className="form-control" onChange={e => this.filter(e.target.value)}>
                      <option value="none">None</option>
                      <option value="missingMeetings">Not Going To Meetings</option>
                      <option value="duesPaid">Dues Paid</option>
                      <option value="missingFormsDues">Missing Forms/Dues</option>
                      <option value="nothingMissing">Nothing Missing</option>
                    </select>
                  </div>
                  <div className="col-auto d-flex align-items-center">
                    <h4 className="my-auto">{`Total: ${membersLength}`}</h4>
                  </div>
                  <NavContext.Consumer>
                    {({ setPage }) => (
                      <div className="col">
                        <button
                          type="button"
                          className="float-right btn btn-md btn-default"
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
                          className="float-right btn btn-md btn-default"
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
                      </div>
                    )}
                  </NavContext.Consumer>
                </div>
              }
            >
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
                disabledCol="leftTeam"
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
            </Panel>
          </div>
        </div>
      </Page>
    );
  }
}

TeamMembers.defaultProps = {};

TeamMembers.propTypes = {};
