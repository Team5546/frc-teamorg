import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import Page from '../components/Page';
import DashboardCard from '../components/DashboardCard';

export default class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      usersSinceOffset: {
        weeks: 1,
        days: 0,
        years: 0
      },
      usersSinceOffsetUnits: 'weeks'
    };

    this.getInterestEntries();
  }

  getInterestEntries() {
    axios.get('/api/v1/teamMembers').then((response) => {
      this.setState({ interestEntries: response.data.length });
    });
  }

  render() {
    const { usersSinceOffset, usersSinceOffsetUnits, interestEntries } = this.state;
    return (
      <Page title="Dashboard">
        <div className="row">
          <div className="col-md-3">
            <DashboardCard
              title={`Users Logged In since ${moment
                .duration(usersSinceOffset)
                .as(usersSinceOffsetUnits)} ${usersSinceOffsetUnits} ago`}
              dataUrl="/api/v1/usersLoggedInSince"
              dataBody={{
                date: moment().subtract(moment.duration(usersSinceOffset))
              }}
            />
          </div>
          <div className="col-md-3">
            <DashboardCard title="Total entries in Interest Form">
              {interestEntries}
            </DashboardCard>
          </div>
        </div>
      </Page>
    );
  }
}
