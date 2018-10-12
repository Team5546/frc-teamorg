import React from 'react';
import PropTypes from 'prop-types';
import camelcase from 'camelcase';

const Table = ({ columns, data, controls }) => (
  <table className="table">
    <thead>
      <tr>
        {columns.map(column => (
          <th key={column.name}>
            {column.name}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((entry, i) => (
        <tr key={`entry${i}`}>
          {columns.map(column => (
            <td key={`${column.key || camelcase(column.name)}`}>
              {column.type !== 'array'
                && column.type !== 'boolean'
                && entry[column.key || camelcase(column.name)]}
              {column.type === 'boolean' ? (
                <i
                  className={`fa fa-${
                    entry[column.key || camelcase(column.name)] ? 'check-circle' : 'times-circle'
                  }`}
                />
              ) : (
                column.type === 'array' && entry[column.key || camelcase(column.name)].join(', ')
              )}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

Table.defaultProps = {
  controls: undefined
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  controls: PropTypes.any
};

export default Table;
