const { BAD_REQUEST_ERROR_CODE } = require('constants');

class BadRequestError extends Error {
  constructor(message) {
    super(`Ошибка 400 :${message}`);
    this.statusCode = BAD_REQUEST_ERROR_CODE;
  }
}

module.exports = { BadRequestError };
