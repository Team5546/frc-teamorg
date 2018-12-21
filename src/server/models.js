const mongoose = require('mongoose');
const db = require('./db');

const meetingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  subTeams: {
    type: Array,
    required: true
  },
  attendance: [mongoose.Schema.Types.ObjectId],
  absent: [mongoose.Schema.Types.ObjectId],
  roster: [mongoose.Schema.Types.ObjectId]
});

const Meeting = db.model('Meeting', meetingSchema);

const parentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  }
  // formattedPhone
});

const Parent = db.model('Parent', parentSchema);

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
  parents: [parentSchema],
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
  studentContractPicture: String,
  parentContractPicture: String,
  medicalFormPicture: String,
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
  },
  disciplinaryStrikes: {
    type: Number,
    default: 0
  },
  meetings: [
    {
      attended: Boolean,
      entireTeam: {
        type: Boolean,
        default: false
      },
      meeting: meetingSchema
    }
  ],
  subTeamMeetingsAttended: {
    type: Number,
    default: 0
  },
  teamMeetingsAttended: {
    type: Number,
    default: 0
  }
});

const TeamMember = db.model('TeamMember', teamMemberSchema);

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
  image: String,
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

const sessionsSchema = new mongoose.Schema({
  userId: String,
  sessionId: String
});

const Session = db.model('Session', sessionsSchema);

module.exports = {
  Meeting,
  TeamMember,
  User,
  Parent,
  Session
};
