/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
const express = require('express');
const mongoose = require('mongoose');
const db = require('./db');

const teamMembersRouter = express.Router();

const teamMemberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  nickname: String,
  grade: {
    type: Number,
    required: true
  },
  major: {
    type: String,
    required: true
  },
  subTeams: {
    type: Array,
    default: []
  },
  email: {
    type: String,
    required: true
  },
  parentEmail: {
    type: String,
    required: true
  },
  parentPhone: {
    type: String,
    required: true
  },
  parentFirstName: {
    type: String,
    required: true
  },
  parentLastName: {
    type: String,
    required: true
  },
  studentContract: {
    type: Boolean,
    default: false
  },
  parentContract: {
    type: Boolean,
    default: false
  },
  medicalForm: {
    type: Boolean,
    default: false
  },
  duesPaid: {
    type: Boolean,
    defualt: false
  }
});

const TeamMember = db.model('TeamMember', teamMemberSchema);

teamMembersRouter.get('/', (req, res) => {
  TeamMember.find((err, doc) => {
    res.json(doc);
  });
});

teamMembersRouter.post('/', (req, res) => {
  const { firstName, lastName, email } = req.body;
  TeamMember.findOne({ firstName, lastName, email }, (err, doc) => {
    if (doc) {
      res
        .status(422)
        .json({ errors: { message: 'Team Member already exists. Please contact support.' } });
    } else {
      TeamMember.create(req.body).then(
        () => {
          res.status(201);
        },
        (err) => {
          res.status(422).json(err);
        }
      );
    }
  });
});

module.exports = { teamMembersRouter, TeamMember };
