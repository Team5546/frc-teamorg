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
    meeting.roster.forEach((memberId) => {
      axios.get(`api/v1/teamMembers/${memberId}`).then(
        (response) => {
          members.push(response.data);
          if (meeting.attendance.length === 0) meeting.absent.push(response.data._id);
          this.setState({ members, meeting });
          // console.log(members);
        },
        err => console.error(err)
      );
    });
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

  toggleHere(memberId) {
    const { meeting, members } = this.state;
    // console.log('-----------');
    // console.log(
    //   `Here: ${meeting.attendance.map(
    //     i => members.filter(member => member._id === i)[0].firstName
    //   )}`
    // );
    // console.log(
    //   `Absent: ${meeting.absent.map(i => members.filter(member => member._id === i)[0].firstName)}`
    // );
    if (this.getHere(memberId)) {
      meeting.attendance.splice(meeting.attendance.indexOf(memberId), 1);
      meeting.absent.push(memberId);
      this.setState({ meeting });
    } else if (this.getAbsent(memberId)) {
      meeting.absent.splice(meeting.absent.indexOf(memberId), 1);
      meeting.attendance.push(memberId);
      this.setState({ meeting });
    }
    // console.log(
    //   `Here: ${meeting.attendance.map(
    //     i => members.filter(member => member._id === i)[0].firstName
    //   )}`
    // );
    // console.log(
    //   `Absent: ${meeting.absent.map(i => members.filter(member => member._id === i)[0].firstName)}`
    // );
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
                            className="col-xs-4 col-sm-4 col-md-3"
                            key={`${member.firstName}${member.lastName}`}
                          >
                            <dl>
                              <dt>
                                {`${member.firstName} ${member.lastName}`}
                              </dt>
                              <dl>
                                <button
                                  type="button"
                                  className={`btn btn-sm btn-${
                                    this.getHere(member._id) ? 'success' : 'danger'
                                  }`}
                                  onClick={() => this.toggleHere(member._id)}
                                >
                                  <em
                                    className={`fa fa-${
                                      this.getHere(member._id) ? 'check' : 'times'
                                    }`}
                                  >
                                    &nbsp;
                                  </em>
                                  {this.getHere(member._id) ? 'Here' : 'Absent'}
                                </button>
                              </dl>
                            </dl>
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
