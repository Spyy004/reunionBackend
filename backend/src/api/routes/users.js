const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const User = require('../models/user');

const userController = require('../controllers/users');

router.post('/authenticate', userController.authenticate);
router.get('/user',authenticate, userController.getUser);
router.post('/follow/:id',authenticate, userController.followUser);
router.post('/unfollow/:id',authenticate, userController.unfollowUser);
router.post('/',userController.createUser);


module.exports = router;
