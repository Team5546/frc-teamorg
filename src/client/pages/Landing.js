import React from 'react';
import PropTypes from 'prop-types';
import './styles/Landing.scss';

const Landing = ({ teamNum }) => (
  <div className="container-fluid">
    <div className="row hero">
      <div className="col d-flex align-items-center justify-items-center">
        <div className="d-inline">
          <h1 className="display-1">
            <span className="text-white">
              Team
              {` ${teamNum}`}
            </span>
          </h1>
          <h3>
            <span className="text-white">
              <em>
Team Management System
              </em>
            </span>
          </h3>
        </div>
      </div>
      <div className="col d-flex align-items-center justify-items-center">
        <h4 className="w-100 text-center">
          <span className="text-white">
            <em>
Please Login To Continue.
            </em>
          </span>
        </h4>
      </div>
    </div>
  </div>
);

Landing.propTypes = {
  teamNum: PropTypes.number.isRequired
};

export default Landing;
