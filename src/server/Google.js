/* eslint-disable no-param-reassign */
const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/admin.directory.group'];
const TOKEN_PATH = 'token.json';
const REFRESH_TOKEN_PATH = 'refresh-token.json';
const { API_KEY, CLIENT_SECRET, ENV } = process.env;
const REDIRECT_URI = ENV === 'development' ? 'http://localhost:3000' : '';

let oauth2Client;

function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err);
    return console.log(`Token stored to ${TOKEN_PATH}`);
  });
}

function getNewToken(oauth) {
  const authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oauth.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oauth.credentials = token;
      storeToken(token);
      return console.log('logged in');
    });
  });
}
function authorize() {
  oauth2Client = new google.auth.OAuth2(API_KEY, CLIENT_SECRET, REDIRECT_URI);

  oauth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
      // store the refresh_token in my database!
      fs.writeFile(
        REFRESH_TOKEN_PATH,
        JSON.stringify({ refresh_token: tokens.refresh_token }),
        (err) => {
          if (err) return console.warn(`Refresh Token not stored to ${REFRESH_TOKEN_PATH}`, err);
          return console.log(`Refresh Token stored to ${REFRESH_TOKEN_PATH}`);
        }
      );
    }
    oauth2Client.setCredentials(tokens);
  });

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oauth2Client);
    oauth2Client.setCredentials(JSON.parse(token));
    return oauth2Client;
  });
}

authorize();

const googleRouter = express.Router();

googleRouter.get('/groups', (req, res) => {
  // console.log(oauth2Client.credentials);
  oauth2Client.getAccessToken().then(() => {
    const service = google.admin({ version: 'directory_v1', auth: oauth2Client });
    service.groups.list(
      {
        customer: 'my_customer'
      },
      (err, response) => {
        if (err) return console.error('The API returned an error:', err);

        const { groups } = response.data;
        if (groups.length) {
          return res.json(groups);
        }
        return res.json({ error: { ...err } });
      }
    );
  });
});

googleRouter.get('/groups/:id', (req, res) => {
  oauth2Client.getAccessToken().then(() => {
    const { id } = req.params;
    // console.log(oauth2Client.credentials);
    const service = google.admin({ version: 'directory_v1', auth: oauth2Client });
    service.groups.get(
      {
        groupKey: id
      },
      (err, groupRes) => {
        if (err) return console.error('The API returned an error:', err.message);

        return service.members.list(
          {
            groupKey: id
          },
          (membersErr, membersRes) => {
            // console.log(response);
            const group = groupRes.data;
            const members = membersRes.data;
            if (group) {
              if (members) {
                return res.json({ ...group, members: members.members });
              }
              return res.json({ error: { ...membersErr } });
            }
            return res.json({ error: { ...err } });
          }
        );
      }
    );
  });
});

googleRouter.put('/groups/:id', (req, res) => {
  oauth2Client.getAccessToken().then(() => {
    const { id } = req.params;
    const { name, description, email } = req.body;
    // console.log(oauth2Client.credentials);
    const service = google.admin({ version: 'directory_v1', auth: oauth2Client });
    service.groups.update(
      {
        groupKey: id,
        requestBody: { name, description, email }
      },
      (err, groupRes) => {
        if (err) return console.error('The API returned an error:', err.message);
        // console.log(groupRes);
        const group = groupRes.data;
        if (group) {
          return res.json(group);
        }
        return res.json({ error: { ...err } });
      }
    );
  });
});

googleRouter.get('/groups/:groupKey/hasMember/:memberKey', (req, res) => {
  oauth2Client.getAccessToken().then(() => {
    const { groupKey, memberKey } = req.params;
    const service = google.admin({ version: 'directory_v1', auth: oauth2Client });
    service.members.hasMember(
      {
        groupKey,
        memberKey
      },
      (err, memberRes) => {
        if (err) return console.error('The API returned an error:', err.message);
        const { isMember } = memberRes.data;
        return res.json({ isMember });
      }
    );
  });
});

googleRouter.put('/groups/:groupKey/updateMembers', (req, res) => {
  oauth2Client.getAccessToken().then(() => {
    const { groupKey } = req.params;
    const { toAdd, toRemove } = req.body;
    const service = google.admin({ version: 'directory_v1', auth: oauth2Client });

    let removeErrorCount = 0;
    const removeErrors = [];
    let removeSuccessCount = 0;
    let addErrorCount = 0;
    const addErrors = [];
    let addSuccessCount = 0;

    service.members.list(
      {
        groupKey
      },
      (err, listRes) => {
        if (err) return console.error('The API returned an error:', err.message);
        const { members } = listRes.data;
        ['bdharker@args.us', 'mansari@args.us', 'acrowder@args.us', 'asalas@args.us'].forEach(
          (email) => {
            if (members.filter(val => val.email === email).length === 0) return toAdd.push(email);
            return email; // console.log(`Admin email ${email} already added`);
          }
        );

        toRemove.forEach((memberKey) => {
          service.members.delete(
            {
              groupKey,
              memberKey
            },
            (removeErr, removeRes) => {
              if (err) {
                removeErrorCount += 1;
                removeErrors.push({
                  message: err.message,
                  memberKey
                });
                if (
                  removeErrorCount + removeSuccessCount === toRemove.length
                  && addErrorCount + addSuccessCount === toAdd.length
                ) {
                  return res.json({
                    removeErrorCount,
                    removeErrors,
                    removeSuccessCount,
                    addErrorCount,
                    addErrors,
                    addSuccessCount
                  });
                }
                return removeErr; // console.error('The API returned an error:', err.message);
              }
              removeSuccessCount += 1;
              if (
                removeErrorCount + removeSuccessCount === toRemove.length
                && addErrorCount + addSuccessCount === toAdd.length
              ) {
                return res.json({
                  removeErrorCount,
                  removeErrors,
                  removeSuccessCount,
                  addErrorCount,
                  addErrors,
                  addSuccessCount
                });
              }
              return removeRes; // console.log('API Success');
            }
          );
        });

        toAdd.forEach((email) => {
          service.members.insert(
            {
              groupKey,
              requestBody: {
                email
              }
            },
            (addErr, addRes) => {
              if (err) {
                addErrorCount += 1;
                addErrors.push({
                  message: err.message,
                  email
                });
                if (
                  removeErrorCount + removeSuccessCount === toRemove.length
                  && addErrorCount + addSuccessCount === toAdd.length
                ) {
                  return res.json({
                    removeErrorCount,
                    removeErrors,
                    removeSuccessCount,
                    addErrorCount,
                    addErrors,
                    addSuccessCount
                  });
                }
                return addErr; // console.error('The API returned an error:', err.message);
              }
              addSuccessCount += 1;
              if (
                removeErrorCount + removeSuccessCount === toRemove.length
                && addErrorCount + addSuccessCount === toAdd.length
              ) {
                return res.json({
                  removeErrorCount,
                  removeErrors,
                  removeSuccessCount,
                  addErrorCount,
                  addErrors,
                  addSuccessCount
                });
              }
              return addRes; // console.log('API Success');
            }
          );
        });
        return true;
      }
    );
  });
});

module.exports = { googleRouter };
