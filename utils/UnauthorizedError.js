const UNAUTHORIZED_ERROR_CODE = require('constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(`Ошибка 401 :${message}`);
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
  }
}

module.exports = { UnauthorizedError };
