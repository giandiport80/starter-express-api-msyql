const express = require('express');

function routeGroup(router, options, callback) {
  const { prefix = '', middleware = [] } = options;
  const subRouter = express.Router();

  middleware.forEach(mw => subRouter.use(mw));

  callback(subRouter);
  router.use(prefix, subRouter);
}

module.exports = {
  routeGroup,
};
