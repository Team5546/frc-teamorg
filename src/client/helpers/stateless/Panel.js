import React from 'react';
import PropTypes from 'prop-types';

const Panel = ({ title, type, children, buttons, header }) => (
  <div className={`card bg-${type || 'light'} mb-3`}>
    {(title || buttons || header) && (
      <div className="card-header">
        <h3 className="w-auto d-inline">{title}</h3>
        {header}
        {buttons && (
          <div className="btn-group ml-auto float-right" role="group">
            {buttons.map(but => (
              <button
                type="button"
                className={`btn btn-${but.type || 'primary'}`}
                onClick={but.func}
                key={but.key || but.icon}
              >
                <em className={`fa fa-${but.icon}`} />
              </button>
            ))}
          </div>
        )}
      </div>
    )}
    <div className="card-body">{children}</div>
  </div>
);

Panel.defaultProps = {
  title: undefined,
  buttons: undefined,
  type: 'default',
  header: undefined
};

Panel.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.string,
  buttons: PropTypes.array,
  header: PropTypes.object
};

export default Panel;
