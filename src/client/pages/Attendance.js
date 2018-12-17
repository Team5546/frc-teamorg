import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import Page from '../components/Page';
import NavContext from '../NavContext';

export default class Attendance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      meeting: props.meeting,
      members: []
    };

    this.submitAttendance = this.submitAttendance.bind(this);
  }

  componentDidMount() {
    this.getMembers();
  }

  getMembers() {
    const { meeting, members } = this.state;
    console.log(meeting.roster);
    for (const memberId of meeting.roster) {
      axios.get(`api/v1/teamMembers/${memberId}`).then(
        (response) => {
          members.push(response.data);
          if (meeting.attendance.length === 0) meeting.absent.push(response.data._id);
          this.setState({ members, meeting });
          console.log(members);
        },
        err => console.error(err)
      );
    }
  }

  setHere(memberId) {
    const { meeting, members } = this.state;
    if (meeting.attendance.indexOf(memberId) !== -1) return;
    meeting.absent.splice(meeting.absent.indexOf(memberId), 1);
    meeting.attendance.push(memberId);
    this.setState({ meeting });
    console.log('-----------');
    console.log(
      `Here: ${meeting.attendance.map(
        i => members.filter(member => member._id === i)[0].firstName
      )}`
    );
    console.log(
      `Absent: ${meeting.absent.map(i => members.filter(member => member._id === i)[0].firstName)}`
    );
  }

  setAbsent(memberId) {
    const { meeting, members } = this.state;
    const meetingCopy = meeting;
    if (meetingCopy.absent.indexOf(memberId) !== -1) return;
    meetingCopy.attendance.splice(meeting.attendance.indexOf(memberId), 1);
    meetingCopy.absent.push(memberId);
    this.setState({ meeting: meetingCopy });
    console.log('-----------');
    console.log(
      `Here: ${meetingCopy.attendance.map(
        i => members.filter(member => member._id === i)[0].firstName
      )}`
    );
    console.log(
      `Absent: ${meetingCopy.absent.map(
        i => members.filter(member => member._id === i)[0].firstName
      )}`
    );
  }

  getHere(memberId) {
    const { meeting } = this.state;
    if (meeting.attendance.indexOf(memberId) !== -1) return true;
    return false;
  }

  getAbsent(memberId) {
    const { meeting } = this.state;
    if (meeting.absent.indexOf(memberId) !== -1) return true;
    return false;
  }

  async submitAttendance() {
    const { meeting } = this.state;
    await axios.put(`api/v1/meetings/${meeting._id}`, meeting);
  }

  render() {
    const { meeting, members } = this.state;
    return (
      <NavContext.Consumer>
        {({ setPage }) => (
          <Page
            title="Attendance"
            parentPage={`${moment(meeting.date).format('MM/DD/YY')} - ${meeting.subTeams
              .map(team => team.substring(0, 1).toUpperCase() + team.substring(1))
              .join(', ')} Meeting`}
          >
            <div className="row">
              <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    {`${moment(meeting.date).format('MM/DD/YY')} - ${meeting.subTeams
                      .map(team => team.substring(0, 1).toUpperCase() + team.substring(1))
                      .join(', ')} Meeting`}
                  </div>
                  <div className="panel-body">
                    <div className="row">
                      {members
                        && members.map(member => (
                          <div
                            className="col-sm-6 col-md-4"
                            key={`${member.firstName}${member.lastName}`}
                          >
                            <div className="row">
                              <div className="col-md-6">
                                {`${member.firstName} ${member.lastName}`}
                              </div>
                              <div className="col-md-6">
                                <div
                                  className="btn-group btn-group-sm"
                                  role="group"
                                  aria-label="User Actions"
                                >
                                  <button
                                    type="button"
                                    className={`btn btn-sm btn-success ${
                                      this.getHere(member._id) ? 'active' : 'disabled'
                                    }`}
                                    title="Edit"
                                    onClick={() => this.setHere(member._id)}
                                  >
                                    <em className="fa fa-check" />
                                    {' Here'}
                                  </button>
                                  <button
                                    type="button"
                                    className={`btn btn-sm btn-danger ${
                                      this.getAbsent(member._id) ? 'active' : 'disabled'
                                    }`}
                                    title="Delete"
                                    onClick={() => this.setAbsent(member._id)}
                                  >
                                    <em className="fa fa-times" />
                                    {' Absent'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-12">
                        <div
                          className="btn-group btn-group-sm"
                          role="group"
                          aria-label="User Actions"
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-info"
                            onClick={() => this.submitAttendance().then(() => setPage('meetings'))}
                          >
                            Submit Attendance
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-default"
                            onClick={() => setPage('meetings')}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Page>
        )}
      </NavContext.Consumer>
    );
  }
}

Attendance.propTypes = {
  meeting: PropTypes.object.isRequired
};
