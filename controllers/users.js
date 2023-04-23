const User = require('../models/user');

module.exports.getUser = (req, res) => {
    User.findById(req.params.userId)
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            if (err.name === "CastError") {
                return res.status(404).send({message: `Ошибка 404: пользователь по указанному id не найден`})
            }
            return res.status(500).send({ message: `Ошибка 500: ${err.message}`});
        });
};

module.exports.getUsers = (req, res) => {
    User.find({})
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            res.status(500).send({ message: `Ошибка 500: ${err.message}`});
        });
};

module.exports.createUser = (req, res) => {
    const {name, about, avatar} = req.body;
    User.create({name, about, avatar})
        .then((user) => {
            res.send({user})
        })
        .catch((err) =>{
            if (err.name === "ValidationError") {
               return  res.status(400).send({message: `Ошибка 400: Переданы некорректные данные при создании пользователя`})
            }
            res.status(500).send({ message: `Ошибка 500: ${err.message}`});
        });
};

module.exports.updateProfileInfo = (req, res) => {
    const {name, about} = req.body;
    const userId = req.user._id;
    User.findByIdAndUpdate(userId, {name, about})
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(400).send({message: `Ошибка 400: Переданы некорректные данные при обновлении профиля`})
            }
            res.status(500).send({ message: `Ошибка 500: ${err.message}`});
        });
};

module.exports.updateProfileAvatar = (req, res) => {
    const {avatar} = req.body;
    const userId = req.user._id;
    User.findByIdAndUpdate(userId, {avatar})
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(400).send({message: `Ошибка 400: Переданы некорректные данные при обновлении аватара`})
            }
            res.status(500).send({ message: `Ошибка 500: ${err.message}`});
        })
};