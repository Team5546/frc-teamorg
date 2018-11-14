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
  },
  address1: {
    type: String,
    required: true
  },
  address2: {
    type: String,
    default: ''
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    default: 'VA'
  },
  zipCode: {
    type: String,
    required: true
  }
});

const TeamMember = db.model('TeamMember', teamMemberSchema);

teamMembersRouter.get('/', (req, res) => {
  TeamMember.find((err, doc) => {
    res.json(doc);
  });
});

teamMembersRouter.post('/', (req, res) => {
  const {
    firstName,
    lastName,
    nickname,
    grade,
    major,
    subTeams,
    email,
    parentEmail,
    parentPhone,
    parentFirstName,
    parentLastName,
    address1,
    address2,
    city,
    state,
    zipCode
  } = req.body;
  TeamMember.findOne(
    {
      firstName,
      lastName,
      email
    },
    (err, doc) => {
      if (doc) {
        res.status(422).json({
          errors: { code: 101, message: 'Team Member already exists. Please contact support.' }
        });
      } else {
        const create = TeamMember.create({
          firstName,
          lastName,
          nickname,
          grade,
          major,
          subTeams,
          email,
          parentEmail,
          parentPhone,
          parentFirstName,
          parentLastName,
          address1,
          address2,
          city,
          state,
          zipCode
        });
        console.log(create);
        create.then(() => {
          console.log('saved team member');
          res.status(201).send();
        });
        create.catch((createErr) => {
          res.status(422).json(createErr);
        });
        // create.finally(() => console.log('finally done'));
      }
    }
  );
});

teamMembersRouter.put('/', (req, res) => {
  const {
    _id,
    firstName,
    lastName,
    nickname,
    grade,
    major,
    subTeams,
    email,
    parentEmail,
    parentPhone,
    parentFirstName,
    parentLastName,
    address1,
    address2,
    city,
    state,
    zipCode
  } = req.body;
  TeamMember.findOne(
    {
      firstName,
      lastName,
      email
    },
    (err, doc) => {
      if (doc && doc._id.toString() !== _id) {
        console.log(doc._id, _id);
        res.status(422).json({
          errors: {
            code: 102,
            message: 'Another team member has this name or email, please check your fields.'
          }
        });
      } else {
        TeamMember.findByIdAndUpdate(
          doc._id,
          {
            $set: {
              firstName,
              lastName,
              nickname,
              grade,
              major,
              subTeams,
              email,
              parentEmail,
              parentPhone,
              parentFirstName,
              parentLastName,
              address1,
              address2,
              city,
              state,
              zipCode
            }
          },
          (updateErr, upDoc) => {
            if (updateErr) {
              console.log(updateErr);
              res.status(500).json({ errors: { message: 'An unknown error has occurred.' } });
            } else {
              res.json({ ...upDoc });
            }
          }
        );
        // create.finally(() => console.log('finally done'));
      }
    }
  );
});

module.exports = { teamMembersRouter, TeamMember };
