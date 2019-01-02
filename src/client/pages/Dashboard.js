/* eslint-disable react/no-string-refs, jsx-a11y/anchor-is-valid,
  no-restricted-syntax, react/no-find-dom-node, jsx-a11y/click-events-have-key-events,
  jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import axios from 'axios';
import { Bar, defaults } from 'react-chartjs-2';
import camelcase from 'camelcase';
import Page from '../components/Page';
import EasyPieChart from 'easy-pie-chart';
import Panel from '../helpers/stateless/Panel';

defaults.global.legend.display = false;
// console.log($);

export default class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      stats: {
        interestByMajor: [],
        interestByGrade: [0, 0, 0, 0],
        totalTeamMembers: 0,
        totalFullMembers: 0
      },
      graphs: {
        teamsShowing: {
          build: true,
          programming: false,
          scouting: true,
          business: true,
          safety: true,
          pr: true
        },
        majorsShowing: {}
      }
    };

    this.getInterestEntries();
    this.getMeetings();
  }

  getInterestEntries() {
    axios.get('/api/v1/teamMembers').then(response => {
      const interestByMajor = [];
      const { graphs, stats } = this.state;
      for (const entry of response.data) {
        const index = interestByMajor.findIndex(maj => maj.major === entry.major);
        if (index !== -1) {
          interestByMajor[index].count += 1;
        } else {
          const maj = {
            major: entry.major,
            count: 1
          };
          interestByMajor.push(maj);
          graphs.majorsShowing[camelcase(maj.major)] = true;
        }
        switch (entry.grade) {
          case 9:
            stats.interestByGrade[0] += 1;
            break;
          case 10:
            stats.interestByGrade[1] += 1;
            break;
          case 11:
            stats.interestByGrade[2] += 1;
            break;
          case 12:
            stats.interestByGrade[3] += 1;
            break;
          default:
            break;
        }
        if (entry.studentContract && entry.parentContract && entry.medicalForm && entry.duesPaid)
          stats.totalFullMembers += 1;
      }
      this.setState({
        stats: {
          ...stats,
          interestByMajor,
          totalTeamMembers: response.data.length
        },
        graphs
      });
      this.updateGraphs();
    });
  }

  getMeetings() {
    axios.get('/api/v1/meetings').then(response => {
      const { stats } = this.state;
      stats.subTeamMeetings = 0;
      stats.entireTeamMeetings = 0;
      for (const meeting of response.data) {
        if (meeting.subTeams.length === 6) stats.entireTeamMeetings += 1;
        else stats.subTeamMeetings += 1;
      }
      this.setState({ stats });
    });
  }

  updateGraphs(toggleMajor) {
    const { graphs, stats } = this.state;
    if (toggleMajor) {
      graphs.majorsShowing[camelcase(toggleMajor)] = !graphs.majorsShowing[camelcase(toggleMajor)];
    }
    const showingGraphData = stats.interestByMajor.filter(
      maj => graphs.majorsShowing[camelcase(maj.major)]
    );
    console.log(stats.interestByMajor);
    console.log(showingGraphData);
    const graphData = {
      labels: showingGraphData.map(maj => maj.major),
      datasets: [
        {
          label: 'Interest Form Data',
          backgroundColor: [
            'rgba(66, 134, 244, 0.2)',
            'rgba(66, 244, 110, 0.2)',
            'rgba(242, 176, 62, 0.2)',
            'rgba(154, 62, 241, 0.2)',
            'rgba(61, 232, 240, 0.2)',
            'rgba(66, 134, 244, 0.2)'
          ],
          borderColor: [
            'rgb(66, 134, 244)',
            'rgb(66, 244, 110)',
            'rgb(242, 176, 62)',
            'rgb(154, 62, 241)',
            'rgb(61, 232, 240)',
            'rgb(66, 134, 244)'
          ],
          borderWidth: 2,
          highlightFill: 'rgba(220,220,220,0.75)',
          highlightStroke: 'rgba(220,220,220,1)',
          data: showingGraphData.map(maj => maj.count)
        }
      ]
    };
    const percentFreshmen = findDOMNode(this.refs.percentFreshmen);
    const percentSophomores = findDOMNode(this.refs.percentSophomores);
    const percentJuniors = findDOMNode(this.refs.percentJuniors);
    const percentSeniors = findDOMNode(this.refs.percentSeniors);
    const freshmen = new EasyPieChart(percentFreshmen, {
      scaleColor: false,
      barColor: '#30a5ff'
    });
    const sophomores = new EasyPieChart(percentSophomores, {
      scaleColor: false,
      barColor: '#ffb53e'
    });
    const juniors = new EasyPieChart(percentJuniors, {
      scaleColor: false,
      barColor: '#1ebfae'
    });
    const seniors = new EasyPieChart(percentSeniors, {
      scaleColor: false,
      barColor: '#f9243f'
    });
    // $(percentFreshmen).easyPieChart({
    //   scaleColor: false,
    //   barColor: "#30a5ff"
    // });
    // $(percentSophomores).easyPieChart({
    //   scaleColor: false,
    //   barColor: "#ffb53e"
    // });
    // $(percentJuniors).easyPieChart({
    //   scaleColor: false,
    //   barColor: "#1ebfae"
    // });
    // $(percentSeniors).easyPieChart({
    //   scaleColor: false,
    //   barColor: "#f9243f"
    // });
    this.setState({ graphData, graphs });
  }

  render() {
    const { graphData, graphs, stats, showGraph } = this.state;
    const { totalTeamMembers, totalFullMembers, subTeamMeetings, entireTeamMeetings } = stats;
    return (
      <Page title="Dashboard">
        <div className="row mb-2">
          <div className="col">
            <div className="card-group text-center">
              <Panel>
                <em className="fa fa-address-book fa-2x color-blue" />
                <div className="large">{totalTeamMembers}</div>
                <div className="text-muted">Interest Form Entries</div>
              </Panel>
              <Panel>
                <em className="fa fa-2x fa-users color-orange" />
                <div className="large">{totalFullMembers}</div>
                <div className="text-muted">Full Members</div>
              </Panel>
              <Panel>
                <em className="fa fa-xl fa-sitemap color-teal" />
                <div className="large">{subTeamMeetings}</div>
                <div className="text-muted">Sub Team Meetings</div>
              </Panel>
              <Panel>
                <em className="fa fa-xl fa-chair color-red" />
                <div className="large">{entireTeamMeetings}</div>
                <div className="text-muted">Entire Team Meetings</div>
              </Panel>
            </div>
          </div>
        </div>
        <div className="row my-2">
          <div className="col">
            <Panel
              title="Signups By Major"
              header={
                <React.Fragment>
                  <button
                    className="btn btn-default dropdown-toggle float-right"
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <em className="fa fa-cogs" />
                  </button>
                  <div className="dropdown-menu">
                    {Object.keys(graphs.majorsShowing).map((maj, i) => (
                      <React.Fragment key={maj}>
                        {i > 0 && <div role="separator" className="dropdown-divider" />}
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => this.updateGraphs(maj)}
                        >
                          <em
                            className={`fa fa-toggle-${graphs.majorsShowing[maj] ? 'on' : 'off'}`}
                          />
                          {maj}
                        </a>
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              }
            >
              <div className="canvas-wrapper">
                {graphData && (
                  <Bar
                    className="main-chart"
                    data={graphData}
                    options={{
                      scales: {
                        yAxes: [
                          {
                            stacked: false,
                            gridLines: {
                              display: true,
                              color: 'rgba(0,0,0,.2)'
                            },
                            ticks: {
                              beginAtZero: true,
                              suggestedMax: 5,
                              stepSize: 1
                            }
                          }
                        ],
                        xAxes: [
                          {
                            stacked: false,
                            gridLines: {
                              display: false,
                              color: 'rgba(0,0,0,.2)'
                            }
                          }
                        ]
                      },
                      scaleGridLineColor: 'rgba(0,0,0,.05)',
                      scaleFontColor: '#c5c7cc'
                    }}
                  />
                )}
              </div>
            </Panel>
          </div>
        </div>
        <div className="row my-2">
          <div className="col">
            <div className="card-group text-center">
              <Panel>
                <h4>Freshmen</h4>
                <div
                  className="easypiechart"
                  id="easypiechart-blue"
                  ref="percentFreshmen"
                  data-percent={((stats.interestByGrade[0] / stats.totalTeamMembers) * 100).toFixed(
                    1
                  )}
                >
                  <span className="percent">
                    {((stats.interestByGrade[0] / stats.totalTeamMembers) * 100).toFixed(1)}%
                  </span>
                </div>
              </Panel>
              <Panel>
                <h4>Sophomores</h4>
                <div
                  className="easypiechart"
                  id="easypiechart-orange"
                  ref="percentSophomores"
                  data-percent={((stats.interestByGrade[1] / stats.totalTeamMembers) * 100).toFixed(
                    1
                  )}
                >
                  <span className="percent">
                    {((stats.interestByGrade[1] / stats.totalTeamMembers) * 100).toFixed(1)}%
                  </span>
                </div>
              </Panel>
              <Panel>
                <h4>Juniors</h4>
                <div
                  className="easypiechart"
                  id="easypiechart-teal"
                  ref="percentJuniors"
                  data-percent={((stats.interestByGrade[2] / stats.totalTeamMembers) * 100).toFixed(
                    1
                  )}
                >
                  <span className="percent">
                    {((stats.interestByGrade[2] / stats.totalTeamMembers) * 100).toFixed(1)}%
                  </span>
                </div>
              </Panel>
              <Panel>
                <h4>Seniors</h4>
                <div
                  className="easypiechart"
                  id="easypiechart-red"
                  ref="percentSeniors"
                  data-percent={((stats.interestByGrade[3] / stats.totalTeamMembers) * 100).toFixed(
                    1
                  )}
                >
                  <span className="percent">
                    {((stats.interestByGrade[3] / stats.totalTeamMembers) * 100).toFixed(1)}%
                  </span>
                </div>
              </Panel>
            </div>
          </div>
        </div>
        <script src="js/easypiechart.js" />
      </Page>
    );
  }
}
