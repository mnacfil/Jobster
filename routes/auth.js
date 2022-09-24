const express = require('express');
const router = express.Router();

const { register, login, updateProfile} = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.patch('/updateProfile', updateProfile);

module.exports = router;