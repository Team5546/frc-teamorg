import React from 'react';
import PropTypes from 'prop-types';
import './styles/Subteam.scss';
import Panel from '../helpers/stateless/Panel';

const Subteam = ({ title, members, color, group, showGroup, toggleGroup, updateGroup }) => (
  <div className="col-md-4 pb-3">
    <Panel title={title}>
      {!showGroup ? (
        <React.Fragment>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Grade</th>
                <th scope="col">Focus Area</th>
              </tr>
            </thead>
            <tbody className="subteam-scroll-table">
              {members.map(member => (
                <tr key={`user${member._id}`}>
                  <td>{`${member.firstName} ${member.lastName}`}</td>
                  <td>{member.grade}</td>
                  <td>{member.major}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!group.id && <h5>Loading google group...</h5>}
          {group.id && (
            <React.Fragment>
              <dl>
                <dt>GSuite Group Name</dt>
                <dd>{group.name}</dd>
                <dt>Email</dt>
                <dd>{group.email}</dd>
                <dt>Members</dt>
                <dd
                  className={
                    members.filter(
                      val =>
                        [
                          'bdharker@args.us',
                          'mansari@args.us',
                          'acrowder@args.us',
                          'asalas@args.us'
                        ].indexOf(val.email) === -1
                    ).length !==
                    group.members.filter(
                      val =>
                        val.email.indexOf('args.us') > -1 &&
                        [
                          'bdharker@args.us',
                          'mansari@args.us',
                          'acrowder@args.us',
                          'asalas@args.us'
                        ].indexOf(val.email) === -1
                    ).length
                      ? 'text-danger'
                      : 'text-success'
                  }
                >
                  {`Actual: ${
                    members.filter(
                      val =>
                        [
                          'bdharker@args.us',
                          'mansari@args.us',
                          'acrowder@args.us',
                          'asalas@args.us'
                        ].indexOf(val.email) === -1
                    ).length
                  }`}
                  <br />
                  {`Added to mailing list: ${
                    group.members.filter(
                      val =>
                        val.email.indexOf('args.us') > -1 &&
                        [
                          'bdharker@args.us',
                          'mansari@args.us',
                          'acrowder@args.us',
                          'asalas@args.us'
                        ].indexOf(val.email) === -1
                    ).length
                  }`}
                </dd>
              </dl>
              <button type="button" className="btn btn-sm btn-warning" onClick={toggleGroup}>
                Show Mailing Lists
              </button>
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="row">
            <div className="col-6 pr-0">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Subteam</th>
                  </tr>
                </thead>
                <tbody className="subteam-scroll-table">
                  {members
                    .sort((a, b) => {
                      if (b.email > a.email) return -1;
                      if (a.email < b.email) return 1;
                      return 0;
                    })
                    .map(member => (
                      <tr key={`user${member._id}`}>
                        <td>{member.email}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="col-6 pl-0">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Mailing List</th>
                  </tr>
                </thead>
                <tbody className="subteam-scroll-table">
                  {group.members &&
                    group.members
                      .sort((a, b) => {
                        if (b.email > a.email) return -1;
                        if (a.email < b.email) return 1;
                        return 0;
                      })
                      .map(member => (
                        <tr key={`groupUser${member.id}`}>
                          <td>{member.email}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="btn-group">
            <button type="button" className="btn btn-sm btn-default" onClick={toggleGroup}>
              Hide Mailing List
            </button>
            <button type="button" className="btn btn-sm btn-info" onClick={updateGroup}>
              Update Mailing List
            </button>
          </div>
        </React.Fragment>
      )}
    </Panel>
  </div>
);

Subteam.defaultProps = {
  members: [],
  group: {},
  color: 'default',
  showGroup: false
};

Subteam.propTypes = {
  members: PropTypes.array,
  title: PropTypes.string.isRequired,
  group: PropTypes.object,
  color: PropTypes.string,
  showGroup: PropTypes.bool,
  toggleGroup: PropTypes.func.isRequired,
  updateGroup: PropTypes.func.isRequired
};

export default Subteam;
