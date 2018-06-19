const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.post('/api/charge', requireLogin, async (req, res) => {
    
  });
};