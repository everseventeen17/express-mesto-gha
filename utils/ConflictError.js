const CONFLICT_ERROR_CODE = require('constants');

class ConflictError extends Error {
  constructor(message) {
    super(`Ошибка 409 :${message}`);
    this.statusCode = CONFLICT_ERROR_CODE;
  }
}

module.exports = { ConflictError };
