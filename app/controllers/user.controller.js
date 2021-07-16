const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;
const email = require("../utils/sendEmail");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { response } = require("express");
const { user } = require("../models");

const dotenv = require('dotenv');
dotenv.config();

exports.generateToken = (req, res) => {
    var token = jwt.sign({ company: 'Onpassive' }, process.env.secret, {
        expiresIn: 86400 // 24 hours
    });
    res.status(200).send({
        token: token
    })
}

exports.signup = (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
        .then(user => {
            res.send({ message: "User was registered successfully!" });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            var token = jwt.sign({ id: user.id, email: user.email }, process.env.secret, {
                expiresIn: 86400 // 24 hours
            });
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                accessToken: token
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.resetPasswordLink = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user == null) {
                return res.status(404).send({ message: "User Not found." });
            }
            var token = jwt.sign({ id: user.id, email: user.email }, process.env.secret, {
                expiresIn: 300 // 5 min
            });
            console.log("token: ", token);
            const link = `http://localhost:4200/passwordReset?token=${token}`;
            email.sendEmail(
                req.email,
                "Password Reset Request",
                {
                    name: user.username,
                    link: link,
                },
                "/template/requestResetPassword.handlebars"
            ).then(response => {
                res.status(200).send({
                    message: "Reset password link has been set successfully!"
                }
                )
            })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
}

exports.resetPassword = (req, res) => {
    jwt.verify(req.body.token, process.env.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Toekn has been expried, Please regenrate link again!"
            });
        } else {
            User.findOne({
                where: {
                    email: decoded.email
                }
            })
                .then(user => {
                    if (!user) {
                        return res.status(404).send({ message: "User Not found." });
                    }
                    userData = {
                        username: user.username,
                        email: user.email,
                        password: bcrypt.hashSync(req.body.password, 8)
                    }
                    User.update(userData, {
                        where: {
                            email: decoded.email
                        }
                    }).then(user => {
                        res.status(201).send({ message: "Password has been updated sucessfully!" });
                    })
                        .catch(err => {
                            res.status(500).send({ message: err.message });
                        })
                })
                .catch(err => {
                    res.status(500).send({ message: err.message });
                })
        }

    });
}