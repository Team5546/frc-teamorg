/* eslint-disable no-param-reassign */
const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');

mongoose.set('debug', true);

// const { MongoClient } = mongo;
const bcrypt = require('bcrypt');
const { findOrCreateSession } = require('./sessions');

const globalSaltRounds = 10;

const db = mongoose.createConnection('mongodb://localhost:27017/db', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String
  },
  lastLogin: {
    type: Date
  }
});

const sessionsSchema = new mongoose.Schema({
  userId: String,
  sessionId: String
});

const User = db.model('User', userSchema, 'users');
const Session = db.model('Session', sessionsSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  User.find({ isAdmin: true }, (err, res) => {
    if (!err && res.length === 0) {
      console.info('DB: Creating admin user');
      const password = bcrypt.hashSync('root', globalSaltRounds);
      User.create(
        {
          username: 'Admin',
          firstName: 'Admin',
          lastName: 'Admin',
          password,
          isAdmin: true,
          isActive: true,
          createdAt: new Date(),
          createdBy: 'Your Mom'
        },
        (createErr, doc) => {
          if (createErr) {
            console.info("DB: Couldn't add admin");
          }
          console.info('DB: Added default Admin');
          console.info(doc);
        }
      );
    } else if (err) {
      console.error('ERROR');
      console.error(`DB: ${err}`);
    } else {
      console.info('DB: Admin user exists');
      console.log(`DB: ${res}`);
    }
  });
});

// MongoClient.connect(
//   'mongodb://localhost:27017/',
//   { useNewUrlParser: true },
//   (err, client) => {
//     if (err) throw err;

//     db = client.db('db');
//     sessionsCollection = db.collection('sessions');
//     usersCollection = db.collection('users');

//     usersCollection
//       .findOne({
//         isAdmin: true
//       })
//       .then((response) => {
//         if (!response) {
//           const password = bcrypt.hashSync('root', globalSaltRounds);
//           usersCollection
//             .insertOne({
//               username: 'Admin',
//               firstName: 'Admin',
//               lastName: 'Admin',
//               password,
//               isAdmin: true,
//               isActive: true,
//               createdAt: new Date(),
//               createdBy: 'Your Mom'
//             })
//             .then(() => {
//               console.info('Added default Admin');
//             });
//         }
//       });
//   }
// );

const app = express();

app.use('/static', express.static('public/res'));
app.use(express.static('dist'));
app.use(express.json());

app.get('/api/v1/users', (req, res) => {
  User.find({}, '-password', (err, doc) => {
    res.json(doc);
  });
});

app.get('/api/v1/users/:id', (req, res) => {
  User.findById(req.params.id, '-password', (err, doc) => {
    if (err) {
      res.json({
        errors: {
          message: 'User not found'
        }
      });
    } else {
      res.json(doc);
    }
  });
});

app.put('/api/v1/users/:id', (req, res) => {
  const {
    username, firstName, lastName, lastModified, modifiedBy, isAdmin, isActive
  } = req.body;
  const { id } = req.params;
  if (!username || !firstName || !lastName) {
    res.status(422).json({
      errors: {
        username: username ? undefined : 'no username provided',
        firstName: firstName ? undefined : 'no first name provided',
        lastName: lastName ? undefined : 'no last name provided',
        message: 'Some fields were left blank'
      }
    });
  } else {
    User.find({ $and: [{ username }, { _id: { $ne: new mongo.ObjectId(id) } }] }, (err, doc) => {
      console.log(doc);
      if (doc) {
        res.status(422).json({
          errors: {
            username: 'Username already in use',
            message: 'Username already in use'
          }
        });
      } else if (err) {
        console.error(err);
      } else {
        User.findByIdAndUpdate(
          id,
          {
            $set: {
              username,
              firstName,
              lastName,
              lastModified,
              modifiedBy,
              isAdmin,
              isActive
            }
          },
          (updateErr, upDoc) => {
            if (updateErr) {
              console.log(updateErr);
              res.status(500).json({ errors: { message: 'An unknown error has occurred. ' } });
            } else {
              res.json({ ...upDoc });
            }
          }
        );
      }
    });
  }
});

app.delete('/api/v1/users/:id', (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id, (err, doc) => {
    if (err) {
      res.status(500).json({
        errors: {
          ...err,
          message: 'An Unkown Error Has Occurred'
        }
      });
    } else {
      res.json(doc);
    }
  });
});

app.put('/api/v1/checkUsername', (req, res) => {
  const { username, id } = req.body;
  if (username) {
    User.find({ _id: { $ne: id }, username }, {}, (err, doc) => {
      if (doc) {
        res.status(422).json({
          errors: {
            username: 'Username already in use'
          }
        });
      } else {
        res.status(200).send();
      }
    });
  } else {
    res.status(422).json({
      errors: {
        username: 'Username is blank'
      }
    });
  }
});

app.get('/api/v1/sessions/:sessionId', (req, res) => {
  Session.findOne({ sessionId: req.params.sessionId }, '-_id', (err, doc) => {
    if (err) {
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

app.post('/api/v1/login', (req, res) => {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (user && bcrypt.compareSync(req.body.password, user.password) && user.isActive) {
      findOrCreateSession(Session, user._id, (sessionId) => {
        res.json({ sessionId, userId: user._id });
        User.findByIdAndUpdate({ _id: user._id }, { $set: { lastLogin: new Date() } });
      });
    } else {
      res.status(401).json({
        status: 401,
        errors: {
          message:
            user && user.isActive
              ? 'Username or password is incorrect'
              : 'User is inactive, please contact an administrator'
        }
      });
    }
  });
});

app.post('/api/v1/signup', (req, res) => {
  const {
    username,
    password,
    firstName,
    lastName,
    createdBy,
    createdAt,
    isAdmin,
    isActive
  } = req.body;
  if (!password || !username) {
    res.status(422).json({
      errors: {
        username: username ? undefined : 'username blank',
        password: password ? undefined : 'password blank'
      }
    });
  } else {
    User.findOne({ username }, (err, user) => {
      if (user || password.length < 8) {
        res.status(422).json({
          errors: {
            username: !user ? undefined : 'username duplicated',
            password: password.length >= 8 ? undefined : 'password must be 8 characters'
          }
        });
      } else {
        User.create(
          {
            username,
            password: bcrypt.hashSync(password, globalSaltRounds),
            firstName,
            lastName,
            createdBy: createdBy || 'system',
            createdAt,
            isAdmin: isAdmin || false,
            isActive: isActive || true
          },
          (createErr, doc) => {
            if (createErr) {
              console.error(createErr);
            } else {
              findOrCreateSession(Session, doc._id, (sessionId) => {
                console.log(sessionId);
                res.status(201).json({ userId: doc._id, sessionId });
              });
            }
          }
        );
      }
    });
  }
});

app.listen(8080, () => console.log('Listening on port 8080!'));
