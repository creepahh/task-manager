const express = require('express');

const sequelize = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');

const router = express.Router();

router.post('/register', async (req, res) => {

    res.json({ message: 'Register route hit!' });
});
router.post('/login', async (req, res) => {

    res.json({ message: 'Login route hit!' });
});


module.exports = router;

