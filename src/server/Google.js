/* eslint-disable no-param-reassign */
const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const { Base64 } = require('js-base64');
require('dotenv').config();

const SCOPES = [
  'https://www.googleapis.com/auth/admin.directory.group',
  'https://www.googleapis.com/auth/gmail.send'
];
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

function generateEncodedEmail(toName, toEmail, headers, message) {
  const messageParts = [
    'From: A.R.T. 5546 <bradley@argsrobotics.com>',
    'Reply-To: A.R.T. 5546 <webmail@argsrobotics.com>',
    `To: ${toName} <${toEmail}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    'Subject: Missing Robotics Forms/Dues',
    '',
    '<html>',
    '<head>',
    ...headers,
    '</head>',
    '<body>',
    ...message,
    '</body>',
    '</html>'
  ];
  return Base64.encodeURI(messageParts.join('\n'));
}

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

async function sendMissingDocsEmail(service, member) {
  console.log(`Name: ${member.name} <${member.email}>`);
  const messageHeader = [
    '<style>',
    '@font-face { font-family: "Montserrat"; font-style: normal; font-weight: 400; src: local("Montserrat-Regular"), url(https://fonts.gstatic.com/s/montserrat/v7/zhcz-_WihjSQC0oHJ9TCYL3hpw3pgy2gAi-Ip7WPMi0.woff) format("woff"); }',
    'body { font-family: "Montserrat", Verdana, sans-serif; }',
    '.header { background-color: #930027; }',
    '.header img { padding: 10px 0; margin: 0 35%; width: 30%; overflow: hidden; display: block; }',
    '.main { font-size: 18px; text-align: center; background-color: #fafafa; display: inline-block; width: 70%; }',
    '.text { padding: 0 5%; }',
    '.footer { font-size: 14px; text-align: center; background-color: #f2f2f2; color: #bfbfbf; padding: 5%; width: 60%; }',
    '.footer a { color: #999999; }',
    '.footer, .main { margin: 0 15%; }',
    '</style>'
  ];
  const messageBody = [
    '<div class="header" width="100%">',
    '<a href="https://argsrobotics.com"><img src="http://argsrobotics.com/wp-content/uploads/2018/07/art.png"/></a>',
    '</div>',
    '<div class="main">',
    '<a href="https://argsrobotics.com"><img src="http://argsrobotics.com/wp-content/uploads/2018/07/email_banner_1.jpg" width="100%" style="width: 100%; overflow: hidden;" /></a>',
    '<div class="text">',
    '<p>',
    `<b>Hello ${member.name},</b>`,
    '</p>',
    '<p>',
    'It seems you are missing your forms and/or dues. Forms are located on our website <a href="https://argsrobotics.com/wp-content/uploads/2018/09/ARGS-Robotics-Team-ART-Manual.pdf">here</a> at the end of the manual.',
    '</p>',
    '<p>',
    'You need to fill out a: <b style="color: #930027">student contract, parent contract, and medical form.</b>',
    '</p>',
    '<p style="color: #930027">',
    '<b>Dues are $35 before Oct. 31st and $50 after Oct. 31st.</b>',
    '</p>',
    '<p>',
    'If there is any issue, please contact Dr. Crowder at acrowder@args.us.',
    '</p>',
    '</div>',
    '</div>',
    '<div class="footer">',
    '<p>',
    'This message is auto generated by FRC TeamOrg, which is developed by Bradley Harker. If there are any issues, please email support at bradley@argsrobotics.com.',
    '</p>',
    '</div>'
  ];
  const encodedMessage = generateEncodedEmail(
    member.name,
    member.email,
    messageHeader,
    messageBody
  );

  await service.users.messages.send({
    userId: 'me',
    resource: {
      raw: encodedMessage
    }
  });
}

googleRouter.put('/sendMissingDocsEmail', (req, res) => {
  oauth2Client.getAccessToken().then(
    () => {
      const mailingList = req.body;
      const service = google.gmail({ version: 'v1', auth: oauth2Client });

      const stats = {
        totalProcessed: 0,
        sendingErrors: [],
        sentTo: []
      };

      mailingList.forEach((member) => {
        let retryNumber = 0;
        sendMissingDocsEmail(service, member)
          .then(() => {
            stats.totalProcessed += 1;
            console.log(
              `Email Sent\tTotal Processed: ${stats.totalProcessed}\tmailingList.length: ${
                mailingList.length
              }`
            );
            return stats.sentTo.push(member.email);
          })
          .catch((err) => {
            // console.log(err);
            console.error(`There was a Gmail API Error: ${err.code} ${err.message}`);
            if (retryNumber && retryNumber === 4) {
              stats.totalProcessed += 1;
              return stats.sendingErrors.push({ email: member.email, error: err });
            }
            return setTimeout(() => {
              retryNumber += 1;
              sendMissingDocsEmail(service, member);
            }, 4000 * (retryNumber || 1));
          })
          .then(() => {
            console.log(
              `Total Processed: ${stats.totalProcessed}\tmailingList.length: ${mailingList.length}`
            );
            if (stats.totalProcessed === mailingList.length) {
              console.log('Final');
              return res.json({
                message:
                  stats.sendingErrors.length > 0
                    ? `There were a few errors: ${stats.sendingErrors
                      .map(val => val.email)
                      .join(', ')}`
                    : 'All emails sent successfully',
                errorList: stats.sendingErrors,
                sentTo: stats.sentTo,
                allEmails: mailingList.map(val => val.email)
              });
              // res.json(mailingList.map(val => val.email));
            }
          });
      });
    },
    err => console.error(err)
  );
});

googleRouter.post('/listCarpool', (req, res) => {});

module.exports = { googleRouter, oauth2Client };
