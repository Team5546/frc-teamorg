/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
const express = require('express');
const { TeamMember } = require('./models.js');

const teamMembersRouter = express.Router();

teamMembersRouter.get('/', (req, res) => {
  TeamMember.find((err, doc) => {
    res.json(doc);
  });
});

teamMembersRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  TeamMember.findById(id, (err, doc) => {
    if (err) res.status(500).send();
    else res.json(doc);
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
    parents,
    address1,
    address2,
    city,
    state,
    zipCode,
    studentContract,
    parentContract,
    medicalForm,
    duesPaid,
    leftTeam
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
          parents,
          address1,
          address2,
          city,
          state,
          zipCode,
          studentContract: studentContract || false,
          parentContract: parentContract || false,
          medicalForm: medicalForm || false,
          duesPaid: duesPaid || false,
          leftTeam
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
    parents,
    address1,
    address2,
    city,
    state,
    zipCode,
    medicalForm,
    studentContract,
    parentContract,
    medicalFormPicture,
    studentContractPicture,
    parentContractPicture,
    duesPaid,
    leftTeam
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
              parents,
              address1,
              address2,
              city,
              state,
              zipCode,
              medicalForm,
              studentContract,
              parentContract,
              medicalFormPicture,
              studentContractPicture,
              parentContractPicture,
              duesPaid,
              leftTeam
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

module.exports = { teamMembersRouter };
