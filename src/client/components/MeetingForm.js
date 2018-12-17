/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const MeetingForm = ({
  selectedMeeting, handleChange, cancel, editing, submitForm
}) => (
  <form
    onSubmit={(event) => {
      event.preventDefault();
      if (editing) submitForm(true);
      else submitForm(false);
    }}
    className="form"
  >
    <div className="form-row">
      <h4>
        <em className="fa fa-calendar" />
        {` - ${editing ? 'Editing' : 'Adding'} ${moment(selectedMeeting.date).format('MM/DD/YY')} ${
          selectedMeeting.subTeams.length === 6
            ? 'Entire Team Meeting'
            : `${selectedMeeting.subTeams
              .map(team => `${team.substring(0, 1).toUpperCase()}${team.substring(1)}`)
              .join(', ')} Meeting`
        }`}
      </h4>
      <div className="form-group col-md-6">
        <label htmlFor="calendar">
Date
        </label>
        <div id="calendar" />
      </div>
      <div className="form-group col-md-6">
        <label htmlFor="subTeams">
Sub Teams
        </label>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="subTeamsBuild"
              onChange={handleChange}
              checked={selectedMeeting.subTeams.indexOf('build') > -1}
            />
            Build Team
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="subTeamsProgramming"
              onChange={handleChange}
              checked={selectedMeeting.subTeams.indexOf('programming') > -1}
            />
            Programming Team
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="subTeamsPR"
              onChange={handleChange}
              checked={selectedMeeting.subTeams.indexOf('pr') > -1}
            />
            PR Team
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="subTeamsBusiness"
              onChange={handleChange}
              checked={selectedMeeting.subTeams.indexOf('business') > -1}
            />
            Business Team
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="subTeamsScouting"
              onChange={handleChange}
              checked={selectedMeeting.subTeams.indexOf('scouting') > -1}
            />
            Scouting Team
          </label>
        </div>

        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              id="subTeamsSafety"
              onChange={handleChange}
              checked={selectedMeeting.subTeams.indexOf('safety') > -1}
            />
            Safety Team
          </label>
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
