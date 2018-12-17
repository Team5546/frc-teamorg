import React, { Component } from 'react';
import axios from 'axios';
import phoneFormat from 'phone-formatter';
import PropTypes from 'prop-types';
import Page from '../components/Page';
import InterestForm from '../components/InterestForm';
import AlertBox from '../helpers/stateless/AlertBox';

const emailValid = (email) => {
  const emailRegex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;
  return emailRegex.test(email);
};

export default class RoboticsInterestForm extends Component {
  constructor(props) {
    super(props);

    const { teamMember } = this.props;
    this.state = {
      teamMember: teamMember || { parents: [{}], subTeams: [] },
      errors: {},
      editing: props.editing || false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleParent = this.handleParent.bind(this);
    this.addParent = this.addParent.bind(this);
    this.removeParent = this.removeParent.bind(this);
    this.submitForm = this.submitForm.bind(this);
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

  handleParent(event) {
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

  handleChange(event) {
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
        (err) => {
          this.setState({ errors: { ...errors, ...err.response.data.errors } });
        }
      );
    } else {
      axios.put('/api/v1/teamMembers', teamMember).then(
        () => {
          this.setState({ success: true });
          console.log('updated team member');
        },
        (err) => {
          this.setState({ errors: { ...errors, ...err.response.data.errors } });
        }
      );
    }
  }

  render() {
    const { teamMember, errors, success } = this.state;
    return (
      <Page title="Interest Form">
        {errors.code === 101 || success ? (
          <h3 className="w-75 mx-auto text-center">
            {errors.code === 101
              ? 'You seem to have already submitted this form. If this is a mistake, please contact support or retry the form.'
              : 'Thanks for submitting the interest form. Please keep an eye on your email.'}
          </h3>
        ) : (
          <React.Fragment>
            <AlertBox
              condition={errors.message}
              message={errors.message}
              close={() => this.setState({ errors: { ...errors, message: undefined } })}
              type="danger"
            />
            <br />
            <InterestForm
              submitForm={this.submitForm}
              teamMember={teamMember}
              handleChange={this.handleChange}
              handleParent={this.handleParent}
              addParent={this.addParent}
              removeParent={this.removeParent}
              errors={errors}
            />
          </React.Fragment>
        )}
      </Page>
    );
  }
}

RoboticsInterestForm.defaultProps = {
  teamMember: undefined,
  editing: false
};

RoboticsInterestForm.propTypes = {
  teamMember: PropTypes.object,
  editing: PropTypes.bool
};
