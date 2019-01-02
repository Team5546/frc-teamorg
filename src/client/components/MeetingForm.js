/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const MeetingForm = ({ selectedMeeting, handleChange, cancel, editing, submitForm }) => (
  <form
    onSubmit={event => {
      event.preventDefault();
      submitForm(editing);
    }}
    className="form"
  >
    <div className="form-row">
      <div className="form-group col-md-6">
        <label htmlFor="calendar">Date</label>
        <div id="calendar" />
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="subTeams">Sub Teams</label>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="subTeamsBuild"
            onChange={handleChange}
            checked={selectedMeeting.subTeams.indexOf('build') > -1}
          />
          <label htmlFor="subTeamsBuild">Build Team</label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="subTeamsProgramming"
            onChange={handleChange}
            checked={selectedMeeting.subTeams.indexOf('programming') > -1}
          />
          <label htmlFor="subTeamsProgramming">Programming Team</label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="subTeamsPR"
            onChange={handleChange}
            checked={selectedMeeting.subTeams.indexOf('pr') > -1}
          />
          <label htmlFor="subTeamsPR">PR Team</label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="subTeamsBusiness"
            onChange={handleChange}
            checked={selectedMeeting.subTeams.indexOf('business') > -1}
          />
          <label htmlFor="subTeamsBusiness">Business Team</label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="subTeamsScouting"
            onChange={handleChange}
            checked={selectedMeeting.subTeams.indexOf('scouting') > -1}
          />
          <label htmlFor="subTeamsScouting">Scouting Team</label>
        </div>

        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="subTeamsSafety"
            onChange={handleChange}
            checked={selectedMeeting.subTeams.indexOf('safety') > -1}
          />
          <label htmlFor="subTeamsSafety">Safety Team</label>
        </div>
        <div className="btn-group full-width" role="group" aria-label="Basic example">
          <button type="submit" className="btn btn-sm btn-info">
            Submit
          </button>
          <button type="button" className="btn btn-sm btn-default" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </form>
);

MeetingForm.defaultProps = {
  selectedMeeting: {},
  editing: false
};

MeetingForm.propTypes = {
  selectedMeeting: PropTypes.object,
  submitForm: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  editing: PropTypes.bool
};

export default MeetingForm;
