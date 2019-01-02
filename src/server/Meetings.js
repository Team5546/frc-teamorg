/* eslint-disable no-param-reassign */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-syntax */
const express = require('express');
const { Meeting, TeamMember } = require('./models.js');

const meetingsRouter = express.Router();

meetingsRouter.get('/', (req, res) => {
  Meeting.find((err, doc) => {
    doc.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(doc);
  });
});

meetingsRouter.post('/', (req, res) => {
  const { date, subTeams } = req.body;
  const roster = [];
  TeamMember.find((err, teamMembers) => {
    for (const member of teamMembers) {
      console.log(`------------\n${member.firstName}\n------------`);
      for (const subTeam of subTeams) {
        console.log(`${subTeam}: ${member.subTeams.indexOf(subTeam)}`);
        if (roster.indexOf(member._id) === -1 && member.subTeams.indexOf(subTeam) !== -1) {
          roster.push(member._id);
        }
      }
    }
    Meeting.create({
      date,
      subTeams,
      roster,
      attendance: [],
      absent: []
    })
      .then(doc => res.status(201).json(doc))
      .catch(createErr => res.status(422).json(createErr));
  });
});

function meetingExists(obj, list) {
  let i;
  for (i = 0; i < list.length; i += 1) {
    // console.log(`Meeting In List: ${typeof list[i].meeting._id.toString()}`);
    // console.log(`Meeting: ${typeof obj._id.toString()}`);
    if (list[i].meeting._id.toString() === obj._id.toString()) {
      return true;
    }
  }

  return false;
}

meetingsRouter.put('/:id', (req, res) => {
  const { date, subTeams, attendance } = req.body;
  const { id } = req.params;
  const roster = [];
  // console.log(`Roster: ${roster}`);
  TeamMember.find((err, teamMembers) => {
    for (const member of teamMembers) {
      // console.log(`------------\n${member.firstName}\n------------`);
      for (const subTeam of subTeams) {
        // console.log(`${subTeam}: ${member.subTeams.indexOf(subTeam)}`);
        if (roster.indexOf(member._id) === -1 && member.subTeams.indexOf(subTeam) !== -1) {
          roster.push(member._id);
        }
      }
    }
    // console.log(attendance.length);
    const absent = attendance
      ? roster.filter(i => attendance.map(a => a.toString()).indexOf(i.toString()) === -1)
      : roster;
    Meeting.findByIdAndUpdate(
      id,
      {
        $set: {
          date,
          subTeams,
          attendance,
          absent
        }
      },
      (updateErr, upDoc) => {
        // if (roster.length === 0) roster = roster.concat(attendance).concat(absent);
        // console.log('-----');
        // console.log(`Roster: ${roster}`);
        // console.log(`Attendance: ${attendance}`);
        // console.log(`Absent: ${absent}`);
        // console.log('-----');
        let totalEdited = 0;
        for (let memberIndex = 0; memberIndex < roster.length; memberIndex += 1) {
          const memberId = roster[memberIndex];
          const memberCount = roster.length;
          TeamMember.findById(memberId, (e, doc) => {
            const { _id, meetings } = doc;
            const attended = attendance.includes(memberId.toString());
            const entireTeam = subTeams.length === 6;

            let totalSubTeamMeetings = 0;
            let totalSubTeamMeetingsAttended = 0;
            let totalTeamMeetings = 0;
            let totalTeamMeetingsAttended = 0;

            // console.log('\n');
            // console.log(`-----${memberId}-----`);
            // console.log(`Attended: ${attended}`);

            if (!entireTeam) {
              if (attended) {
                totalSubTeamMeetingsAttended += 1;
              }
              totalSubTeamMeetings += 1;
            } else {
              if (attended) {
                totalTeamMeetingsAttended += 1;
                // console.log('----------DEBUG 1----------');
              }
              totalTeamMeetings += 1;
            }

            for (const meeting of meetings) {
              // console.log('----------');
              // console.log(`upDoc: ${upDoc._id.toString()}`);
              // console.log(`m: ${meeting.meeting._id.toString()}`);
              // console.log(`${meetings.filter(m => m._id.toString() === upDoc._id.toString())}`);
              // console.log('----------');
              if (meeting.meeting._id.toString() !== upDoc._id.toString()) {
                if (meeting.entireTeam) {
                  if (meeting.attended) totalTeamMeetingsAttended += 1;
                  totalTeamMeetings += 1;
                } else {
                  if (meeting.attended) {
                    totalSubTeamMeetingsAttended += 1;
                    // console.log('----------DEBUG 2----------');
                  }
                  totalSubTeamMeetings += 1;
                }
              }
            }
            // console.log('-----Meeting Totals-----');
            // console.log(`sub team: ${totalSubTeamMeetings}`);
            // console.log(`team: ${totalTeamMeetings}`);
            // console.log('-----Meeting Attendance-----');
            // console.log(`sub team attended: ${totalSubTeamMeetingsAttended}`);
            // console.log(`team attended: ${totalTeamMeetingsAttended}`);

            const subTeamMeetingsAttended =
              totalSubTeamMeetings > 0
                ? Math.floor((totalSubTeamMeetingsAttended / totalSubTeamMeetings) * 100)
                : 0;
            const teamMeetingsAttended =
              totalTeamMeetings > 0
                ? Math.floor((totalTeamMeetingsAttended / totalTeamMeetings) * 100)
                : 0;
            // console.log('-----Meeting Stats-----');
            // console.log(`sub team: ${subTeamMeetingsAttended}`);
            // console.log(`team: ${teamMeetingsAttended}`);
            // console.log('-----Meeting Exists In User-----');
            // console.log(meetingExists(upDoc, meetings));
            // console.log('\n');
            if (meetingExists(upDoc, meetings)) {
              totalEdited += 1;
              console.log(`Meeting Exist\tTotal: ${totalEdited}`);
              TeamMember.updateOne(
                { _id, 'meetings.meeting._id': upDoc._id },
                {
                  $set: {
                    subTeamMeetingsAttended,
                    teamMeetingsAttended,
                    'meetings.$': {
                      attended,
                      entireTeam,
                      meeting: upDoc
                    }
                  }
                },
                (error, raw) => {
                  console.log(`Edited in array: ${_id}\t${raw.toString()}`);
                  if (error) console.error(error);
                  if (memberIndex === memberCount - 1) {
                    if (updateErr) {
                      console.log(updateErr);
                      res
                        .status(500)
                        .json({ errors: { message: 'An unknown error has occurred.' } });
                    } else {
                      res.json({ ...upDoc });
                    }
                  }
                }
              );
            } else {
              totalEdited += 1;
              console.log(`Meeting Not Exist\tTotal: ${totalEdited}`);
              TeamMember.findByIdAndUpdate(
                _id,
                {
                  $addToSet: {
                    meetings: {
                      attended,
                      entireTeam,
                      meeting: upDoc
                    }
                  },
                  $set: { subTeamMeetingsAttended, teamMeetingsAttended }
                },
                error => {
                  console.log('Added to array');
                  if (error) console.error(error);
                  if (memberIndex === memberCount - 1) {
                    if (updateErr) {
                      console.log(updateErr);
                      res
                        .status(500)
                        .json({ errors: { message: 'An unknown error has occurred.' } });
                    } else {
                      res.json({ ...upDoc });
                    }
                  }
                }
              );
            }
          });
        }
      }
    );
  });
});

meetingsRouter.delete('/:id', (req, res) => {
  const { id } = req.params;
  Meeting.deleteOne({ _id: id }, err => {
    console.log('saved');
    if (err) res.status(500).json({ errors: err });
    else res.status(200).send();
  });
});

module.exports = { meetingsRouter };
