require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');

const app = express();
app.use(cookieParser());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  autoIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use('/', require('./routes/auth'));

app.use(errors());
app.use(auth);
app.use('/users', users);
app.use('/cards', cards);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

app.listen(PORT);
