const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');

const Project = mongoose.model('Project');
const ProjectUser = mongoose.model('ProjectUser');

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
      startDate,
      notes,
      type
    });

    try {
      const newProject = await project.save();

      const projectOwner = new ProjectUser({
        userId: ownerId || req.user.id,
        projectId: newProject._id,
        roles: ['owner'],
        formTypesMustSubmit: [],
        formTypesMustReview: users.map(({ formTypeId }) => formTypeId),
        datePutOnTheProject: startDate
      });

      const projectUsers = users.reduce((prev, curr) => {
        let ind;
        const alreadyExists = prev.find((e, i) => {
          if (e.userId === curr.userId) ind = i;
          return e.userId === curr.userId
        });
        if (alreadyExists) {
          alreadyExists.formTypesMustSubmit = [ ...alreadyExists.formTypesMustSubmit, u.formTypeId];
          prev[ind] = alreadyExists;
          return prev;
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

      const combinedUsers = [...projectUsers, projectOwner];

      await Promise.all(combinedUsers.map(user => user.save()));

      res.send(project);
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
        ownerId: ownerId || req.user.id,
        users
      }, { new: true });

      // remove all project people
      await ProjectUser.remove({ projectId: updatedProject._id })

      // add new object people
      const projectOwner = new ProjectUser({
        userId: ownerId || req.user.id,
        projectId: updatedProject._id,
        roles: ['owner'],
        formTypesMustSubmit: [],
        formTypesMustReview: users.map(({ formTypeId }) => formTypeId),
        datePutOnTheProject: startDate
      });

      const projectUsers = users.reduce((prev, curr) => {
        let ind;
        const alreadyExists = prev.find((e, i) => {
          if (e.userId === curr.userId) ind = i;
          return e.userId === curr.userId
        });
        if (alreadyExists) {
          alreadyExists.formTypesMustSubmit = [ ...alreadyExists.formTypesMustSubmit, u.formTypeId];
          prev[ind] = alreadyExists;
          return prev;
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

      const combinedUsers = [...projectUsers, projectOwner];

      await Promise.all(combinedUsers.map(user => user.save()));

      res.send(updatedProject);
    } catch (err) {
      console.log(err);
      res.status(400).send('Unable to update project');
    }
  });

};