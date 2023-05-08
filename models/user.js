const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const UnauthorizedError = require('../utils/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => {
        const reg = /(^https?:\/\/)?[a-z0-9~_]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i;
        return reg.test(url);
      },
      message: 'Вами указана некорректная ссылка на аватар пользователя',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (value) => isEmail(value),
      message: 'Вами указан некорректный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function func(email, password) {
  return this.findOne({ email }, { runValidators: true })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неверные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('Неверные почта или пароль'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
