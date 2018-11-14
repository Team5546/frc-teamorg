import React, { Component } from 'react';
import axios from 'axios';
import Page from '../components/Page';
import Subteam from '../components/Subteam';

export default class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      members: {}
    };

    this.getMembers();
  }

  getMembers() {
    axios.get('/api/v1/teamMembers').then((response) => {
      const members = {};
      response.data.map((entry) => {
        entry.subTeams.map((subTeam) => {
          if (!members[subTeam]) {
            members[subTeam] = [];
          }
          members[subTeam].push(entry);
        });
      });
      console.log(members);
      this.setState({ members });
    });
  }

  render() {
    const { members } = this.state;
    return (
      <Page title="Sub Teams">
        <div className="row mb-3">
          <div className="col-md-6">
            <Subteam title="Build Team" members={members.build} />
          </div>
          <div className="col-md-6">
            <Subteam title="Programming Team" members={members.programming} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <Subteam title="Safety Team" members={members.safety} />
          </div>
          <div className="col-md-6">
            <Subteam title="PR Team" members={members.pr} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6">
            <Subteam title="Business Team" members={members.business} />
          </div>
          <div className="col-md-6">
            <Subteam title="Scouting Team" members={members.scouting} />
          </div>
        </div>
      </Page>
    );
  }
}
