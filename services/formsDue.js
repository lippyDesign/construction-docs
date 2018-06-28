const mongoose = require('mongoose');
const moment = require("moment");

const ProjectUser = mongoose.model('ProjectUser');

const dueFormsRefreshedAt = '';

const checkingInterval = 3000;

setInterval(async () => {
  try {
    // get all users who are responsible for submitting forms
    const projectUsers = await ProjectUser.find({ "formTypesMustSubmit.0": { "$exists": true } });
    console.log(projectUsers)
    // check the due dates on those forms and check the submission date

    // if due date is more than 24 hours ago and there is still no submission, send notifications

    // insert today's new forms into the forms that users are responsible for
  } catch (e) {
    console.log(e);
  }
}, checkingInterval);