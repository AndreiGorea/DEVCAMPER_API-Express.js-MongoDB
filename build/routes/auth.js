"use strict";
// @ts-ignore
const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, logout, updatePassword } = require('../controllers/auth');
// @ts-ignore
const router = express.Router();
// @ts-ignore
const { protect } = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
module.exports = router;
