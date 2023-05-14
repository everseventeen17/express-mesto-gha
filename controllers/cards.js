const Card = require('../models/card');
const {
  SUCCESS_CODE,
} = require('../utils/constants');
const handleErrors = require('../utils/handleErrors');
const { NotFoundError } = require('../utils/NotFoundError');
const { ForbiddenError } = require('../utils/ForbiddenError');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => handleErrors(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => {
      res.status(SUCCESS_CODE).send(card);
    })
    .catch((err) => handleErrors(err, res));
};

module.exports.deleteCard = (req, res) => {
  const removeCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Карточка с указанным id  не существует');
        }
        const ownerId = card.owner.id;
        const userId = req.user._id;
        if (ownerId !== userId) {
          throw new ForbiddenError('Невозможно удалить чужую карточку');
        }
        res.status(SUCCESS_CODE).send(card);
      })
      .catch((err) => handleErrors(err, res));
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
    .catch((err) => handleErrors(err, res));
};

module.exports.likeCard = (req, res) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: ownerId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      return res.send(card);
    })
    .catch((err) => handleErrors(err, res));
};

module.exports.dislikeCard = (req, res) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: ownerId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      }
      return res.send(card);
    })
    .catch((err) => handleErrors(err, res));
};
