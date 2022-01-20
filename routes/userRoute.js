const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/me', authenticate, userController.getMe);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.patch(
  '/profile-img',
  authenticate, // req.user
  upload.single('profileImg'), // req.file
  userController.updateProfileImg
);

module.exports = router;
