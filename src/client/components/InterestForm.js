/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import Select from '../helpers/stateless/Select';

const InterestForm = ({
  submitForm, teamMember, handleChange, errors
}) => (
  <form onSubmit={submitForm}>
    <h5>
Student Info
    </h5>
    <hr />
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="firstName">
First Name
        </label>
        <input
          id="firstName"
          className="form-control"
          value={teamMember.firstName || ''}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="lastName">
Last Name
        </label>
        <input
          id="lastName"
          className="form-control"
          value={teamMember.lastName || ''}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="nickname">
Nickname
        </label>
        <input
          id="nickname"
          className="form-control"
          value={teamMember.nickname || ''}
          onChange={handleChange}
          placeholder="Nickname"
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="email">
Email
        </label>
        <input
          type="email"
          id="email"
          className={`form-control${errors.email ? ' is-invalid' : ''}`}
          value={teamMember.email || ''}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <small id="passwordHelpBlock" className="form-text text-muted">
          Must use your ARGS email.
          {' '}
          <em>
e.g. example@args.us
          </em>
        </small>
        <div className="invalid-feedback">
Please provide an ARGS email.
        </div>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="grade">
Grade
        </label>
        <Select
          id="grade"
          value={teamMember.grade || 'none'}
          onChange={handleChange}
          options={[
            { value: 9, display: 'Freshman (9th)' },
            { value: 10, display: 'Sophomore (10th)' },
            { value: 11, display: 'Junior (11th)' },
            { value: 12, display: 'Senior (12th)' }
          ]}
        />
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="major">
Major
        </label>
        <Select
          id="major"
          value={teamMember.major || 'none'}
          onChange={handleChange}
          options={[
            { value: 'Technology' },
            { value: 'Music' },
            { value: 'Theater' },
            { value: 'Visual Arts' },
            { value: 'Literary Arts' },
            { value: 'Dance' }
          ]}
        />
      </div>
    </div>
    <h5>
Parent Info
    </h5>
    <hr />
    <div className="form-row">
      <div className="form-group col-md-6">
        <label htmlFor="parentFirstName">
First Name
        </label>
        <input
          id="parentFirstName"
          className="form-control"
          value={teamMember.parentFirstName || ''}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="parentLastName">
Last Name
        </label>
        <input
          id="parentLastName"
          className="form-control"
          value={teamMember.parentLastName || ''}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
      </div>
    </div>
    <div className="form-row">
      <div className="form-group col-md-6">
        <label htmlFor="parentPhone">
Phone Number
        </label>
        <input
          type="tel"
          id="parentPhone"
          className={`form-control${errors.parentPhone ? ' is-invalid' : ''}`}
          value={teamMember.parentPhone || ''}
          onChange={handleChange}
          placeholder="8888888888"
          pattern="\d*"
          maxLength="10"
          required
        />
        <small id="parentPhoneHelpBlock" className="form-text text-muted">
          <em>
            {teamMember.formattedParentPhone || '(888) 888-8888'}
          </em>
        </small>
        <div className="invalid-feedback">
Please provide a valid phone number
        </div>
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="parentEmail">
Email
        </label>
        <input
          type="email"
          id="parentEmail"
          className={`form-control${errors.parentEmail ? ' is-invalid' : ''}`}
          value={teamMember.parentEmail || ''}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <small id="parentEmailHelpBlock" className="form-text text-muted">
          <em>
e.g. example@example.com
          </em>
        </small>
        <div className="invalid-feedback">
Please provide a valid email.
        </div>
      </div>
    </div>
    <h5>
Address Info
    </h5>
    <hr />
    <div className="form-row">
      <div className="form-group col-md-6">
        <label htmlFor="address1">
Address
        </label>
        <input
          id="address1"
          className="form-control"
          value={teamMember.address1 || ''}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <small id="addressHelpBlock" className="form-text text-muted">
          <em>
e.g. 888 Example St.
          </em>
        </small>
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="address2">
Address 2
        </label>
        <input
          id="address2"
          className="form-control"
          value={teamMember.address2 || ''}
          onChange={handleChange}
          placeholder="Address 2"
        />
        <small id="address2HelpBlock" className="form-text text-muted">
          <em>
e.g. Suite 101, Apt. E, etc.
          </em>
        </small>
      </div>
    </div>
    <div className="form-row">
      <div className="form-group col-md-4">
        <label htmlFor="city">
City
        </label>
        <input
          id="city"
          className="form-control"
          value={teamMember.city || ''}
          onChange={handleChange}
          placeholder="City"
          required
        />
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="state">
State
        </label>
        <input
          id="state"
          className="form-control"
          value={teamMember.state || 'VA'}
          onChange={handleChange}
          placeholder="State"
          required
          readOnly
        />
        <small id="address2HelpBlock" className="form-text text-muted">
          <em>
Only Virginia Allowed
          </em>
        </small>
      </div>
      <div className="form-group col-md-4">
        <label htmlFor="zipCode">
Zip Code
        </label>
        <input
          id="zipCode"
          className="form-control"
          value={teamMember.zipCode || ''}
          onChange={handleChange}
          placeholder="Zip Code"
          required
        />
      </div>
    </div>
    <h5>
Sub Teams
    </h5>
    <hr />
    <div className="form-row">
      <div className="form-group col-md-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="subTeamsBuild"
            onChange={handleChange}
          />
          <label className="custom-control-label" htmlFor="subTeamsBuild">
            Build Team
          </label>
        </div>
      </div>
      <div className="form-group col-md-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="subTeamsProgramming"
            onChange={handleChange}
          />
          <label className="custom-control-label" htmlFor="subTeamsProgramming">
            Programming Team
          </label>
        </div>
      </div>
      <div className="form-group col-md-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="subTeamsPR"
            onChange={handleChange}
          />
          <label className="custom-control-label" htmlFor="subTeamsPR">
            PR Team
          </label>
        </div>
      </div>
      <div className="form-group col-md-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="subTeamsBusiness"
            onChange={handleChange}
          />
          <label className="custom-control-label" htmlFor="subTeamsBusiness">
            Business Team
          </label>
        </div>
      </div>
      <div className="form-group col-md-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="subTeamsScouting"
            onChange={handleChange}
          />
          <label className="custom-control-label" htmlFor="subTeamsScouting">
            Scouting Team
          </label>
        </div>
      </div>
      <div className="form-group col-md-3">
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            id="subTeamsSafety"
            onChange={handleChange}
          />
          <label className="custom-control-label" htmlFor="subTeamsSafety">
            Safety Team
          </label>
        </div>
      </div>
    </div>
    <div className="form-group-row">
      <div className="form-group">
        <button type="submit" className="btn btn-block btn-primary">
          Submit
        </button>
      </div>
    </div>
  </form>
);

InterestForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  teamMember: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default InterestForm;
