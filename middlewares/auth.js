const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UnauthorizedError } = require('../utils/ForbiddenError');

const { JWT_SECRET } = process.env;

const handleAuthError = () => {
  throw new UnauthorizedError('Вам необходимо авторизоваться');
};

module.exports = async (req, res, next) => {
  const cookieAuth = req.cookies.jwt;
  if (!cookieAuth) {
    return handleAuthError();
  }
  let payload;
  try {
    payload = await jwt.verify(cookieAuth, JWT_SECRET);
  } catch (err) {
    return handleAuthError();
  }
  req.user = payload;
  return next();
};
