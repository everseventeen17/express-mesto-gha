const constants = require('./constants');

class BadRequestError extends Error {
  constructor(message) {
    super(`Ошибка 400 :${message}`);
    this.statusCode = constants.BAD_REQUEST_ERROR_CODE;
  }
}

module.exports = { BadRequestError };
