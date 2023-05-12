const constants = require('constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(`Ошибка 401 :${message}`);
    this.statusCode = constants.UNAUTHORIZED_ERROR_CODE;
  }
}

module.exports = { UnauthorizedError };
