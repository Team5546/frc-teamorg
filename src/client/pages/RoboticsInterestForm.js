import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Page from '../components/Page';
import InterestForm from '../components/InterestForm';
import AlertBox from '../helpers/stateless/AlertBox';

const formatPhone = (phone) => {
  const phoneString = `${phone}`;
  let formattedPhone = '(___) ___-____';
  formattedPhone = formattedPhone.split('');
  formattedPhone[1] = phoneString.charAt(0) || ' ';
  formattedPhone[2] = phoneString.charAt(1) || ' ';
  formattedPhone[3] = phoneString.charAt(2) || ' ';
  formattedPhone[6] = phoneString.charAt(3) || ' ';
  formattedPhone[7] = phoneString.charAt(4) || ' ';
  formattedPhone[8] = phoneString.charAt(5) || ' ';
  formattedPhone[10] = phoneString.charAt(6) || ' ';
  formattedPhone[11] = phoneString.charAt(7) || ' ';
  formattedPhone[12] = phoneString.charAt(8) || ' ';
  formattedPhone[13] = phoneString.charAt(9) || ' ';
  return formattedPhone.join('');
};

const emailValid = (email) => {
  const emailRegex = /^([A-Za-z0-9_\-.+])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,})$/;
  return emailRegex.test(email);
};

export default class RoboticsInterestForm extends Component {
  constructor(props) {
    super(props);

    const { teamMember } = this.props;
    this.state = {
      teamMember: teamMember || {},
      errors: {},
      editing: props.editing || false
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
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
      if (event.target.id === 'parentPhone') {
        this.setState({
          teamMember: {
            ...teamMember,
            parentPhone: `${event.target.value}`,
            formattedParentPhone: formatPhone(event.target.value)
          },
          errors: { ...errors, parentPhone: event.target.value.length !== 10 }
        });
      }
      if (event.target.id === 'parentEmail') {
        this.setState({
          errors: { ...errors, parentEmail: !emailValid(event.target.value) }
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
      <Page>
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
