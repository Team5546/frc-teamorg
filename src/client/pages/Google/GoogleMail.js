/* eslint-disable react/no-string-refs, jsx-a11y/anchor-is-valid,
  no-restricted-syntax, jsx-a11y/click-events-have-key-events,
  jsx-a11y/interactive-supports-focus, no-nested-ternary */
import React, { Component } from 'react';
import axios from 'axios';
import Page from '../../components/Page';
import AlertBox from '../../helpers/stateless/AlertBox';
import Panel from '../../helpers/stateless/Panel';

export default class GoogleAdmin extends Component {
  constructor() {
    super();

    this.state = {
      missingDocs: {
        members: [],
        errors: undefined,
        success: undefined
      }
    };

    this.getMissingDocsMembers();

    this.sendMissingDocsEmail = this.sendMissingDocsEmail.bind(this);
  }

  getMissingDocsMembers() {
    axios.get('/api/v1/teamMembers').then(
      response => {
        const missingDocsMembers = response.data.filter(
          member =>
            !member.studentContract ||
            !member.parentContract ||
            !member.medicalForm ||
            !member.duesPaid
        );
        this.setState({ missingDocs: { members: missingDocsMembers } });
      },
      err => {
        this.setState({
          errors: { ...err, message: 'Unknow error occured while loading team members.' }
        });
      }
    );
  }

  sendMissingDocsEmail() {
    const { missingDocs } = this.state;
    const { members } = missingDocs;
    const membersToSend = members.map(m => ({ ...m, name: `${m.firstName} ${m.lastName}` }));
    const testing = true;
    if (testing) {
      axios.get('/api/v1/teamMembers/5c171077365ec2c575a46886').then(response => {
        const testMembers = [
          { ...response.data, name: `${response.data.firstName} ${response.data.lastName}` },
          { name: 'Admin Test', email: 'bradley@argsrobotics.com' }
        ];
        axios.put('/api/v1/google/sendMissingDocsEmail', testMembers).then(res => {
          this.setState({ missingDocs: { ...missingDocs, response: res.data, showAlert: true } });
        });
      });
    } else {
      axios.put('/api/v1/google/sendMissingDocsEmail', membersToSend).then(res => {
        this.setState({ missingDocs: { ...missingDocs, response: res.data, showAlert: true } });
      });
    }
  }

  render() {
    const { missingDocs, errors } = this.state;
    return (
      <Page title="Google Mail">
        <AlertBox
          condition={errors}
          message={errors && errors.message}
          close={() => this.setState({ errors: undefined })}
          type="danger"
        />
        <Panel
          title="Email Members With Missing Forms or Dues"
          type={
            ((!missingDocs.showAlert || !missingDocs.response) && 'default') ||
            (missingDocs.showAlert &&
            missingDocs.response &&
            missingDocs.response.errorList.length > 0
              ? 'danger'
              : 'success')
          }
          buttons={[
            {
              type: 'info',
              func: this.sendMissingDocsEmail,
              icon: 'mail-bulk'
            }
          ]}
        >
          <AlertBox
            condition={missingDocs.showAlert}
            message={missingDocs.response && missingDocs.response.message}
            close={() => this.setState({ missingDocs: { ...missingDocs, showAlert: undefined } })}
            type="primary"
          />
          <table
            className="table"
            style={{
              display: 'block',
              maxHeight: 300,
              overflow: 'scroll',
              boxShadow: 'inset 0px -68px 79px -67px rgba(235, 235, 235, 0.8)'
            }}
          >
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {missingDocs.members.map(member => (
                <tr key={member.firstName + member.lastName}>
                  <td className="o-hidden">{`${member.firstName} ${member.lastName}`}</td>
                  <td className="o-hidden">{member.email}</td>
                  <td className="o-hidden">
                    {!missingDocs.response ? (
                      <span>
                        <em className="fa fa-question-circle">&nbsp;</em>
                        Not Queued
                      </span>
                    ) : (
                      ''
                    )}
                    {missingDocs.response &&
                    missingDocs.response.sentTo.indexOf(member.email) !== -1 ? (
                      <span className="text-success">
                        <em className="fa fa-check-circle">&nbsp;</em>
                        Success
                      </span>
                    ) : (
                      ''
                    )}
                    {missingDocs.response &&
                    missingDocs.response.errorList.indexOf(member.email) !== -1 ? (
                      <span className="text-danger">
                        <em className="fa fa-times-circle">&nbsp;</em>
                        Error
                      </span>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </Page>
    );
  }
}
