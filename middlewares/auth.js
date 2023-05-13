const jwt = require('jsonwebtoken');
require('dotenv').config();

const { JWT_SECRET } = process.env;

const authError = (res) => {
  res.status(401).send({ message: 'Вам необходимо авторизоваться' });
};

module.exports = async (req, res, next) => {
  const cookieAuth = req.cookies.jwt;
  if (!cookieAuth) {
    return authError(res);
  }
  let payload;
  try {
    payload = await jwt.verify(cookieAuth, JWT_SECRET);
  } catch (err) {
    return authError(res);
  }
  req.user = payload;
  return next();
};
