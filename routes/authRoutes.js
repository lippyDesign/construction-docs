const mongoose = require('mongoose');
const passport = require('passport');
const { login, signup } = require('../services/passport');

const User = mongoose.model('User');

module.exports = app => {

  // GET fetch currently login user
  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });

  // PUT update user profile info
  app.put('/api/update_user_profile', async (req, res) => {
    const { firstName, lastName, company, title, city, state } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        firstName,
        lastName,
        company,
        title,
        city,
        state
      }, { new: true });
      res.send(updatedUser);
    } catch (err) {
      console.log(err);
      res.send(400, 'Unable to update user');
    }
  });

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect('/');
  });

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.send({});
  });

  // POST sign up with email and password
  app.post('/auth/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await signup({ email, password, req });
      res.send(user);
    } catch(e) {
      res.status(400).send('Email in use');
    }
  });

  // POST login with email and password
  app.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await login({ email, password, req });
      res.send(user);
    } catch(e) {
      res.status(400).send(e);
    }
  });

};