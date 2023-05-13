const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUser, getMe,
  updateProfileInfo, updateProfileAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getMe);

userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().hex().length(24),
    }),
  }),
  getUser,
);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfileInfo,
);
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().min(2).uri(),
    }),
  }),
  updateProfileAvatar,
);

module.exports = userRouter;
