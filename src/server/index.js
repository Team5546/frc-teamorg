/* eslint-disable no-param-reassign */
const express = require('express');
const db = require('./db');
console.log(`__dirname: ${__dirname}`);
console.log(`__dirname indexOf: ${__dirname.indexOf('/src/server')}`);
const userRouter =
  __dirname.indexOf('/src/server') !== -1 ? require('./Users') : require('/src/server/Users');
const { accountsRouter, checkAdminExists } =
  __dirname.indexOf('/src/server') !== -1 ? require('./Accounts') : require('/src/server/Accounts');
const { sessionsRouter } =
  __dirname.indexOf('/src/server') !== -1 ? require('./Sessions') : require('/src/server/Sessions');
const { teamMembersRouter } =
  __dirname.indexOf('/src/server') !== -1
    ? require('./TeamMembers')
    : require('/src/server/TeamMembers');
const { meetingsRouter } =
  __dirname.indexOf('/src/server') !== -1 ? require('./Meetings') : require('/src/server/Meetings');
const { googleRouter } =
  __dirname.indexOf('/src/server') !== -1 ? require('./Google') : require('/src/server/Google');

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

app.listen(8080, () => console.log('Listening on port 8080!'));
