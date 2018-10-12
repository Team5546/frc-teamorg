/* eslint-disable no-param-reassign */
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('./Users');
const { Session } = require('./Sessions');

const accountsRouter = express.Router();

const { findOrCreateSession } = require('./Sessions');

const globalSaltRounds = 10;

const checkAdminExists = () => {
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
};

accountsRouter.put('/checkUsername', (req, res) => {
  const { username, id } = req.body;
  if (username) {
    User.findOne({ _id: { $ne: id }, username }, {}, (err, doc) => {
      if (doc) {
        console.log('DB: ', doc);
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

accountsRouter.post('/login', (req, res) => {
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

accountsRouter.post('/signup', (req, res) => {
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

module.exports = { accountsRouter, checkAdminExists };
