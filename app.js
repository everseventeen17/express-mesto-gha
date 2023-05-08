require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT } = process.env;

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();
app.use(cookieParser());
app.use(errors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  autoIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.post('/signup', createUser);
app.post('/signin', login);
app.use(auth);

app.use('/users', users);
app.use('/cards', cards);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

app.listen(PORT);
