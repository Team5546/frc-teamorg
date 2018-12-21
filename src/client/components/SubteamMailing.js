import React from 'react';
import PropTypes from 'prop-types';
import './styles/Subteam.scss';

const Subteam = ({
  title, members, color, group
}) => (
  <div className="col-md-4">
    <div className={`panel panel-${color || 'default'}`}>
      <div className="panel-heading">
        {title}
      </div>
      <div className="panel-body">
        <div className="row">
          <div className="col-xs-6">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">
Subteam
                  </th>
                </tr>
              </thead>
              <tbody className="subteam-scroll-table">
                {members.map(member => (
                  <tr key={`user${member._id}`}>
                    <td>
                      {member.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-xs-6">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">
Mailing List
                  </th>
                </tr>
              </thead>
              <tbody className="subteam-scroll-table">
                {group.members.map(member => (
                  <tr key={`groupUser${member.id}`}>
                    <td>
                      {member.email}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Subteam.defaultProps = {
  members: [],
  group: {}
};

Subteam.propTypes = {
  members: PropTypes.array,
  title: PropTypes.string.isRequired,
  group: PropTypes.object
};

export default Subteam;
