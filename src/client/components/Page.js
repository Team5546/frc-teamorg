import React from 'react';
import PropTypes from 'prop-types';

const Page = ({ title, children }) => (
  <React.Fragment>
    {title && (
    <h4>
      {title}
    </h4>
    )}
    <div className="container-fluid">
      {children}
    </div>
  </React.Fragment>
);

Page.defaultProps = {
  title: null
};

Page.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string
};

export default Page;
