const express = require('express');
const authenticate = require('../middlewares/authenticate');
const postController = require('../controllers/postController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', authenticate, postController.getAllPosts);
router.post('/', authenticate, upload.single('img'), postController.createPost);
router.delete('/:id', authenticate, postController.deletePost);

module.exports = router;
