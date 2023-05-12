const constants = require('constants');

class NotFoundError extends Error {
  constructor(message) {
    super(`Ошибка 404 :${message}`);
    this.statusCode = constants.NOT_FOUND_ERROR_CODE;
  }
}

module.exports = { NotFoundError };
