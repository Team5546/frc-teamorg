/* eslint-disable react/no-string-refs, jsx-a11y/anchor-is-valid,
  no-restricted-syntax, jsx-a11y/click-events-have-key-events,
  jsx-a11y/interactive-supports-focus, no-nested-ternary */
import React, { Component } from 'react';
import axios from 'axios';
import Page from '../../components/Page';
import NavContext from '../../NavContext';
import AlertBox from '../../helpers/stateless/AlertBox';
import Panel from '../../helpers/stateless/Panel';

export default class GoogleAdmin extends Component {
  constructor() {
    super();

    this.state = {
      groups: []
    };

    this.getGoogleGroups();
  }

  getGoogleGroups() {
    axios.get('/api/v1/google/groups').then(
      response => {
        // console.log(response.data);
        this.setState({ groups: response.data });
      },
      err => {
        this.setState({ errors: { ...err, message: 'Unknow error occured.' } });
      }
    );
  }

  render() {
    const { groups, errors } = this.state;
    return (
      <NavContext.Consumer>
        {({ setPage }) => (
          <Page title="Google Admin">
            <AlertBox
              condition={errors}
              message={errors && errors.message}
              close={() => this.setState({ errors: undefined })}
              type="danger"
            />
            <Panel title="Groups">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Members</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {groups.map(group => (
                    <tr key={group.name}>
                      <td className="o-hidden">{group.name}</td>
                      <td className="o-hidden">{group.email}</td>
                      <td className="o-hidden">{group.directMembersCount}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-info"
                          onClick={() => setPage('googleGroup', { groupId: group.id })}
                        >
                          <i className="fa fa-info" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </Page>
        )}
      </NavContext.Consumer>
    );
  }
}
