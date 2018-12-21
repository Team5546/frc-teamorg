/* eslint-disable react/no-string-refs, jsx-a11y/anchor-is-valid,
  no-restricted-syntax, jsx-a11y/click-events-have-key-events,
  jsx-a11y/interactive-supports-focus, no-nested-ternary */
import React, { Component } from 'react';
import phoneFormat from 'phone-formatter';
import axios from 'axios';
import moment from 'moment';
import { PropTypes } from 'prop-types';
import ReactFileReader from 'react-file-reader';
import Page from '../../components/Page';
import NavContext from '../../NavContext';
import AlertBox from '../../helpers/stateless/AlertBox';

function base64MimeType(encoded) {
  let result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  const mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    [, result] = mime;
  }

  return result;
}

export default class MemberInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamMember: props.teamMember,
      fileNames: {
        studentContract: '',
        parentContract: '',
        medicalForm: ''
      }
    };

    this.updateForms = this.updateForms.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.parseFile = this.parseFile.bind(this);
    this.removePicture = this.removePicture.bind(this);
  }

  updateForms(field) {
    const { teamMember } = this.state;
    teamMember[field] = teamMember[field] ? !teamMember[field] : true;
    console.log(teamMember);
    this.setState({ teamMember });
  }

  saveChanges() {
    const { teamMember } = this.state;
    let { errors } = this.state;
    errors = errors || {};
    this.setState({ saving: true });
    axios.put('/api/v1/teamMembers', teamMember).then(
      () => {
        this.setState({ saving: false, success: true });
        console.log('updated team member');
      },
      (err) => {
        if (err.response.status === 413) errors.message = 'File too large. File size limit is 1Mb.';
        this.setState({ errors: { ...errors, ...err.response.data.errors } });
      }
    );
  }

  parseFile(field, files) {
    // console.log(files);
    const { fileNames, teamMember } = this.state;
    let { errors } = this.state;
    errors = errors || {};
    // console.log(`File Size: ${files.fileList[0].size}`);
    // console.log(`Limit: ${1024 * 1024}`);
    if (files.fileList[0].size <= 1024 * 1024) {
      fileNames[field] = files.fileList[0].name;
      teamMember[`${field}Picture`] = files.base64;
      this.setState({ fileNames, teamMember });
    } else {
      errors.message = 'File too large. Upload limit 1Mb';
      this.setState({ errors });
    }
  }

  removePicture(field) {
    const { teamMember, fileNames } = this.state;
    teamMember[`${field}Picture`] = '';
    fileNames[field] = '';
    this.setState({ teamMember, fileNames });
  }

  render() {
    const {
      teamMember, saving, success, errors, fileNames
    } = this.state;
    return (
      <NavContext.Consumer>
        {({ setPage }) => (
          <Page title="Student Info">
            {success && (
              <AlertBox
                condition={success}
                message="Successfully saved team member!"
                type="success"
                close={() => this.setState({ success: false })}
              />
            )}
            <AlertBox
              condition={errors}
              message={errors && errors.message}
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
Sub Teams
                          </dt>
                          <dd>
                            {teamMember.subTeams
                              .map(team => team.substring(0, 1).toUpperCase() + team.substring(1))
                              .join(', ')}
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
                        <div className="row">
                          <div className="col-xs-12 col-md-6">
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
                                className={`fa fa-${
                                  teamMember.studentContract ? 'check' : 'times'
                                }`}
                              />
                              {' Student Contract'}
                            </button>
                          </div>
                          <div className="col-xs-12 col-md-6">
                            <h6>
                              <em>
                                Picture
                                {teamMember.studentContractPicture && (
                                  <a
                                    role="button"
                                    onClick={() => {
                                      const win = window.open();
                                      win.document.write(
                                        `<iframe src="${
                                          teamMember.studentContractPicture
                                        }" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                                      );
                                    }}
                                  >
                                    {' - '}
                                    View Image
                                  </a>
                                )}
                                {fileNames.studentContract && (
                                  <p style={{ overflow: 'hidden' }}>
                                    {fileNames.studentContract}
                                  </p>
                                )}
                              </em>
                            </h6>
                            {teamMember.studentContractPicture ? (
                              base64MimeType(teamMember.studentContractPicture)
                              === 'application/pdf' ? (
                                <embed
                                  width="100%"
                                  height="200px"
                                  name="plugin"
                                  src={teamMember.studentContractPicture}
                                  type="application/pdf"
                                />
                                ) : (
                                  <img
                                    src={teamMember.studentContractPicture}
                                    width="100%"
                                    alt="Student Contract"
                                    style={{ marginBottom: '5px' }}
                                  />
                                )
                            ) : (
                              <p>
                                <em>
No file uploaded. (pdf, image files)
                                </em>
                              </p>
                            )}
                            {!teamMember.studentContractPicture ? (
                              <ReactFileReader
                                base64
                                fileTypes={['image/*', 'application/pdf']}
                                handleFiles={files => this.parseFile('studentContract', files)}
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm btn-info"
                                  style={{ width: '100%' }}
                                >
                                  Upload
                                </button>
                              </ReactFileReader>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => this.removePicture('studentContract')}
                                style={{ width: '100%' }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="col-xs-12 col-md-6">
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
                          </div>
                          <div className="col-xs-12 col-md-6">
                            <h6>
                              <em>
                                Picture
                                {teamMember.parentContractPicture && (
                                  <a
                                    role="button"
                                    onClick={() => {
                                      const win = window.open();
                                      win.document.write(
                                        `<iframe src="${
                                          teamMember.parentContractPicture
                                        }" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                                      );
                                    }}
                                  >
                                    {' - '}
                                    View Image
                                  </a>
                                )}
                                {fileNames.parentContract && (
                                  <p style={{ overflow: 'hidden' }}>
                                    {fileNames.parentContract}
                                  </p>
                                )}
                              </em>
                            </h6>
                            {teamMember.parentContractPicture ? (
                              base64MimeType(teamMember.parentContractPicture)
                              === 'application/pdf' ? (
                                <embed
                                  width="100%"
                                  height="200px"
                                  name="plugin"
                                  src={teamMember.parentContractPicture}
                                  type="application/pdf"
                                />
                                ) : (
                                  <img
                                    src={teamMember.parentContractPicture}
                                    width="100%"
                                    alt="Student Contract"
                                    style={{ marginBottom: '5px' }}
                                  />
                                )
                            ) : (
                              <p>
                                <em>
No file uploaded. (pdf, image files)
                                </em>
                              </p>
                            )}
                            {!teamMember.parentContractPicture ? (
                              <ReactFileReader
                                base64
                                fileTypes={['image/*', 'application/pdf']}
                                handleFiles={files => this.parseFile('parentContract', files)}
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm btn-info"
                                  style={{ width: '100%' }}
                                >
                                  Upload
                                </button>
                              </ReactFileReader>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => this.removePicture('parentContract')}
                                style={{ width: '100%' }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="col-xs-12 col-md-6">
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
                              <em
                                className={`fa fa-${teamMember.medicalForm ? 'check' : 'times'}`}
                              />
                              {' Medical Form'}
                            </button>
                          </div>
                          <div className="col-xs-12 col-md-6">
                            <h6>
                              <em>
                                Picture
                                {teamMember.medicalFormPicture && (
                                  <a
                                    role="button"
                                    onClick={() => {
                                      const win = window.open();
                                      win.document.write(
                                        `<iframe src="${
                                          teamMember.medicalFormPicture
                                        }" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
                                      );
                                    }}
                                  >
                                    {' - '}
                                    View Image
                                  </a>
                                )}
                                {fileNames.medicalForm && (
                                  <p style={{ overflow: 'hidden' }}>
                                    {fileNames.medicalForm}
                                  </p>
                                )}
                              </em>
                            </h6>
                            {teamMember.medicalFormPicture ? (
                              base64MimeType(teamMember.medicalFormPicture)
                              === 'application/pdf' ? (
                                <embed
                                  width="100%"
                                  height="200px"
                                  name="plugin"
                                  src={teamMember.medicalFormPicture}
                                  type="application/pdf"
                                />
                                ) : (
                                  <img
                                    src={teamMember.medicalFormPicture}
                                    width="100%"
                                    alt="Student Contract"
                                    style={{ marginBottom: '5px' }}
                                  />
                                )
                            ) : (
                              <p>
                                <em>
No file uploaded. (pdf, image files)
                                </em>
                              </p>
                            )}
                            {!teamMember.medicalFormPicture ? (
                              <ReactFileReader
                                base64
                                fileTypes={['image/*', 'application/pdf']}
                                handleFiles={files => this.parseFile('medicalForm', files)}
                              >
                                <button
                                  type="button"
                                  className="btn btn-sm btn-info"
                                  style={{ width: '100%' }}
                                >
                                  Upload
                                </button>
                              </ReactFileReader>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => this.removePicture('medicalForm')}
                                style={{ width: '100%' }}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                          <div className="col-xs-12">
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
                  <div className="col-md-4">
                    <div className="panel panel-default">
                      <div className="panel-heading">
Developer Info
                      </div>
                      <div className="panel-body">
                        <dl>
                          <dt>
_id
                          </dt>
                          <dd>
                            {teamMember._id}
                          </dd>
                        </dl>
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

MemberInfo.propTypes = {
  teamMember: PropTypes.object
};
