const mongoose = require('mongoose');
const moment = require('moment');

const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');

const Project = mongoose.model('Project');
const ProjectUser = mongoose.model('ProjectUser');
// const Form = mongoose.model('Form');

const { createFormThatWillBeDue } = require('../services/formsDue');

module.exports = app => {
  // GET a project with a particular id
  app.get('/api/projects/:id', requireLogin, async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      const projectUsers = await ProjectUser.find({ projectId: req.params.id })
        .populate('formTypesMustSubmit')
        .populate('formTypesMustReview')
        .populate('userId', '_id email state city title company lastName firstName imageUrl');
      const accessValidated = projectUsers.some(pUser => pUser.userId.id === req.user.id);
      if (accessValidated) {
        const combined = { ...project.toObject(), projectUsers}
        res.send(combined);
      } else {
        res.status(403).send({});
      }
    } catch (e) {
      console.log(e);
      res.status(500).send('unable to fetch project');
    }
  });

  // GET all projects that a particular user has access to
  app.get('/api/projects', requireLogin, async (req, res) => {
    const { id } = req.user;
    // find projects in which logged in user is either an owner or a user
    try {
      const projectUsers = await ProjectUser.find({ userId: req.user.id }, 'projectId').populate('projectId')
      // TODO: fix cache .cache({ key: id });
      const userProjects = projectUsers.map(p => p.projectId);
      const uniqueUserProjects = [...new Set(userProjects)]; // remove duplicates
      res.send(uniqueUserProjects);
    } catch(e) {
      console.log(e);
      res.status(500).send('unable to get projects');
    }
  });

  // POST create a new project
  app.post('/api/projects', requireLogin, cleanCache, async (req, res) => {
    const { title, address, city, state, postalCode, startDate, notes, type, users, ownerId } = req.body;

    const project = new Project({
      title,
      address,
      city,
      state,
      postalCode,
      startDate: moment(startDate).format(),
      notes,
      type
    });

    try {
      const newProject = await project.save();

      const projectUsers = users.reduce((prev, curr) => {
        let ind;
        let existingUser;
        for (let u = 0; u < prev.length; u++) {
          if (prev[u].userId.toString() === curr.userId) {
            existingUser = prev[u];
            ind = u;
            break;
          }
        }
        if (existingUser) {
          existingUser.formTypesMustSubmit = [ ...existingUser.formTypesMustSubmit, curr.formTypeId];
          const newArr = Object.assign([], prev, { ind: existingUser });
          return newArr;
        } else {
          const us = new ProjectUser({
            userId: curr.userId,
            projectId: newProject._id,
            roles: ['user'],
            formTypesMustSubmit: [curr.formTypeId]
          });
          return [...prev, us];
        }
      }, []);

      let indOwner;
      let existingUserOwner;
      const ownerUserId = ownerId || req.user.id;
      for (let u = 0; u < projectUsers.length; u++) {
        if (projectUsers[u].userId.toString() === ownerUserId) {
          existingUserOwner = projectUsers[u];
          indOwner = u;
          break;
        }
      }
      if (existingUserOwner) {
        existingUserOwner.roles = [...existingUserOwner.roles, 'owner']
        existingUserOwner.formTypesMustReview = users.map(({ formTypeId }) => formTypeId)
        const newArr = Object.assign([], projectUsers, { indOwner: existingUserOwner });
        await Promise.all(newArr.map(user => user.save()));
      } else {
        const projectOwner = new ProjectUser({
          userId: ownerId || req.user.id,
          projectId: newProject._id,
          roles: ['owner'],
          formTypesMustSubmit: [],
          formTypesMustReview: users.map(({ formTypeId }) => formTypeId),
          datePutOnTheProject: startDate
        });
        const combinedUsers = [...projectUsers, projectOwner];
        await Promise.all(combinedUsers.map(user => user.save()));
      }

      const now = Date.now()
      const projectStartDate = + newProject.startDate

      // if project starts today, need to create forms that are due
      if (+now >= projectStartDate) {
        const pUsers = await ProjectUser.find({ projectId: newProject._id });
        await Promise.all(pUsers.reduce((prev, curr) => {
          const fs = curr.formTypesMustSubmit.map(f => {
            return createFormThatWillBeDue({
              dueOn: moment().format(),
              formTypeId: f,
              projectId: newProject._id,
              shouldBeSubmittedBy: curr.userId
            })
          });
          return [...prev, ...fs]
        }, []));
      }
      
      res.send(newProject);
    } catch (err) {
      console.log(err);
      res.status(400).send('Unable to create project');
    }
  });

  // PUT update details of a particular project
  app.put('/api/projects/:id', requireLogin, cleanCache, async (req, res) => {
    const { title, address, city, state, postalCode, startDate, notes, type, users, ownerId } = req.body;
    try {
      const updatedProject = await Project.findByIdAndUpdate(req.params.id, {
        title,
        address,
        city,
        state,
        postalCode,
        startDate,
        notes,
        type,
      }, { new: true });

      // remove all project people
      await ProjectUser.remove({ projectId: updatedProject._id })

      const projectUsers = users.reduce((prev, curr) => {
        let ind;
        let existingUser;
        for (let u = 0; u < prev.length; u++) {
          if (prev[u].userId.toString() === curr.userId) {
            existingUser = prev[u];
            ind = u;
            break;
          }
        }
        if (existingUser) {
          existingUser.formTypesMustSubmit = [ ...existingUser.formTypesMustSubmit, curr.formTypeId];
          const newArr = Object.assign([], prev, { ind: existingUser });
          return newArr;
        } else {
          const us = new ProjectUser({
            userId: curr.userId,
            projectId: updatedProject._id,
            roles: ['user'],
            formTypesMustSubmit: [curr.formTypeId]
          });
          return [...prev, us];
        }
      }, []);

      let indOwner;
      let existingUserOwner;
      const ownerUserId = ownerId || req.user.id;
      for (let u = 0; u < projectUsers.length; u++) {
        if (projectUsers[u].userId.toString() === ownerUserId) {
          existingUserOwner = projectUsers[u];
          indOwner = u;
          break;
        }
      }
      if (existingUserOwner) {
        existingUserOwner.roles = [...existingUserOwner.roles, 'owner']
        existingUserOwner.formTypesMustReview = users.map(({ formTypeId }) => formTypeId)
        const newArr = Object.assign([], projectUsers, { indOwner: existingUserOwner });
        await Promise.all(newArr.map(user => user.save()));
      } else {
        const projectOwner = new ProjectUser({
          userId: ownerId || req.user.id,
          projectId: newProject._id,
          roles: ['owner'],
          formTypesMustSubmit: [],
          formTypesMustReview: users.map(({ formTypeId }) => formTypeId),
          datePutOnTheProject: startDate
        });
        const combinedUsers = [...projectUsers, projectOwner];
        await Promise.all(combinedUsers.map(user => user.save()));
      }

      res.send(updatedProject);
    } catch (err) {
      console.log(err);
      res.status(400).send('Unable to update project');
    }
  });

};