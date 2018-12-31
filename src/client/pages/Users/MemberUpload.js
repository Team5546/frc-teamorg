/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import ReactFileReader from 'react-file-reader';
import phoneFormat from 'phone-formatter';
import axios from 'axios';
import Page from '../../components/Page';
import Panel from '../../helpers/stateless/Panel';
import Table from '../../helpers/stateless/Table';
import AlertBox from '../../helpers/stateless/AlertBox';

export default class MemberUpload extends Component {
  constructor() {
    super();

    this.state = {
      members: [],
      fileName: '',
      parsing: false,
      deleteAll: false,
      confirmDelete: false
    };

    this.parseFile = this.parseFile.bind(this);
    this.parseCSV = this.parseCSV.bind(this);
    this.uploadMembers = this.uploadMembers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
  }

  parseFile(files) {
    this.setState({ fileName: files[0].name, parsing: true });
    const reader = new FileReader();
    reader.onload = () => {
      this.parseCSV(reader.result);
    };
    reader.readAsText(files[0]);
  }

  parseCSV(text) {
    console.log('begin parsing');
    const rawRows = text.split('\r\n');
    // console.log(rawRows);
    const csvData = {
      labels: rawRows
        .shift()
        .split(',')
        .map(label => label.toLowerCase()),
      rows: []
    };
    // console.log(csvData.labels);
    for (let row = 0; row < rawRows.length; row++) {
      const rowData = {};
      const colData = rawRows[row].split(',');
      for (let column = 0; column < colData.length; column++) {
        // console.log(`Raw Index: ${row * numColumns + column}`);
        rowData[csvData.labels[column]] = colData[column];
      }
      // console.log(rowData);
      csvData.rows.push(rowData);
    }
    // console.log(csvData);
    const teamMembers = [];
    csvData.rows.forEach((csvMember) => {
      teamMembers.push({
        firstName: csvMember.name.split(' ')[0].trim(),
        lastName: csvMember.name.split(' ')[1].trim(),
        grade: parseInt(csvMember.grade, 10),
        major: csvMember.major.trim(),
        subTeams: csvMember.subteams.toLowerCase().split('|') || [],
        email: csvMember.email.trim(),
        parents: [
          {
            firstName: csvMember['parent name'].split(' ')[0].trim(),
            lastName: csvMember['parent name'].split(' ')[1].trim(),
            phone: phoneFormat.normalize(csvMember['parent phone #'].trim()),
            email: csvMember['parent email'].trim()
          }
        ],
        address1: csvMember.address || 'Placeholder',
        address2: csvMember['address 2'] || undefined,
        city: csvMember.city || 'Placeholder',
        zipCode: csvMember['zip code'] || 'Placeholder',
        studentContract: csvMember['student contract?'] === 'Y',
        parentContract: csvMember['parent contract?'] === 'Y',
        medicalForm: csvMember['medical form?'] === 'Y',
        duesPaid: csvMember['paid dues?'] === 'Y',
        leftTeam: csvMember['left team'] === 'Y'
      });
    });
    this.setState({ parsing: false, members: teamMembers });
  }

  uploadMembers() {
    const { members, deleteAll, confirmDelete } = this.state;
    if (deleteAll && confirmDelete) {
      axios.delete('/api/v1/teamMembers/all').then(() => members.forEach((member, i) => {
        axios
          .post('/api/v1/teamMembers', member)
          .then(
            () => {
              members[i].uploaded = true;
            },
            () => {
              members[i].error = true;
            }
          )
          .finally(() => {
            this.setState({ members });
          });
      }));
      return;
    }
    if (deleteAll) {
      this.setState({
        errors: {
          message: 'Please confirm that you would like to delete all members',
          confirmDelete: true
        }
      });
      return;
    }
    members.forEach((member, i) => {
      axios
        .post('/api/v1/teamMembers', member)
        .then(
          () => {
            members[i].uploaded = true;
          },
          () => {
            members[i].error = true;
          }
        )
        .finally(() => {
          this.setState({ members });
        });
    });
  }

  handleChange(e) {
    const { checked } = e.target;
    this.setState({ deleteAll: checked });
  }

  handleConfirm(e) {
    const { checked } = e.target;
    this.setState({ confirmDelete: checked });
  }

  render() {
    const {
      fileName, parsing, members, deleteAll, confirmDelete, errors
    } = this.state;
    return (
      <Page title="Member Upload">
        <Panel title="Upload CSV File">
          <p>
            {fileName}
          </p>
          <ReactFileReader handleFiles={this.parseFile} fileTypes=".csv">
            <button type="button" className="btn btn-sm btn-info">
              Upload
            </button>
          </ReactFileReader>
          <p>
            {parsing && 'Parsing CSV File...'}
          </p>
          {members.length > 0 && (
            <React.Fragment>
              <Table
                data={members}
                columns={[
                  {
                    name: 'Name',
                    type: 'text',
                    specialData: 'name'
                  },
                  {
                    name: 'Grade',
                    type: 'text'
                  },
                  {
                    name: 'Major',
                    type: 'text'
                  },
                  {
                    name: 'Dues Paid',
                    type: 'boolean'
                  },
                  {
                    name: 'Left Team',
                    type: 'boolean'
                  },
                  {
                    name: 'Uploaded',
                    type: 'boolean'
                  },
                  {
                    name: 'Error',
                    type: 'boolean'
                  }
                ]}
                disabledCol="leftTeam"
                specialData={{
                  name: members.map(member => `${member.firstName} ${member.lastName}`)
                }}
              />
              <AlertBox
                type="danger"
                condition={errors}
                message={errors && errors.message}
                close={() => this.setState({ errors: undefined })}
              />
              <div className="checkbox">
                <label>
                  <input type="checkbox" checked={deleteAll} onChange={this.handleChange} />
                  Delete All Members Before Upload?
                </label>
              </div>
              <div className={errors && errors.confirmDelete && 'has-error'}>
                <div className={`checkbox${deleteAll ? '' : ' disabled'}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={confirmDelete}
                      onChange={this.handleConfirm}
                      disabled={!deleteAll}
                    />
                    Confirm deleting
                  </label>
                </div>
              </div>

              <button type="button" onClick={this.uploadMembers} className="btn btn-sm btn-info">
                <em className="fa fa-upload" />
                {' Upload All Members'}
              </button>
            </React.Fragment>
          )}
        </Panel>
      </Page>
    );
  }
}
