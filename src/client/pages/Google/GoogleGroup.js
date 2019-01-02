/* eslint-disable react/no-string-refs, jsx-a11y/anchor-is-valid,
  no-restricted-syntax, jsx-a11y/click-events-have-key-events,
  jsx-a11y/interactive-supports-focus, no-nested-ternary */
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Page from '../../components/Page';
import NavContext from '../../NavContext';
import AlertBox from '../../helpers/stateless/AlertBox';
import Panel from '../../helpers/stateless/Panel';

export default class GoogleGroups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
      editing: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.updateGroup = this.updateGroup.bind(this);

    this.getGroup(props.groupId);
  }

  getGroup(id) {
    axios.get(`/api/v1/google/groups/${id}`).then(
      response => {
        // console.log(response.data);
        this.setState({ group: response.data });
      },
      err => {
        this.setState({ errors: { ...err, message: 'Unknow error occured.' } });
      }
    );
  }

  handleChange(e) {
    const { id } = e.target;
    const { group } = this.state;
    group[id] = e.target.value;
    this.setState({ group });
  }

  updateGroup(e) {
    e.preventDefault();
    const { group } = this.state;
    axios.put(`/api/v1/google/groups/${group.id}`, group).then(
      response => {
        // console.log({ ...group, ...response.data });
        this.setState({ group: { ...group, ...response.data }, editing: false });
      },
      err => {
        this.setState({ ...err });
      }
    );
  }

  render() {
    const { group, errors, editing, groupBak } = this.state;
    return (
      <NavContext.Consumer>
        {({ setPage }) => (
          <Page title={group.name}>
            <AlertBox
              condition={errors}
              message={errors && errors.message}
              close={() => this.setState({ errors: undefined })}
              type="danger"
            />
            <div className="row">
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-small btn-default"
                  onClick={() => setPage('googleAdmin')}
                >
                  <em className="fa fa-angle-left" />
                </button>
              </div>
            </div>
            <hr />
            <Panel
              title="Group Info"
              buttons={
                !editing
                  ? [
                      {
                        type: 'default',
                        func: () =>
                          this.setState({ groupBak: Object.assign({}, group), editing: true }),
                        icon: 'pencil-alt'
                      }
                    ]
                  : []
              }
            >
              {editing ? (
                <form onSubmit={this.updateGroup}>
                  <div className="form-row">
                    <div className="form-group col-sm-6">
                      <label htmlFor="name">Name</label>
                      <input
                        id="name"
                        className="form-control"
                        value={group.name || ''}
                        onChange={this.handleChange}
                        placeholder="Name"
                        required
                      />
                    </div>
                    <div className="form-group col-sm-6">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        className="form-control"
                        value={group.email || ''}
                        onChange={this.handleChange}
                        placeholder="Email"
                        required
                      />
                    </div>
                    <div className="form-group col-sm-12">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        className="form-control"
                        value={group.description || ''}
                        onChange={this.handleChange}
                        placeholder="Description"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-sm-12">
                      <div className="btn-group" role="group" aria-label="Controls">
                        <button type="submit" className="btn btn-sm btn-info">
                          <em className="fa fa-save">&nbsp;</em>
                          Save Changes
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-default"
                          onClick={() => this.setState({ group: groupBak, editing: false })}
                        >
                          <em className="fa fa-times">&nbsp;</em>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <dl>
                  <dt>Name</dt>
                  <dl>{group.name}</dl>
                  <dt>Email</dt>
                  <dl>{group.email}</dl>
                  <dt>Description</dt>
                  <dl>{group.description}</dl>
                </dl>
              )}
            </Panel>
            <Panel title="Members">
              {!group.members && 'No members.'}
              {group.members && (
                <table className="table">
                  <thead>
                    <tr>
                      <td>Email</td>
                      <td>Role</td>
                    </tr>
                  </thead>
                  <tbody>
                    {group.members.map(member => (
                      <tr key={member.id}>
                        <td>{member.email}</td>
                        <td
                          className={`${member.role === 'OWNER' ? 'text-success' : ''}${
                            member.role === 'MANAGER' ? 'text-info' : ''
                          }`}
                          style={{
                            textDecoration:
                              member.role === 'OWNER' || member.role === 'MANAGER'
                                ? 'underline'
                                : 'none',
                            fontWeight:
                              member.role === 'OWNER' || member.role === 'MANAGER' ? 'bold' : 'none'
                          }}
                        >
                          {`${member.role.substring(0, 1)}${member.role
                            .toLowerCase()
                            .substring(1)}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Panel>
          </Page>
        )}
      </NavContext.Consumer>
    );
  }
}

GoogleGroups.propTypes = {
  groupId: PropTypes.string.isRequired
};
