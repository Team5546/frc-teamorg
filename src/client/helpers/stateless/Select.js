import React from 'react';
import PropTypes from 'prop-types';

const Select = ({
  id, value, onChange, options
}) => (
  <select id={id} className="form-control" value={value} onChange={onChange} required>
    <option value="none" disabled hidden>
      Please select a(n)
      {' '}
      {id}
      ...
    </option>
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>
        {opt.display || opt.value}
      </option>
    ))}
  </select>
);

Select.defaultProps = {
  id: '',
  onChange: () => console.log('Select changed!')
};

Select.propTypes = {
  id: PropTypes.string,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired
};

export default Select;
