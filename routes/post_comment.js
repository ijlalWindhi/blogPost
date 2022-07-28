//import library
const express = require("express");
const bodyParser = require("body-parser");
const { Op, DATE } = require("sequelize");

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

// add comments
app.post("/add", async (req, res) => {
    const data = {
        id_post: req.body.id_post,
        id_user: req.body.id_user,
        title: req.body.title,
        content: req.body.content,
        publishedAt: new Date(),
    };

    await comments
        .create(data)
        .then((result) => {
            res.status(201).json({
                status: "success",
                message: "comments has ben add",
            });
        })
        .catch((error) => {
            res.status(400).json({
                status: "error",
                message: error.message,
            });
        });
});

// update comments
app.put("/edit/:id", async (req, res) => {
    const data = {
        title: req.body.title,
        content: req.body.content,
        publishedAt: new Date(),
    };
    await comments
        .update(data, {
            where: {
                id: req.params.id,
            },
        })
        .then((result) => {
            res.status(200).json({
                status: "success",
                message: "data has been updated",
            });
        })
        .catch((error) => {
            res.status(400).json({
                status: "error",
                message: error.message,
            });
        });
});

// delete comments
app.delete("/delete/:id", async (req, res) => {
    await comments
        .destroy({
            where: {
                id: req.params.id,
            },
        })
        .then((result) => {
            res.status(200).json({
                status: "success",
                message: "data has been deleted",
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
