const express = require('express');
const router = express.Router();
const helper = require('../helpers');

const AuthMiddleware = require('../middleware/AuthMiddleware');
const AuthController = require('../controllers/AuthController');
const PostController = require('../controllers/PostController');
const UserController = require('../controllers/UserController');

router.get('/hello', function (req, res) {
  res.status(200).json({
    success: true,
    message: 'Hello world',
  });
});

router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.post('/auth/logout', AuthController.logout);
router.post('/auth/refresh-token', AuthController.refreshToken);

helper.routeGroup(
  router,
  {
    middleware: [AuthMiddleware],
  },
  function (router) {
    router.get('/users', UserController.index);
    router.post('/users', UserController.store);
    router.get('/users/:id', UserController.show);
    router.put('/users/:id', UserController.update);
    router.delete('/users/:id', UserController.delete);
  }
);

router.use('/posts', AuthMiddleware);
router.get('/posts', PostController.index);
router.post('/posts', PostController.store);
router.get('/posts/:id', PostController.show);
router.put('/posts/:id', PostController.update);
router.delete('/posts/:id', PostController.delete);

router.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

module.exports = router;
