const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  await next(); // wait for next to be complete (run handler will route first and clear hash will run after)

  clearHash(req.user.id);
}