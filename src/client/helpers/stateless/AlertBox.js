import React from 'react';
import PropTypes from 'prop-types';

const AlertBox = ({
  condition, message, close, type
}) => (
  <React.Fragment>
    {condition && (
      <div className={`alert bg-${type}`} role="alert">
        <em className="fa fa-lg fa-warning">
&nbsp;
        </em>
        {message}
        <a href="#" onClick={close} className="pull-right">
          <em className="fa fa-lg fa-close" />
        </a>
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
