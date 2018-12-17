import React from 'react';
import PropTypes from 'prop-types';
import './styles/Subteam.scss';

const Subteam = ({ title, members, color }) => (
  <div className="col-md-4">
    <div className={`panel panel-${color || 'default'}`}>
      <div className="panel-heading">
        {title}
      </div>
      <div className="panel-body">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">
Name
              </th>
              <th scope="col">
Grade
              </th>
              <th scope="col">
Focus Area
              </th>
            </tr>
          </thead>
          <tbody className="subteam-scroll-table">
            {members.map(member => (
              <tr key={`user${member._id}`}>
                <td>
                  {`${member.firstName} ${member.lastName}`}
                </td>
                <td>
                  {member.grade}
                </td>
                <td>
                  {member.major}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

Subteam.defaultProps = {
  members: []
};

Subteam.propTypes = {
  members: PropTypes.array,
  title: PropTypes.string.isRequired
};

export default Subteam;
