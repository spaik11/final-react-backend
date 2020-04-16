const express = require('express');
const router = express.Router();
const userValidation = require('../users/utils/userValidation');

require('../../lib/passport');

const { 
    getAllUsers,
    register,
    login,
    logout
} = require('../users/controllers/userController');

router.get('/getallusers', getAllUsers);
router.post('/register', userValidation, register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;