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
        <div className="row">
          <Subteam title="Build Team" members={members.build} />
          <Subteam title="Programming Team" members={members.programming} />
          <Subteam title="Safety Team" members={members.safety} />
          <Subteam title="PR Team" members={members.pr} />
          <Subteam title="Business Team" members={members.business} />
          <Subteam title="Scouting Team" members={members.scouting} />
        </div>
      </Page>
    );
  }
}
