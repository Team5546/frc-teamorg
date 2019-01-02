/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import Select from '../helpers/stateless/Select';
import Panel from '../helpers/stateless/Panel';

const InterestForm = ({
  submitForm,
  teamMember,
  handleChange,
  errors,
  handleParent,
  addParent,
  removeParent
}) => (
  <form name="interestForm" onSubmit={submitForm}>
    <div className="mb-3">
      <Panel title="Student Info">
        <div className="form-row">
          <div className="form-group col-sm-6 col-md-4">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              className="form-control"
              value={teamMember.firstName || ''}
              onChange={handleChange}
              placeholder="First Name"
              required
              autoFocus
            />
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              className="form-control"
              value={teamMember.lastName || ''}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label htmlFor="nickname">Nickname</label>
            <input
              id="nickname"
              className="form-control"
              value={teamMember.nickname || ''}
              onChange={handleChange}
              placeholder="Nickname"
            />
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={teamMember.email || ''}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <small id="passwordHelpBlock" className="form-text">
              Must use your ARGS email. <em>e.g. example@args.us</em>
            </small>
            <div className="invalid-feedback" hidden={!errors.email}>
              Please provide an ARGS email.
            </div>
          </div>
          <div className="form-group col-sm-6 col-md-4">
            <label htmlFor="grade">Grade</label>
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
          <div className="form-group col-sm-6 col-md-4">
            <label htmlFor="major">Major</label>
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
      </Panel>
    </div>
    <div className="mb-3">
      <Panel title="Parent Info">
        {teamMember.parents.map((parent, i) => (
          <div className="form-row" key={`parent${parent.firstName || ''}${parent.lastName || ''}`}>
            <div className="col-md-11">
              <h4>{`Parent ${i + 1} - ${parent.firstName || ''} ${parent.lastName || ''}`}</h4>
            </div>
            <div className="col-md-1">
              {i > 0 && (
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeParent(i)}
                >
                  <em className="fa fa-times" />
                </button>
              )}
            </div>
            <div className="form-group col-md-6">
              <label htmlFor={`${i}parentFirstName`}>First Name</label>
              <input
                id={`${i}parentFirstName`}
                className="form-control"
                value={teamMember.parents[i].firstName || ''}
                onChange={handleParent}
                placeholder="First Name"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor={`${i}parentLastName`}>Last Name</label>
              <input
                id={`${i}parentLastName`}
                className="form-control"
                value={teamMember.parents[i].lastName || ''}
                onChange={handleParent}
                placeholder="Last Name"
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label htmlFor={`${i}parentPhone`}>Phone</label>
              <input
                id={`${i}parentPhone`}
                className="form-control"
                value={teamMember.parents[i].phone || ''}
                onChange={handleParent}
                placeholder="Phone"
                required
              />
              <small>
                <em>Auto formats after entry</em>
              </small>
            </div>
            <div className={`form-group col-md-6${errors.parentEmail ? ' has-error' : ''}`}>
              <label htmlFor={`${i}parentEmail`}>Email</label>
              <input
                type="email"
                id={`${i}parentEmail`}
                className="form-control"
                value={teamMember.parents[i].email || ''}
                onChange={handleParent}
                placeholder="Email"
                required
              />
              <small id="parentEmailHelpBlock" className="form-text text-muted">
                <em>e.g. example@example.com</em>
              </small>
              <div className="invalid-feedback" hidden={!errors.parentEmail}>
                Please provide a valid email.
              </div>
            </div>
          </div>
        ))}
        <div className="form-row">
          <div className="form-group col-md-3">
            <button type="button" className="btn btn-sm btn-info" onClick={addParent}>
              <em className="fa fa-plus" />
              {' Add Parent'}
            </button>
          </div>
        </div>
      </Panel>
    </div>
    <div className="mb-3">
      <Panel title="Address Info">
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="address1">Address</label>
            <input
              id="address1"
              className="form-control"
              value={teamMember.address1 || ''}
              onChange={handleChange}
              placeholder="Address"
              required
            />
            <small id="addressHelpBlock" className="form-text text-muted">
              <em>e.g. 888 Example St.</em>
            </small>
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="address2">Address 2</label>
            <input
              id="address2"
              className="form-control"
              value={teamMember.address2 || ''}
              onChange={handleChange}
              placeholder="Address 2"
            />
            <small id="address2HelpBlock" className="form-text text-muted">
              <em>e.g. Suite 101, Apt. E, etc.</em>
            </small>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="city">City</label>
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
            <label htmlFor="state">State</label>
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
              <em>Only Virginia Allowed</em>
            </small>
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="zipCode">Zip Code</label>
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
      </Panel>
    </div>
    <div className="mb-3">
      <Panel title="Sub Teams">
        <div className="form-row">
          <div className="form-group col-md-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                onChange={handleChange}
                checked={teamMember.subTeams.indexOf('build') > -1}
                id="subTeamsBuild"
              />
              <label className="form-check-label" htmlFor="subTeamsBuild">
                Build Team
              </label>
            </div>
          </div>
          <div className="form-group col-md-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="subTeamsProgramming"
                onChange={handleChange}
                checked={teamMember.subTeams.indexOf('programming') > -1}
              />
              <label className="form-check-label" htmlFor="subTeamsProgramming">
                Programming Team
              </label>
            </div>
          </div>
          <div className="form-group col-md-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="subTeamsPR"
                onChange={handleChange}
                checked={teamMember.subTeams.indexOf('pr') > -1}
              />
              <label className="form-check-label" htmlFor="subTeamsPR">
                PR Team
              </label>
            </div>
          </div>
          <div className="form-group col-md-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="subTeamsBusiness"
                onChange={handleChange}
                checked={teamMember.subTeams.indexOf('business') > -1}
              />
              <label className="form-check-label" htmlFor="subTeamsBusiness">
                Business Team
              </label>
            </div>
          </div>
          <div className="form-group col-md-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="subTeamsScouting"
                onChange={handleChange}
                checked={teamMember.subTeams.indexOf('scouting') > -1}
              />
              <label className="form-check-label" htmlFor="subTeamsScouting">
                Scouting Team
              </label>
            </div>
          </div>
          <div className="form-group col-md-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="subTeamsSafety"
                onChange={handleChange}
                checked={teamMember.subTeams.indexOf('safety') > -1}
              />
              <label className="form-check-label" htmlFor="subTeamsSafety">
                Safety Team
              </label>
            </div>
          </div>
        </div>
      </Panel>
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
  handleParent: PropTypes.func.isRequired,
  addParent: PropTypes.func.isRequired,
  removeParent: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default InterestForm;
