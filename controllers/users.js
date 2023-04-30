const User = require('../models/user');
const {
  NOT_FOUND_ERROR_CODE, BAD_REQUEST_ERROR_CODE,
  SERVER_ERROR_CODE, SUCCESS_CODE,
} = require('../utils/constants');

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: `Ошибка ${NOT_FOUND_ERROR_CODE}: пользователь по указанному id не найден` });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: `Ошибка ${BAD_REQUEST_ERROR_CODE}: некорректынй id` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка ${SERVER_ERROR_CODE}: На сервере произошла ошибка` });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: `Ошибка ${SERVER_ERROR_CODE}: На сервере произошла ошибка` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(SUCCESS_CODE).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: `Ошибка ${BAD_REQUEST_ERROR_CODE}: Переданы некорректные данные при создании пользователя` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка ${SERVER_ERROR_CODE}: На сервере произошла ошибка` });
    });
};

module.exports.updateProfileInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: `Ошибка ${BAD_REQUEST_ERROR_CODE}: Переданы некорректные данные при обновлении профиля` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка ${SERVER_ERROR_CODE}: На сервере произошла ошибка` });
    });
};

module.exports.updateProfileAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: `Ошибка ${BAD_REQUEST_ERROR_CODE}: Переданы некорректные данные при обновлении аватара` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка ${SERVER_ERROR_CODE}: На сервере произошла ошибка` });
    });
};
