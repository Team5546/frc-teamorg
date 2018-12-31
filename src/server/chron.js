const schedule = require('node-schedule');
const { oauth2client } = require('./Google');

const emailMembersMissingFormsOrDuesRule = schedule.RecurrenceRule();
emailMembersMissingFormsOrDuesRule.day = 0;
emailMembersMissingFormsOrDuesRule.hour = 23;
emailMembersMissingFormsOrDuesRule.minute = 59;
