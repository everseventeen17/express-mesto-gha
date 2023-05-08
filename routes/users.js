const userRouter = require('express').Router();
const {
  getUsers, getUser, createUser, getMe,
  updateProfileInfo, updateProfileAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getMe);
userRouter.get('/:userId', getUser);
userRouter.post('/', createUser);
userRouter.patch('/me', updateProfileInfo);
userRouter.patch('/me/avatar', updateProfileAvatar);

module.exports = userRouter;
