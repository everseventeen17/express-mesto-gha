const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET } = process.env;
const User = require('../models/user');
const {
  SUCCESS_CODE,
} = require('../utils/constants');
const { NotFoundError } = require('../utils/NotFoundError');
const { BadRequestError } = require('../utils/BadRequestError');
const { UnauthorizedError } = require('../utils/UnauthorizedError');
const { ConflictError } = require('../utils/ConflictError');

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорретный id'));
        return;
      }
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) throw new BadRequestError('Email или пароль не могут быть пустыми');
  const createUser = (hash) => User.create({
    name, about, avatar, email, password: hash,
  });
  bcrypt
    .hash(password, 10)
    .then((hash) => createUser(hash))
    .then((user) => {
      res.status(SUCCESS_CODE).send({ user });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

module.exports.updateProfileInfo = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорретные данные при обновлении профиля'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорретный id'));
      }
      return next(err);
    });
};

module.exports.updateProfileAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Введены некорретные данные при обновлении аватара'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорретный id'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Необходимо авторизоваться'));
    });
};
