import React from 'react';
import PropTypes from 'prop-types';

const DashboardCard = ({ title, content, children }) => (
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">
        {title}
      </h5>
      <p className="card-text">
        {content || children}
      </p>
    </div>
  </div>
);

DashboardCard.defaultProps = {
  content: null,
  children: null
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.any,
  children: PropTypes.any
};

export default DashboardCard;
