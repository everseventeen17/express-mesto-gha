const mongoose = require('mongoose');
const constants = require('./constants');
const { NotFoundError } = require('./NotFoundError');
const { ForbiddenError } = require('./ForbiddenError');
const { UnauthorizedError } = require('./UnauthorizedError');

const { CastError, ValidationError } = mongoose.Error;

function handleErrors(err, res) {
  if (err.code === 11000) {
    return res.status(constants.CONFLICT_ERROR_CODE).send({ message: `Ошибка ${constants.CONFLICT_ERROR_CODE}: пользователь с данным email уже существует` });
  }
  if (err instanceof NotFoundError || err instanceof UnauthorizedError
    || err instanceof ForbiddenError) {
    const { message } = err;
    return res.status(err.statusCode).send({ message });
  }
  if (err instanceof CastError || err instanceof ValidationError) {
    return res.status(constants.BAD_REQUEST_ERROR_CODE).send({ message: `Ошибка ${constants.BAD_REQUEST_ERROR_CODE}: переданы некорректные данные` });
  }
  return res.status(constants.SERVER_ERROR_CODE).send({ message: `Ошибка ${constants.SERVER_ERROR_CODE}: На сервере произошла ошибка` });
}

module.exports = handleErrors;
