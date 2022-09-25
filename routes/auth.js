const express = require('express');
const router = express.Router();

// middleware
const {authentication} = require('../middleware')

// controllers
const { register, login, updateProfile} = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.patch('/updateProfile', [authentication, updateProfile]);

module.exports = router;