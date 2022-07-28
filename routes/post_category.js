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
const postCategory = model.post_category;

// get all data
app.get("/", async (req, res) => {
    await postCategory
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

// add data
app.post("/add", async (req, res) => {
    const data = {
        title: req.body.title,
        resultArr: {},
    };
    await postCategory
        .findAll({
            where: {
                [Op.or]: [{ title: req.body.title }],
            },
        })
        .then((result) => {
            data.resultArr = result;
            if (data.resultArr.length > 0) {
                res.status(400).json({
                    status: "error",
                    message: "Data already exist",
                });
            } else {
                postCategory
                    .create(data)
                    .then((result) => {
                        res.status(201).json({
                            status: "success",
                            message: "data has been added",
                        });
                    })
                    .catch((error) => {
                        res.status(400).json({
                            status: "error",
                            message: error.message,
                        });
                    });
            }
        });
});

// edit data
app.put("/edit/:id", async (req, res) => {
    const data = {
        title: req.body.title,
        resultArr: {},
    };
    await postCategory
        .findAll({
            where: {
                [Op.or]: [{ title: req.body.title }],
            },
        })
        .then((result) => {
            data.resultArr = result;
            if (data.resultArr.length > 0) {
                res.status(400).json({
                    status: "error",
                    message: "Data already exist",
                });
            } else {
                postCategory
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
            }
        });
});

// delete data
app.delete("/delete/:id", async (req, res) => {
    await postCategory
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
