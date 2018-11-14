import React from 'react';
import PropTypes from 'prop-types';
import camelcase from 'camelcase';
import NavContext from '../../NavContext';

const Table = ({ columns, data, controls }) => (
  <NavContext.Consumer>
    {({ setPage }) => (
      <table className="table">
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.name} className={column.name === 'controls' ? 'col-md-auto' : ''}>
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
                  {column.type === 'boolean' && (
                    <i
                      className={`fa fa-${
                        entry[column.key || camelcase(column.name)]
                          ? 'check-circle'
                          : 'times-circle'
                      }`}
                    />
                  )}
                  {column.type === 'array'
                    && entry[column.key || camelcase(column.name)].join(', ')}
                  {column.type === 'controls' && (
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Controls"
                      onClick={() => setPage('interestForm', { teamMember: entry, editing: true })}
                    >
                      <button type="button" className="btn btn-sm btn-primary">
                        <i className="fa fa-pencil-alt" />
                      </button>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
          }
        </tbody>
      </table>
    )}
  </NavContext.Consumer>
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
