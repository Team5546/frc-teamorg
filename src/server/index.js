/* eslint-disable no-param-reassign */
const express = require('express');
const mongoose = require('mongoose');
const db = require('./db');
const { userRouter } = require('./Users');
const { accountsRouter, checkAdminExists } = require('./Accounts');
const { sessionsRouter } = require('./Sessions');
const { teamMembersRouter } = require('./TeamMembers');

mongoose.set('debug', true);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => checkAdminExists());

const app = express();

app.use('/static', express.static('public/res'));
app.use('/', express.static('dist'));
app.use(express.json());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/accounts', accountsRouter);
app.use('/api/v1/sessions', sessionsRouter);
app.use('/api/v1/teamMembers', teamMembersRouter);

app.listen(8080, () => console.log('Listening on port 8080!'));
