const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;

const handleAuthError = (res) => {
  res.status(401).send({ message: 'Вам необходимо авторизоваться' });
};

module.exports = async (req, res, next) => {
  const cookieAuth = req.cookies.jwt;
  if (!cookieAuth) {
    return handleAuthError(res);
  }
  let payload;
  try {
    payload = await jwt.verify(cookieAuth, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload;
  next();
};
