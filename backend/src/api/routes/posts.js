const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const Post = require('../models/post');

const postController = require('../controllers/posts');

router.post('/', authenticate, postController.createPost);
router.delete('/:id', authenticate, postController.deletePost);
router.post('/like/:id', authenticate, postController.likePost);
router.post('/unlike/:id', authenticate, postController.unlikePost);
router.post('/comment/:id', authenticate, postController.addComment);
router.get('/:id', postController.getPost);
router.get('/', authenticate, postController.getAllPosts);

module.exports = router;
