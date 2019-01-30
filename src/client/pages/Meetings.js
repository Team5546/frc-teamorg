/* eslint-disable react/jsx-one-expression-per-line, jsx-a11y/label-has-for */
import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
// import PropTypes from 'prop-types';
import Page from '../components/Page';
import AlertBox from '../helpers/stateless/AlertBox';
import MeetingForm from '../components/MeetingForm';
import NavContext from '../NavContext';
import Panel from '../helpers/stateless/Panel';

const { $ } = window;

export default class Meetings extends Component {
  constructor() {
    super();
    this.state = {
      meetings: [],
      showForm: false,
      selectedMeeting: {}
    };

    this.getMeetings();
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitMeeting = this.submitMeeting.bind(this);
  }

  componentDidUpdate() {
    const { selectedMeeting } = this.state;
    $('#calendar').datepicker({ defaultDate: selectedMeeting.date });
    $('#calendar').on('click', () => this.handleDateChange());
  }

  getMeetings() {
    axios.get('/api/v1/meetings').then(response => {
      this.setState({ meetings: response.data });
    });
  }

  handleDateChange() {
    const { selectedMeeting } = this.state;
    selectedMeeting.date = $('#calendar').datepicker('getDate');
    this.setState({ selectedMeeting });
    $('#calendar').off('click');
    $('.day.active').toggleClass('active');
    // console.log(`^${moment(selectedMeeting.date).date()}$`);
    $(
      `.day:not(.old):not(.new):contains(${moment(selectedMeeting.date).date()}):first`
    ).toggleClass('active');
    $('#calendar').on('click', () => this.handleDateChange());
  }

  handleChange(event) {
    const { selectedMeeting } = this.state;
    const team = event.target.id.substring('subTeams'.length).toLowerCase();
    const subTeams = selectedMeeting.subTeams || [];
    if (event.target.checked) {
      subTeams.push(team);
    } else {
      subTeams.splice(subTeams.indexOf(team), 1);
    }
    this.setState({
      selectedMeeting: { ...selectedMeeting, subTeams }
    });
    // console.log(subTeams);
  }

  delete(meetingIndex) {
    const { meetings } = this.state;
    const updatedMeetings = meetings;
    updatedMeetings[meetingIndex].reallySure = (updatedMeetings[meetingIndex].reallySure || 0) + 1;
    this.setState({ meetings: updatedMeetings });
    if (updatedMeetings[meetingIndex].reallySure === 2) {
      this.deleteMeetingFinal(updatedMeetings[meetingIndex]._id);
    }
  }

  deleteMeetingFinal(id) {
    axios
      .delete(`/api/v1/meetings/${id}`)
      .then(() => this.getMeetings(), err => this.setState({ errors: err }));
  }

  cancelDelete(meetingIndex) {
    const { meetings } = this.state;
    const updatedMeetings = meetings;
    delete updatedMeetings[meetingIndex].reallySure;
    this.setState({ meetings: updatedMeetings });
  }

  submitMeeting(editing) {
    const { selectedMeeting } = this.state;
    if (editing) {
      axios.put(`api/v1/meetings/${selectedMeeting._id}`, selectedMeeting).then(
        () => {
          this.setState({ showForm: false });
          this.getMeetings();
        },
        err => console.error(err)
      );
    } else {
      axios.post('api/v1/meetings', selectedMeeting).then(
        () => {
          this.setState({ showForm: false });
          this.getMeetings();
        },
        err => console.error(err)
      );
    }
  }

  edit(meetingIndex) {
    const { meetings } = this.state;
    this.setState({ selectedMeeting: meetings[meetingIndex], showForm: true });
  }

  render() {
    const { meetings, errors, showForm, selectedMeeting } = this.state;
    return (
      <Page title="Meetings">
        <AlertBox
          condition={errors && errors.message}
          message={errors && errors.message}
          type="warning"
          close={() => this.setState({ errors: {} })}
        />
        <div className="row">
          <div className="col">
            <Panel
              title={
                showForm ? (
                  <React.Fragment>
                    <em className="fa fa-calendar" />
                    {` - ${selectedMeeting._id ? 'Editing' : 'Adding'} ${moment(
                      selectedMeeting.date
                    ).format('MM/DD/YY')} ${
                      selectedMeeting.subTeams.length === 6
                        ? 'Entire Team Meeting'
                        : `${selectedMeeting.subTeams
                            .map(
                              team => `${team.substring(0, 1).toUpperCase()}${team.substring(1)}`
                            )
                            .join(', ')} Meeting`
                    }`}
                  </React.Fragment>
                ) : (
                  undefined
                )
              }
              buttons={[
                {
                  type: 'default',
                  func: () =>
                    this.setState({
                      selectedMeeting: { date: new Date(), subTeams: [] },
                      showForm: true
                    }),
                  icon: 'plus'
                }
              ]}
            >
              {!showForm && (
                <table className="table">
                  <thead>
                    <tr>
                      <td>Date</td>
                      <td>Sub Teams</td>
                      <td>Past?</td>
                      <td>Attendance?</td>
                      <td />
                    </tr>
                  </thead>
                  <tbody>
                    {meetings.map((meeting, index) => (
                      <tr key={moment(meeting.date).format('MMDDYY') + meeting.subTeams.join('')}>
                        <td>{moment(meeting.date).format('MM/DD/YY')}</td>
                        <td>
                          {meeting.subTeams.length === 6
                            ? 'Entire Team'
                            : meeting.subTeams
                                .map(team => team.substring(0, 1).toUpperCase() + team.substring(1))
                                .join(', ')}
                        </td>
                        <td>
                          {moment().isAfter(meeting.date) ? (
                            <em className="fa fa-check text-success" />
                          ) : (
                            <em className="fa fa-times text-danger" />
                          )}
                        </td>
                        <td>
                          {meeting.attendance.length > 0 ? (
                            <em className="fa fa-check text-success" />
                          ) : (
                            <em className="fa fa-times text-danger" />
                          )}
                        </td>
                        <td>
                          {!meeting.reallySure ? (
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                              aria-label="User Actions"
                            >
                              {meeting.attendance.length === 0 &&
                                !moment(new Date()).isAfter(meeting.date) && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-warning"
                                    title="Edit"
                                    onClick={() => this.edit(index)}
                                  >
                                    <em className="fa fa-pencil-alt" />
                                  </button>
                                )}
                              <NavContext.Consumer>
                                {({ setPage }) => (
                                  <button
                                    type="button"
                                    className={`btn btn-sm btn-info ${
                                      moment(new Date()).isBefore(meeting.date) ? 'hidden' : ''
                                    }`}
                                    title="Edit"
                                    onClick={() => setPage('attendance', { meeting })}
                                  >
                                    <em className="fa fa-clipboard-list" />
                                  </button>
                                )}
                              </NavContext.Consumer>
                              <button
                                type="button"
                                className="btn btn-danger"
                                title="Delete"
                                onClick={() => this.delete(index)}
                              >
                                <em className="fa fa-trash" />
                              </button>
                            </div>
                          ) : (
                            <div
                              className="btn-group btn-group-sm"
                              role="group"
                              aria-label="User Actions"
                            >
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                title={`${meeting.reallySure ? 'Are you sure?' : 'Edit'}`}
                                onClick={() => this.delete(index)}
                              >
                                <em className="fa fa-trash" />
                              </button>
                              {meeting.reallySure && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-default"
                                  title="Cancel"
                                  onClick={() => this.cancelDelete(index)}
                                >
                                  <em className="fa fa-times" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {meetings.length === 0 && (
                      <tr>
                        <td className="text-center">No meetings have been scheduled.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              {showForm && (
                <MeetingForm
                  selectedMeeting={selectedMeeting}
                  editing={selectedMeeting._id}
                  submitForm={this.submitMeeting}
                  submitEdit={() => console.log('submit edit')}
                  handleChange={this.handleChange}
                  cancel={() => this.setState({ selectedMeeting: {}, showForm: false })}
                />
              )}
            </Panel>
          </div>
        </div>
      </Page>
    );
  }
}

Meetings.defaultProps = {};

Meetings.propTypes = {};
