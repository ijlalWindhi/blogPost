//import library
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index");
const user = model.user;

// get all data user
app.get("/", (req, res) => {
    user.findAll()
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

// get data user by id
app.get("/:id", (req, res) => {
    user.findByPk(req.params.id)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.send(err);
        });
});

module.exports = app;
