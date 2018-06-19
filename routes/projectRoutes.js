const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const cleanCache = require('../middlewares/cleanCache');

const Project = mongoose.model('Project');

module.exports = app => {
  // GET a project with a particular id
  app.get('/api/projects/:id', requireLogin, async (req, res) => {
    const project = await Project.findOne({ _id: req.params.id });
    res.send(project);
  });

  // GET all projects that a particular user has access to
  app.get('/api/projects', requireLogin, async (req, res) => {
    const { id } = req.user;
    // find projects in which logged in user is either an owner or a user
    try {
      const projects = await Project.find({ $or: [{ ownerId: id }, { users: id }] }).cache({ key: id });
      res.send(projects);
    } catch(e) {
      console.log(e);
      res.status(500).send('unable to get projects');
    }
  });

  // POST create a new project
  app.post('/api/projects', requireLogin, cleanCache, async (req, res) => {
    const { title, address, city, state, postalCode, startDate, notes, type, users } = req.body;
    const project = new Project({
      title,
      address,
      city,
      state,
      postalCode,
      startDate,
      notes,
      type,
      ownerId: req.user.id,
      users
    });
    try {
      await project.save();
      res.send(project);
    } catch (err) {
      console.log(err);
      res.send(400, 'Unable to create project');
    }
  });

  // PUT update details of a particular project
  app.put('/api/projects/:id', requireLogin, cleanCache, async (req, res) => {
    const { title, address, city, state, postalCode, startDate, notes, type, users } = req.body;
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
        ownerId: req.user.id,
        users
      }, { new: true });
      res.send(updatedProject);
    } catch (err) {
      console.log(err);
      res.send(400, 'Unable to update project');
    }
  });

};