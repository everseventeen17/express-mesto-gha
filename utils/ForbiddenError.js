const constants = require('constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(`Ошибка 403 :${message}`);
    this.statusCode = constants.FORBIDDEN_ERROR_CODE;
  }
}

module.exports = { ForbiddenError };
