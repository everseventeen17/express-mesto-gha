const Card = require('../models/card');
const {
  SUCCESS_CODE,
} = require('../utils/constants');
const { NotFoundError } = require('../utils/NotFoundError');
const { BadRequestError } = require('../utils/BadRequestError');
const { ForbiddenError } = require('../utils/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.status(SUCCESS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const removeCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка с указанным id  не существует');
        }
        res.send(card);
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          return next(new BadRequestError('Переданы некорректные данные при удалении карточки'));
        }
        return next(err);
      });
  };

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id  не существует');
      }
      if (req.user._id === card.owner.toString()) {
        return removeCard();
      }
      throw new ForbiddenError('Вы не можете удалить чужую карточку');
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: ownerId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: ownerId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      }
      return next(err);
    });
};
