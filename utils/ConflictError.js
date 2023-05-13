const constants = require('./constants');

class ConflictError extends Error {
  constructor(message) {
    super(`Ошибка 409 :${message}`);
    this.statusCode = constants.CONFLICT_ERROR_CODE;
  }
}

module.exports = { ConflictError };
