require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const handleErrors = require('./utils/handleErrors');
const { NotFoundError } = require('./utils/NotFoundError');

const adressError = new NotFoundError('По указанному вами адресу ничего не найдено');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const authRouter = require('./routes/auth');

const { PORT = 3000 } = process.env;
const auth = require('./middlewares/auth');

const app = express();

app.use(cookieParser());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  autoIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => {
    console.log('Подключено к базе данных по адресу mongodb://localhost:27017/mestodb');
  })
  .catch((err) => {
    console.log('Произошла ошибка при подключении к базе данных');
    console.error(err);
  });

app.use('/', authRouter);
app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errors());

app.use('*', (req, res) => {
  handleErrors(adressError, res);
});

app.listen(PORT, () => {
  console.log(`Приложение запущено в порту ${PORT}`);
});
