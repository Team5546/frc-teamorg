import React from 'react';
import PropTypes from 'prop-types';

const Panel = ({
  title, type, children, buttons
}) => (
  <div className={`panel panel-${type || 'default'}`}>
    <div className="panel-header">
      <div className="panel-heading">
        {title}
        {buttons
          && buttons.map(but => (
            <button type="button" className="pull-right btn btn-md btn-default" onClick={but.func}>
              <em className={`fa fa=${but.icon}`} />
            </button>
          ))}
      </div>
    </div>
    <div className="panel-body">
      {children}
    </div>
  </div>
);

Panel.defaultProps = {
  title: null,
  buttons: [],
  type: 'default'
};

Panel.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string,
  type: PropTypes.string,
  buttons: PropTypes.array
};

export default Panel;
