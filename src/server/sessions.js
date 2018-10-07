const randomString = require('random-base64-string');

module.exports.findOrCreateSession = (sessionsModel, userId, callback) => {
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
