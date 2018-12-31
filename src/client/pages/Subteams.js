import React, { Component } from 'react';
import axios from 'axios';
import Page from '../components/Page';
import Subteam from '../components/Subteam';

export default class Subteams extends Component {
  constructor() {
    super();

    this.state = {
      members: {},
      groups: [],
      showGroups: {
        build: false,
        programming: false,
        business: false,
        pr: false,
        scouting: false,
        safety: false
      }
    };

    this.toggleGroup = this.toggleGroup.bind(this);

    this.getMembers();
    this.getGroups();
  }

  getMembers() {
    axios.get('/api/v1/teamMembers').then((response) => {
      const members = {};
      response.data
        .filter(entry => !entry.leftTeam)
        .map(entry => entry.subTeams.map((subTeam) => {
          if (!members[subTeam]) {
            members[subTeam] = [];
          }
          return members[subTeam].push(entry);
        }));
      console.log(members);
      this.setState({ members });
    });
  }

  getGroups() {
    axios.get('/api/v1/google/groups').then((response) => {
      const groups = [];
      response.data.map(group => axios.get(`/api/v1/google/groups/${group.id}`).then((res) => {
        groups[group.email] = res.data;
        this.setState({ groups });
      }));
      // console.log(groups);
    });
  }

  toggleGroup(group) {
    const { showGroups, groups } = this.state;
    axios.get(`/api/v1/google/groups/${group}@argsrobotics.com`).then((response) => {
      groups[group.email] = response.data;
      showGroups[group] = !showGroups[group];
      this.setState({ showGroups, groups });
    });
  }

  updateGroup(team) {
    const toRemove = [];
    const toAdd = [];
    const { members } = this.state;
    const subTeamMembers = members[team];

    axios.get(`/api/v1/google/groups/${team}@argsrobotics.com`).then(
      (response) => {
        const { members: resMembers } = response.data;

        const groupMembers = resMembers || [];

        groupMembers.forEach((member) => {
          if (member.email.indexOf('@args.us')) {
            if (subTeamMembers.filter(val => val.email === member.email).length === 0) {
              toRemove.push(member.id);
            }
          }
        });

        subTeamMembers.forEach((member) => {
          if (groupMembers.filter(val => val.email === member.email).length === 0) {
            toAdd.push(member.email);
          }
        });

        console.log(toAdd);
        console.log(toRemove);

        axios
          .put(`/api/v1/google/groups/${team}@argsrobotics.com/updateMembers`, { toAdd, toRemove })
          .then(
            (res) => {
              console.log(res.data);
              this.toggleGroup(team);
            },
            (err) => {
              console.error(err);
            }
          );
      },
      (err) => {
        console.error(err);
      }
    );
  }

  render() {
    const { members, groups, showGroups } = this.state;
    return (
      <Page title="Sub Teams">
        <div className="row">
          <Subteam
            title="Build Team"
            members={members.build}
            group={groups['build@argsrobotics.com']}
            showGroup={showGroups.build}
            toggleGroup={() => this.toggleGroup('build')}
            updateGroup={() => this.updateGroup('build', groups['build@argsrobotics.com'])}
          />
          <Subteam
            title="Programming Team"
            members={members.programming}
            group={groups['testteam@argsrobotics.com']}
            showGroup={showGroups.programming}
            toggleGroup={() => this.toggleGroup('programming')}
            updateGroup={() => this.updateGroup('programming', groups['testteam@argsrobotics.com'])}
          />
          <Subteam
            title="Safety Team"
            members={members.safety}
            group={groups['testteam@argsrobotics.com']}
            showGroup={showGroups.safety}
            toggleGroup={() => this.toggleGroup('safety')}
            updateGroup={() => this.updateGroup('safety', groups['testteam@argsrobotics.com'])}
          />
          <Subteam
            title="PR Team"
            members={members.pr}
            group={groups['testteam@argsrobotics.com']}
            showGroup={showGroups.pr}
            toggleGroup={() => this.toggleGroup('pr')}
            updateGroup={() => this.updateGroup('pr', groups['testteam@argsrobotics.com'])}
          />
          <Subteam
            title="Business Team"
            members={members.business}
            group={groups['testteam@argsrobotics.com']}
            showGroup={showGroups.business}
            toggleGroup={() => this.toggleGroup('business')}
            updateGroup={() => this.updateGroup('business', groups['testteam@argsrobotics.com'])}
          />
          <Subteam
            title="Scouting Team"
            members={members.scouting}
            group={groups['testteam@argsrobotics.com']}
            showGroup={showGroups.scouting}
            toggleGroup={() => this.toggleGroup('scouting')}
            updateGroup={() => this.updateGroup('scouting', groups['testteam@argsrobotics.com'])}
          />
        </div>
      </Page>
    );
  }
}
