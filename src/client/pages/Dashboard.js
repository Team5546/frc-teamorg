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
  }

  render() {
    const { usersSinceOffset, usersSinceOffsetUnits } = this.state;
    return (
      <Page title="Dashboard">
        <DashboardCard
          title={`Users Logged In since ${moment
            .duration(usersSinceOffset)
            .as(usersSinceOffsetUnits)} ${usersSinceOffsetUnits} ago`}
          dataUrl="/api/v1/usersLoggedInSince"
          dataBody={{
            date: moment().subtract(moment.duration(usersSinceOffset))
          }}
        />
      </Page>
    );
  }
}
