import React from 'react';
import PropTypes from 'prop-types';
import camelcase from 'camelcase';
import NavContext from '../../NavContext';

const Table = ({
  columns, data, controls, specialData
}) => (
  <NavContext.Consumer>
    {({ setPage }) => (
      <table className="table">
        <thead>
          <tr>
            {columns.map(column => (
              <th
                key={column.name}
                className={column.name === 'controls' ? 'col-md-auto' : ''}
                style={{ whiteSpace: 'nowrap', width: 'auto' }}
              >
                {column.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => (
            <tr key={`entry${i}`}>
              {columns.map(column => (
                <td
                  key={`${column.key || camelcase(column.name)}`}
                  style={{
                    whiteSpace: 'nowrap',
                    width: 'auto'
                  }}
                >
                  {specialData
                    && specialData[column.specialData]
                    && specialData[column.specialData][i]}
                  {column.type === 'text'
                    && !column.specialData
                    && entry[column.key || camelcase(column.name)]}
                  {column.type !== 'array'
                    && column.type !== 'boolean'
                    && !(specialData && !specialData[column.specialData])
                    && entry[column.key || camelcase(column.name)]}
                  {column.type === 'boolean' && (
                    <i
                      className={`fa fa-${
                        entry[column.key || camelcase(column.name)]
                          ? 'check-circle text-success'
                          : 'times-circle text-danger'
                      }`}
                    />
                  )}
                  {column.type === 'array'
                    && entry[column.key || camelcase(column.name)].join(', ')}
                  {column.type === 'booleanList'
                    && specialData[column.specialData][i].map((bool, j) => (
                      <em
                        key={`boolList${column.name}${i}${j}`}
                        className={`fa fa-${bool ? 'check-circle' : 'times-circle'} text-${
                          bool ? 'success' : 'danger'
                        }`}
                      />
                    ))}
                  {column.type === 'controls' && (
                    <div className="btn-group" role="group" aria-label="Controls">
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={() => setPage(column.editPage, { teamMember: entry, editing: true })
                        }
                      >
                        <i className="fa fa-pencil-alt" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-info"
                        onClick={() => setPage(column.infoPage, { teamMember: entry })}
                      >
                        <i className="fa fa-address-card" />
                      </button>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
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
