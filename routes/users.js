const userRouter = require('express').Router();
const {
    getUsers, getUser, createUser,
    updateProfileInfo, updateProfileAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:userId', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateProfileInfo);
userRouter.patch('/me/avatar', updateProfileAvatar);

module.exports = userRouter;
