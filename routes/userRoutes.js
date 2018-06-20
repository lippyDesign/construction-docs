const mongoose = require('mongoose');

const requireLogin = require('../middlewares/requireLogin');

const User = mongoose.model('User');

module.exports = app => {

  // GET fetch currently login user
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  // GET all users
  app.get('/api/users', requireLogin, async (req, res) => {
    try {
      // TODO: create cache
      const users = await User.find({})
        
      res.send(users);
    } catch(e) {
      console.log(e);
      res.status(400).send('unable to fetch users');
    }
  });

  // GET a user with a particular id
  app.get('/api/users/:id', requireLogin, async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.id });
      res.send(user);
    } catch(e) {
      console.log(e);
      res.status(400).send('unable to fetch user');
    }
  });

};