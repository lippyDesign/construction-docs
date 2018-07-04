const mongoose = require('mongoose');
const schedule = require('node-schedule');

const Form = mongoose.model('Form');

const ProjectUser = mongoose.model('ProjectUser');

schedule.scheduleJob({hour: 00, minute: 00}, async () => {
  try {
    const pUsers = await ProjectUser.find({});
    await Promise.all(pUsers.reduce((prev, curr) => {
      const { userId, projectId } = curr;
      const fs = curr.formTypesMustSubmit.map(f => {
        return createFormThatWillBeDue({
          dueOn: moment().format(),
          formTypeId: f,
          projectId,
          shouldBeSubmittedBy: userId
        })
      });
      return [...prev, ...fs]
    }, []));
  } catch (e) {
    console.log(e)
  }
});

const createFormThatWillBeDue = async ({ dueOn, formTypeId, projectId, shouldBeSubmittedBy }) => {
  const form = new Form({
    dueOn,
    formTypeId,
    projectId,
    shouldBeSubmittedBy
  });

  return await form.save();
}

module.exports = {
  createFormThatWillBeDue
};