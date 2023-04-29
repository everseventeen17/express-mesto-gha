const Card = require('../models/card');
const {
  NOT_FOUND_ERROR_CODE, BAD_REQUEST_ERROR_CODE,
  SERVER_ERROR_CODE, SUCCESS_CODE,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      res.status(SERVER_ERROR_CODE).send({ message: `Ошибка ${SERVER_ERROR_CODE}: ${err}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.status(SUCCESS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: `Ошибка ${BAD_REQUEST_ERROR_CODE}: Переданы некорректные данные при создании карточки` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка ${SERVER_ERROR_CODE}: ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: `Ошибка ${NOT_FOUND_ERROR_CODE}: Карточка с указанным id не найдена.` });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: `Ошибка ${BAD_REQUEST_ERROR_CODE}: Переданы некорректные данные при удалении карточки.` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка  ${SERVER_ERROR_CODE}: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: ownerId } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: `Ошибка ${NOT_FOUND_ERROR_CODE}: Карточка с указанным id не найдена.` });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: `Ошибка ${BAD_REQUEST_ERROR_CODE}: Переданы некорректные данные для постановки лайка.` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка  ${SERVER_ERROR_CODE}: ${err}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: ownerId } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: `Ошибка ${NOT_FOUND_ERROR_CODE}: Карточка с указанным id не найдена.` });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST_ERROR_CODE).send({ message: `Ошибка ${BAD_REQUEST_ERROR_CODE}: Переданы некорректные данные для снятия лайка.` });
      }
      return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка  ${SERVER_ERROR_CODE}: ${err.message}` });
    });
};
