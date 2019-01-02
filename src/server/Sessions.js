/* eslint-disable no-param-reassign */
const express = require('express');
const randomString = require('random-base64-string');
const { Session } = require('./models.js');

const sessionsRouter = express.Router();

const findOrCreateSession = (sessionsModel, userId, callback) => {
  sessionsModel.findOne({ userId }, (err, session) => {
    const sessionId = randomString(36);
    if (!session) {
      console.log('creating session');
      sessionsModel
        .create({
          userId,
          sessionId
        })
        .then(() => console.log('session created!'));
    } else {
      console.log('updating session');
      sessionsModel
        .findOneAndUpdate(
          {
            userId
          },
          {
            $set: { sessionId }
          }
        )
        .then(() => console.log('session updated!'));
    }
    callback(sessionId);
  });
};

sessionsRouter.get('/:sessionId', (req, res) => {
  Session.findOne({ sessionId: req.params.sessionId }, '-_id', (err, doc) => {
    if (err || !doc) {
      res.status(404).json({
        errors: {
          message: 'Session ID Not Found'
        }
      });
    } else {
      res.json(doc);
    }
  });
});

module.exports = { sessionsRouter, findOrCreateSession };
