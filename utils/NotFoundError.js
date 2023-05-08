const NOT_FOUND_ERROR_CODE = require('constants');

class NotFoundError extends Error {
  constructor(message) {
    super(`Ошибка 404 :${message}`);
    this.statusCode = NOT_FOUND_ERROR_CODE;
  }
}

module.exports = { NotFoundError };
