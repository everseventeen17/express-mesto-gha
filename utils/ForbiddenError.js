const FORBIDDEN_ERROR_CODE = require('constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(`Ошибка 403 :${message}`);
    this.statusCode = FORBIDDEN_ERROR_CODE;
  }
}

module.exports = { ForbiddenError };
