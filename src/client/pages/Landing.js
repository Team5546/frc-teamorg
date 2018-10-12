import React from 'react';
import PropTypes from 'prop-types';
import './styles/Landing.scss';

const Landing = ({ teamNum, setPage }) => (
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
      <div className="col d-flex flex-column justify-content-center">
        <h4 className="w-100 text-center d-block mb-3">
          <span className="text-white">
            <em>
Please Login To Continue
            </em>
          </span>
        </h4>
        <h4 className="w-100 text-center d-block mb-3">
          <span className="text-white">
            <em>
or
            </em>
          </span>
        </h4>
        <button
          type="button"
          onClick={() => setPage('interestForm')}
          className="btn btn-outline-link"
        >
          Fill out the Interest Form
        </button>
      </div>
    </div>
  </div>
);

Landing.propTypes = {
  teamNum: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired
};

export default Landing;
