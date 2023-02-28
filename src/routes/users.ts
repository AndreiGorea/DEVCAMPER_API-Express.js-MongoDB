// @ts-ignore
const express = require("express");

// We are merging url params when we create courseRouter
// @ts-ignore
const router = express.Router({mergeParams: true});
// @ts-ignore
const advancedResults = require('../middleware/advancedResults');
// @ts-ignore
const { protect, authorize } = require('../middleware/auth');

const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    createUser
} = require('../controllers/users');

// @ts-ignore
const User = require('../models/User');

// Anything below this it is going to use protect
router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
