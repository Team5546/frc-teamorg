/* eslint-disable react/no-string-refs, jsx-a11y/anchor-is-valid,
  no-restricted-syntax, jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import phoneFormat from 'phone-formatter';
import axios from 'axios';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import Page from '../components/Page';
import NavContext from '../NavContext';
import AlertBox from '../helpers/stateless/AlertBox';

export default class MemberInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamMember: props.teamMember
    };

    this.updateForms = this.updateForms.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  updateForms(field) {
    const { teamMember } = this.state;
    teamMember[field] = teamMember[field] ? !teamMember[field] : true;
    console.log(teamMember);
    this.setState({ teamMember });
  }

  saveChanges() {
    const { teamMember } = this.state;
    this.setState({ saving: true });
    axios.put('/api/v1/teamMembers', teamMember).then(
      () => {
        this.setState({ saving: false, success: true });
        console.log('updated team member');
      },
      (err) => {
        this.setState({ errors: { ...errors, ...err.response.data.errors } });
      }
    );
  }

  render() {
    const {
      teamMember, saving, success, errors
    } = this.state;
    return (
      <NavContext.Consumer>
        {({ setPage }) => (
          <Page title="Student Info">
            {success && (
              <div className="alert bg-success" role="alert">
                <em className="fa fa-lg fa-warning">
&nbsp;
                </em>
                {' '}
Successfully saved team member!
                {' '}
                <a
                  onClick={() => this.setState({ success: false })}
                  className="pull-right"
                  role="button"
                >
                  <em className="fa fa-lg fa-close" />
                </a>
              </div>
            )}
            <AlertBox
              condition={errors}
              message={errors && (errors.message)}
              close={() => this.setState({ errors: undefined })}
              type="danger"
            />
            <div className="row">
              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-small btn-default"
                  onClick={() => setPage('teamMembers')}
                >
                  <em className="fa fa-angle-left" />
                </button>
              </div>
            </div>
            <hr />
            {teamMember ? (
              <React.Fragment>
                <div className="row">
                  <div className="col-md-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
Student Info
                      </div>
                      <div className="panel-body">
                        <dl>
                          <h4>
                            {`${teamMember.firstName} ${teamMember.lastName}`}
                          </h4>
                          <dt>
Grade
                          </dt>
                          <dd>
                            {`${teamMember.grade}`}
                          </dd>
                          <dt>
Major
                          </dt>
                          <dd>
                            {`${teamMember.major}`}
                          </dd>
                          <dt>
Email
                          </dt>
                          <dd>
                            {`${teamMember.email}`}
                          </dd>
                          <dt>
Address
                          </dt>
                          <dd>
                            {`${teamMember.address1} ${teamMember.address2 || ''} ${
                              teamMember.city
                            } ${teamMember.state} ${teamMember.zipCode}`}
                          </dd>
                          <dt>
Student Contract
                          </dt>
                          <dd
                            className={teamMember.studentContract ? 'text-success' : 'text-danger'}
                          >
                            {`${teamMember.studentContract ? 'Yes' : 'No'}`}
                          </dd>
                          <dt>
Parent Contract
                          </dt>
                          <dd
                            className={teamMember.parentContract ? 'text-success' : 'text-danger'}
                          >
                            {`${teamMember.parentContract ? 'Yes' : 'No'}`}
                          </dd>
                          <dt>
Medical Form
                          </dt>
                          <dd className={teamMember.medicalForm ? 'text-success' : 'text-danger'}>
                            {`${teamMember.medicalForm ? 'Yes' : 'No'}`}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
Parent Info
                      </div>
                      <div className="panel-body">
                        {teamMember.parents.map(parent => (
                          <dl key={`${parent.firstName}-${parent.lastName}`}>
                            <h4>
                              {`${parent.firstName} ${parent.lastName}`}
                            </h4>
                            <dt>
Phone
                            </dt>
                            <dd>
                              {`${phoneFormat.format(parent.phone, '(NNN) NNN-NNNN')}`}
                            </dd>
                            <dt>
Email
                            </dt>
                            <dd>
                              {`${parent.email}`}
                            </dd>
                          </dl>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
Update Form/Dues Status
                      </div>
                      <div className="panel-body">
                        <h5>
Student Contract
                        </h5>
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            teamMember.studentContract ? 'btn-success' : 'btn-danger'
                          }`}
                          onClick={() => this.updateForms('studentContract')}
                        >
                          <em
                            className={`fa fa-${teamMember.studentContract ? 'check' : 'times'}`}
                          />
                          {' Student Contract'}
                        </button>
                        <h5>
Parent Contract
                        </h5>
                        <button
                          type="button"
                          id="parentContract"
                          className={`btn btn-sm ${
                            teamMember.parentContract ? 'btn-success' : 'btn-danger'
                          }`}
                          onClick={() => this.updateForms('parentContract')}
                        >
                          <em
                            className={`fa fa-${teamMember.parentContract ? 'check' : 'times'}`}
                          />
                          {' Parent Contract'}
                        </button>
                        <h5>
Medical Form
                        </h5>
                        <button
                          type="button"
                          id="medicalForm"
                          className={`btn btn-sm ${
                            teamMember.medicalForm ? 'btn-success' : 'btn-danger'
                          }`}
                          onClick={() => this.updateForms('medicalForm')}
                        >
                          <em className={`fa fa-${teamMember.medicalForm ? 'check' : 'times'}`} />
                          {' Medical Form'}
                        </button>
                        <h5>
Dues
                        </h5>
                        <button
                          type="button"
                          id="medicalForm"
                          className={`btn btn-sm ${
                            teamMember.duesPaid ? 'btn-success' : 'btn-danger'
                          }`}
                          onClick={() => this.updateForms('duesPaid')}
                        >
                          <em className="fa fa-money-bill" />
                          {' Dues Paid'}
                        </button>
                        <hr />
                        <button
                          type="button"
                          id="medicalForm"
                          className="btn btn-sm btn-info"
                          onClick={this.saveChanges}
                        >
                          <em className={`fa fa-${saving ? 'spinner' : 'save'}`} />
                          {saving ? ' Saving Changes' : ' Save Changes'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
Meeting Stats
                      </div>
                      <div className="panel-body">
                        <h4>
                          Sub Team Meetings Attended
                          <span
                            className={
                              teamMember.subTeamMeetingsAttended < 80
                                ? 'text-danger'
                                : 'text-success'
                            }
                          >
                            {` ${teamMember.subTeamMeetingsAttended}%`}
                          </span>
                        </h4>
                        <h4>
                          Entire Team Meetings Attended
                          <span
                            className={
                              teamMember.teamMeetingsAttended < 50 ? 'text-danger' : 'text-success'
                            }
                          >
                            {` ${teamMember.teamMeetingsAttended}%`}
                          </span>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
Meetings
                      </div>
                      <div className="panel-body">
                        {teamMember.meetings.map((meeting, i) => (
                          <dl
                            key={
                              moment(meeting.date).format('MM/DD/YY')
                              + meeting.meeting.subTeams.join('')
                            }
                          >
                            <dt>
Date
                            </dt>
                            <dd>
                              {moment(meeting.date).format('MM/DD/YY')}
                            </dd>
                            <dt>
Type
                            </dt>
                            <dd>
                              {meeting.meeting.subTeams.length === 6 ? 'Entire Team' : 'Sub Team'}
                            </dd>
                            <dt>
Attended?
                            </dt>
                            <dd className={meeting.attended ? 'text-success' : 'text-danger'}>
                              {meeting.attended ? 'Yes' : 'No'}
                            </dd>
                            {i !== 0 && <hr />}
                          </dl>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <h4>
No Team Member Selected
              </h4>
            )}
          </Page>
        )}
      </NavContext.Consumer>
    );
  }
}

MemberInfo.defaultProps = {
  teamMember: {}
};

MemberInfo.propType = {
  teamMember: PropTypes.object
};
