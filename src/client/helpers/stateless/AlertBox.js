import React from 'react';
import PropTypes from 'prop-types';

const AlertBox = ({
  condition, message, close, type
}) => (
  <React.Fragment>
    {condition && (
      <div className={`alert alert-${type} alert-dismissible fade show mb-0`} role="alert">
        {message}
        <button type="button" className="close" aria-label="Close" onClick={close}>
          <span aria-hidden="true">
&times;
          </span>
        </button>
      </div>
    )}
  </React.Fragment>
);

AlertBox.defaultProps = {
  condition: false,
  message: ''
};

AlertBox.propTypes = {
  condition: PropTypes.bool,
  message: PropTypes.string,
  close: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export default AlertBox;
