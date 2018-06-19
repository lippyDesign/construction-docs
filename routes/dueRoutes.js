const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.get('/api/due/forms', requireLogin, async (req, res) => {
    
  });
};