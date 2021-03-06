import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './styles/Landing.scss';
import phoneFormat from 'phone-formatter';
import InterestForm from '../components/InterestForm';
import Panel from '../helpers/stateless/Panel';

const emailValid = email => {
  const emailRegex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;
  return emailRegex.test(email);
};

export default class Landing extends Component {
  constructor() {
    super();

    this.state = {
      showLogin: false,
      showInterestForm: false,
      username: '',
      password: '',
      rememberMe: false,
      teamMember: { parents: [{}], subTeams: [] },
      errors: {}
    };

    this.handleChange = this.handleChange.bind(this);
    this.toggleInterestForm = this.toggleInterestForm.bind(this);
    this.toggleLogin = this.toggleLogin.bind(this);
    this.addParent = this.addParent.bind(this);
    this.removeParent = this.removeParent.bind(this);
    this.handleInterestFormParent = this.handleInterestFormParent.bind(this);
    this.handleInterestFormChange = this.handleInterestFormChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  toggleInterestForm() {
    const { showInterestForm } = this.state;
    this.setState({ showInterestForm: !showInterestForm });
  }

  toggleLogin() {
    const { showLogin } = this.state;
    this.setState({ showLogin: !showLogin });
  }

  handleChange(e) {
    const { id } = e.target;
    const loginInfo = {};
    loginInfo[id] = id === 'rememberMe' ? e.target.checked : e.target.value;
    this.setState({ ...loginInfo });
  }

  addParent() {
    const { teamMember } = this.state;
    teamMember.parents.push({});
    this.setState({ teamMember });
  }

  removeParent(i) {
    const { teamMember } = this.state;
    teamMember.parents.splice(i, 1);
    this.setState({ teamMember });
  }

  handleInterestFormParent(event) {
    const { teamMember, errors } = this.state;
    const { id } = event.target;
    let { value } = event.target;
    const index = parseInt(id[0], 10);
    if (id.includes('Phone')) {
      errors.parentPhone = value.length !== 10;
      value = phoneFormat.normalize(value);
    }
    if (id.includes('Email')) {
      errors.parentEmail = !emailValid(event.target.value);
    }

    const field = id.substring(id.indexOf('parent') + 6);
    const lowerField = field.substring(0, 1).toLowerCase() + field.substring(1);
    teamMember.parents[index][lowerField] = value;

    this.setState({
      teamMember,
      errors
    });
  }

  handleInterestFormChange(event) {
    const { teamMember, errors } = this.state;
    if (!event.target.id.includes('subTeams')) {
      this.setState({
        teamMember: { ...teamMember, [event.target.id]: event.target.value }
      });
      if (event.target.id === 'email') {
        // console.log(event.target.value.indexOf('@args.us'));
        this.setState({
          errors: { ...errors, email: event.target.value.indexOf('@args.us') === -1 }
        });
      }
    } else {
      const team = event.target.id.substring('subTeams'.length).toLowerCase();
      const subTeams = teamMember.subTeams || [];
      console.log(event.target.checked);
      if (event.target.checked) {
        subTeams.push(team);
      } else {
        subTeams.splice(subTeams.indexOf(team), 1);
      }
      this.setState({
        teamMember: { ...teamMember, subTeams }
      });
      console.log(subTeams);
    }
  }

  submitForm(event) {
    event.preventDefault();
    const { teamMember, errors, editing } = this.state;
    // console.log(teamMember);
    if (!editing) {
      axios.post('/api/v1/teamMembers', teamMember).then(
        () => {
          this.setState({ success: true });
          console.log('added team member');
        },
        err => {
          this.setState({ errors: { ...errors, ...err.response.data.errors } });
        }
      );
    } else {
      axios.put('/api/v1/teamMembers', teamMember).then(
        () => {
          this.setState({ success: true });
          console.log('updated team member');
        },
        err => {
          this.setState({ errors: { ...errors, ...err.response.data.errors } });
        }
      );
    }
  }

  render() {
    const {
      username,
      password,
      rememberMe,
      showLogin,
      showInterestForm,
      teamMember,
      errors,
      success
    } = this.state;
    const { login } = this.props;
    return (
      <React.Fragment>
        {!showLogin && !showInterestForm && (
          <React.Fragment>
            <div className="hero d-flex justify-content-center align-items-center">
              <h1 className="display-4 text-white align-center">WELCOME TO TEAM ORG</h1>
            </div>
            <div className="row d-flex align-items-center" style={{ marginTop: '3rem' }}>
              <div className="col col-md-5 offset-md-1">
                <Panel>
                  <h1>FRC Team 5546 A.R.T.</h1>
                  <p>
                    Welcome to FRC TeamOrg. If you are not on the team, you can fill out the
                    interest form. If you are team leadership, please ensure you have an account,
                    then login. If there are any issues, please contact{' '}
                    <a href="mailto:bradley@argsrobotics.com">webmail@argsrobotics.com</a>.
                  </p>
                </Panel>
              </div>
              <div className="col col-md-5 d-flex justify-content-center align-items-center">
                <div className="btn-group btn-group-lg" role="group" aria-label="User Actions">
                  <button
                    type="button"
                    className="btn btn-lg btn-info"
                    title="Interest Form"
                    onClick={this.toggleInterestForm}
                  >
                    <em className="fab fa-wpforms">&nbsp;</em>
                    Interest Form
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg btn-default"
                    title="Interest Form"
                    onClick={this.toggleLogin}
                  >
                    <em className="fa fa-sign-in-alt">&nbsp;</em>
                    Login
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
        {showLogin && (
          <React.Fragment>
            <div className="col-12 col-md-6 offset-md-3">
              <br />
            </div>
            <div className="col-12 col-md-6 offset-md-3">
              <button type="button" className="btn btn-default" onClick={this.toggleLogin}>
                <em className="fa fa-chevron-left">&nbsp;</em>
                Back
              </button>
            </div>
            <div className="col-12 col-md-6 offset-md-3">
              <hr />
              <Panel title="Log in">
                <form onSubmit={e => login(e, this.state)}>
                  <fieldset>
                    <div className="form-group">
                      <input
                        className="form-control"
                        placeholder="Username"
                        name="username"
                        type="text"
                        id="username"
                        value={username}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        id="password"
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-check">
                      <input
                        name="rememberMe"
                        id="rememberMe"
                        className="form-check-input"
                        type="checkbox"
                        value="Remember Me"
                        checked={rememberMe}
                        onChange={this.handleChange}
                      />
                      <label htmlFor="rememberMe" className="form-check=label">
                        Remember Me
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </fieldset>
                </form>
              </Panel>
            </div>
          </React.Fragment>
        )}
        {showInterestForm && !success && (
          <div className="row">
            <div className="col-12">
              <br />
            </div>
            <div className="col-10 offset-1">
              <button type="button" className="btn btn-default" onClick={this.toggleInterestForm}>
                <em className="fa fa-chevron-left">&nbsp;</em>
                Back
              </button>
            </div>
            <div className="col-10 offset-1">
              <hr />
              <InterestForm
                submitForm={this.submitForm}
                teamMember={teamMember}
                handleChange={this.handleInterestFormChange}
                handleParent={this.handleInterestFormParent}
                addParent={this.addParent}
                removeParent={this.removeParent}
                errors={errors}
              />
            </div>
          </div>
        )}
        {success && (
          <div className="row">
            <div className="col-10 offset-1">
              <Panel>
                <h4>
                  Thanks for filling out the interest form. We will be in contact with you soon.
                </h4>
              </Panel>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

Landing.defaultProps = {
  login: () => console.log('login')
};

Landing.propTypes = {
  login: PropTypes.func
};
