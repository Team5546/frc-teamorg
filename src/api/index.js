/* eslint-disable no-param-reassign */
if (process.env.USER === 'webmaster') {
  console.log(require('dotenv').config({ path: '/var/www/.env' }));
} else {
  require('dotenv').config();
}
// console.log('process.env', process.env);

const express = require('express');
const db = require('./db');
// console.log(`__dirname: ${__dirname}`);
const userRouter = require('./Users');
const { accountsRouter, checkAdminExists } = require('./Accounts.js');
const { sessionsRouter } = require('./Sessions.js');
const { teamMembersRouter } = require('./TeamMembers.js');
const { meetingsRouter } = require('./Meetings.js');
const { googleRouter } = require('./Google.js');

const PORT = process.env.ENV === 'development' ? 8080 : 3001;

// mongoose.set('debug', true);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => checkAdminExists());

const app = express();

app.use('/static', express.static('public'));
app.use('/', express.static('dist'));
app.use(express.json({ limit: '3.2mb' }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/accounts', accountsRouter);
app.use('/api/v1/sessions', sessionsRouter);
app.use('/api/v1/teamMembers', teamMembersRouter);
app.use('/api/v1/meetings', meetingsRouter);
app.use('/api/v1/google', googleRouter);

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
