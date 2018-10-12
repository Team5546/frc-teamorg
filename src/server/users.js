/* eslint-disable no-param-reassign */
const express = require('express');
const mongoose = require('mongoose');
const db = require('./db');

const userRouter = express.Router();

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
  },
  lastModified: Date,
  modifiedBy: String
});

const User = db.model('User', userSchema, 'users');

userRouter.get('/', (req, res) => {
  User.find({}, '-password', (err, doc) => {
    res.json(doc);
  });
});

userRouter.get('/:id', (req, res) => {
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

userRouter.put('/:id', (req, res) => {
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
    User.findOne({ $and: [{ username }, { _id: { $ne: id } }] }, (err, doc) => {
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

userRouter.delete('/:id', (req, res) => {
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

module.exports = { userRouter, User };
