/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import ReactFileReader from 'react-file-reader';
import Page from '../components/Page';
import Panel from '../helpers/stateless/Panel';

export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user
    };

    this.handleImage = this.handleImage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  handleImage(files) {
    const { user } = this.state;
    this.setState({ user: { ...user, image: files.base64 } });
  }

  handleChange(e) {
    const { user } = this.state;
    const { id } = e.target;
    console.log(id);
    user[id] = e.target.value;
    this.setState({ user });
  }

  submitForm(e) {
    e.preventDefault();
    const { user } = this.state;
    const { setPage } = this.props;
    axios.put(`/api/v1/users/${user._id}`, user).then(
      () => {
        setPage('dashboard');
        window.location.reload();
      },
      (err) => {
        this.setState({ errors: { err } });
      }
    );
  }

  render() {
    const { user } = this.state;
    return (
      <Page title="Account">
        <div className="row">
          <div className="col-md-12">
            <Panel title={`${user.firstName} ${user.lastName}`}>
              <form onSubmit={this.submitForm}>
                <div className="form-row">
                  <div className="form-group col-sm-6 col-md-4">
                    <label htmlFor="firstName">
First Name
                    </label>
                    <input
                      id="firstName"
                      className="form-control"
                      value={user.firstName || ''}
                      onChange={this.handleChange}
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="form-group col-sm-6 col-md-4">
                    <label htmlFor="lastName">
Last Name
                    </label>
                    <input
                      id="lastName"
                      className="form-control"
                      value={user.lastName || ''}
                      onChange={this.handleChange}
                      placeholder="Last Name"
                      required
                    />
                  </div>
                  <div className="form-group col-sm-6 col-md-4">
                    <label htmlFor="username">
Nickname
                    </label>
                    <input
                      id="username"
                      className="form-control"
                      value={user.username || ''}
                      onChange={this.handleChange}
                      placeholder="Nickname"
                    />
                  </div>
                  <div className="form-group col-sm-6 col-md-4">
                    <img
                      src={
                        user.image
                        || 'https://www.bsn.eu/wp-content/uploads/2016/12/user-icon-image-placeholder-300-grey.jpg'
                      }
                      width="150"
                      alt="User uploaded"
                    />
                  </div>
                  <div className="form-group col-sm-6 col-md-4">
                    <label htmlFor="username">
Profile Picture
                    </label>
                    <ReactFileReader base64 fileTypes="image/*" handleFiles={this.handleImage}>
                      <button type="button" className="btn btn-sm btn-info">
                        Upload
                      </button>
                    </ReactFileReader>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-sm-12">
                    <button type="submit" className="btn btn-sm btn-info">
                      <em className="fa fa-save" />
                      {' Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            </Panel>
          </div>
        </div>
      </Page>
    );
  }
}

Account.propTypes = {
  user: PropTypes.object.isRequired,
  setPage: PropTypes.func.isRequired
};
