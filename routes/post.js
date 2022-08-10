//import library
const express = require("express");
const bodyParser = require("body-parser");
const { Op, where } = require("sequelize");

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//import model
const model = require("../models/index");
const post = model.post;

//import multer
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//config storage image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/image/poster_post");
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname));
    },
});
let upload = multer({ storage: storage });

// get all data
app.get("/", async (req, res) => {
    await post
        .findAll({
            include: [
                {
                    model: model.user,
                    as: "user",
                    attributes: ["id", "name", "username", "email"],
                },
                {
                    model: model.post_category,
                    as: "post_category",
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

// get data by id post
app.get("/:id", async (req, res) => {
    await post
        .findOne({
            where: {
                id: req.params.id,
            },
            include: [
                {
                    model: model.user,
                    as: "user",
                    attributes: ["id", "name", "username", "email"],
                },
                {
                    model: model.post_category,
                    as: "post_category",
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

// get data by author
app.get("/author/:author", async (req, res) => {
    let param = { author: req.params.author };
    await post
        .findAll({ where: param })
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

// add detail post
app.post("/add/detailPost", upload.single("poster"), async (req, res) => {
    const data = {
        author: req.body.author,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        resultArr: {},
    };

    if (req.file) {
        data.poster = req.file.filename;
    } else {
        data.poster = "defaultPoster.jpg";
    }

    await post
        .findAll({
            where: {
                [Op.or]: [{ title: data.title }],
            },
        })
        .then((result) => {
            resultArr = result;
            if (resultArr.length > 0) {
                if (resultArr[0].title == data.title) {
                    res.status(400).json({
                        status: "error",
                        message: "title already exist",
                    });
                }
            } else {
                post.create(data)
                    .then((result) => {
                        res.status(200).json({
                            status: "success",
                            message: "post has been add",
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

// update data
app.put("/edit/:id", upload.single("poster"), async (req, res) => {
    let param = { id: req.params.id };
    const data = {
        author: req.body.author,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        content: req.body.content,
        resultArr: {},
    };

    if (req.file) {
        // get data by id
        post.findOne({ where: param }).then((result) => {
            let oldFileName = result.poster;
            // delete old file
            if (oldFileName != "defaultPoster.png") {
                let dir = path.join(
                    __dirname,
                    "../public/image/poster_post/",
                    oldFileName
                );
                fs.unlink(dir, (err) => err);
            }
        });
        // set new filename
        data.poster = req.file.filename;
    }

    await post;
    post.update(data, { where: param })
        .then((result) => {
            res.status(200).json({
                status: "success",
                message: "post has been update",
            });
        })
        .catch((error) => {
            res.status(400).json({
                status: "error",
                message: error.message,
            });
        });
});

// delete data
app.delete("/delete/:id", async (req, res) => {
    let param = { id: req.params.id };
    // get data by id
    let result = await post.findOne({ where: param });
    if (result.poster != "defaultPoster.png") {
        let oldFileName = result.poster;
        // delete old file
        let dir = path.join(
            __dirname,
            "../public/image/poster_post/",
            oldFileName
        );
        fs.unlink(dir, (error) => error);
    }
    // delete data
    post.destroy({ where: param })
        .then((result) => {
            res.status(200).json({
                status: "success",
                message: "post has been delete",
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
