//import library
const express = require("express");
const bodyParser = require("body-parser");
const { Op } = require("sequelize");

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index");
const comments = model.post_comment;

// get all data
app.get("/", async (req, res) => {
    await comments
        .findAll()
        .then((result) => {
            res.status(200).json({
                status: "success",
                data: result,
            });
        })
        .catch((error) => {
            res.status(400).json({
                status: "error",
                message: error.message,
            });
        });
});

// get all data by user
app.get("/user/:id", async (req, res) => {
    await comments
        .findAll({
            where: {
                id_user: req.params.id,
            },
            include: [
                {
                    model: model.user,
                    as: "user",
                    attributes: ["id", "name", "username", "email"],
                },
            ],
        })
        .then((result) => {
            res.status(200).json({
                status: "success",
                data: result,
            });
        })
        .catch((error) => {
            res.status(400).json({
                status: "error",
                message: error.message,
            });
        });
});

// get all data by post
app.get("/post/:id", async (req, res) => {
    await comments
        .findAll({
            where: {
                id_post: req.params.id,
            },
            include: [
                {
                    model: model.post,
                    as: "post",
                    attributes: ["id", "title"],
                },
            ],
        })
        .then((result) => {
            res.status(200).json({
                status: "success",
                data: result,
            });
        })
        .catch((error) => {
            res.status(400).json({
                status: "error",
                message: error.message,
            });
        });
});

module.exports = app;
