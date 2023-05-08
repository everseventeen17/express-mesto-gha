const jwt = require('jsonwebtoken');
require('dotenv').config();
const { UnauthorizedError } = require('../utils/UnauthorizedError');

const { JWT_SECRET } = process.env;

module.exports = async (req, res, next) => {
  const cookieAuth = req.cookies.jwt;
  if (!cookieAuth) {
    return next(new UnauthorizedError('Вам необходимо авторизоваться'));
  }
  let payload;
  try {
    payload = await jwt.verify(cookieAuth, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Вам необходимо авторизоваться'));
  }
  req.user = payload;
  return next();
};
