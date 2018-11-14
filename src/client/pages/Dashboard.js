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
      usersSinceOffsetUnits: 'weeks',
      interestByMajor: []
    };

    this.getInterestEntries();
  }

  getInterestEntries() {
    axios.get('/api/v1/teamMembers').then((response) => {
      const interestByMajor = [];
      for (const entry of response.data) {
        const index = interestByMajor.findIndex(maj => maj.major === entry.major);
        if (index !== -1) {
          interestByMajor[index].count++;
        } else {
          const maj = {
            major: entry.major,
            count: 1
          };
          interestByMajor.push(maj);
        }
      }
      this.setState({ interestEntries: response.data.length, interestByMajor });
    });
  }

  render() {
    const {
      usersSinceOffset,
      usersSinceOffsetUnits,
      interestEntries,
      interestByMajor
    } = this.state;
    return (
      <Page title="Dashboard">
        <div className="row">
          {/* <div className="col-md-3">
            <DashboardCard
              title={`Users Logged In since ${moment
                .duration(usersSinceOffset)
                .as(usersSinceOffsetUnits)} ${usersSinceOffsetUnits} ago`}
              dataUrl="/api/v1/usersLoggedInSince"
              dataBody={{
                date: moment().subtract(moment.duration(usersSinceOffset))
              }}
            />
            </div> */}
          <div className="col-md-3">
            <DashboardCard title="Total entries in Interest Form">
              {interestEntries}
            </DashboardCard>
          </div>
          <div className="col-md-3">
            <DashboardCard title="Interest By Major">
              {interestByMajor.map(maj => (
                <p key={maj.major}>
                  {`${maj.major}: ${maj.count}`}
                </p>
              ))}
            </DashboardCard>
          </div>
        </div>
      </Page>
    );
  }
}
