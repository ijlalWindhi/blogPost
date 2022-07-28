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

//import multer
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//config storage image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/image/profile");
    },
    filename: (req, file, cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname));
    },
});
let upload = multer({ storage: storage });

// get all data user
app.get("/", async (req, res) => {
    user.findAll()
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

// get data user by id
app.get("/:id", async (req, res) => {
    user.findByPk(req.params.id)
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

// insert data user
app.post("/register", upload.single("profile"), async (req, res) => {
    user.create({
        name: req.body.name,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        role: req.body.role,
        location: req.body.location,
        website: req.body.website,
        status: req.body.status,
        profile: "userProfile.svg",
        // profile: req.file.filename,
    })
        .then((result) => {
            res.status(200).json({
                status: "success",
                message: "user has been added",
            });
        })
        .catch((err) => {
            res.status(400).json({
                status: "error",
                message: err.message,
            });
        });
});

// delete data user
app.delete("/delete/:id", async (req, res) => {
    let param = {
        id: req.params.id,
    };
    let result = await user.findOne({ where: param });
    if (result.profile != "userProfile.svg") {
        let oldFileName = result.profile;
        // delete old file
        let dir = path.join(__dirname, "../public/image/profile/", oldFileName);
        fs.unlink(dir, (err) => err);
    }

    // delete data
    user.destroy({ where: param })
        .then((result) => {
            res.json({
                status: "success",
                message: "user has been deleted",
            });
        })
        .catch((error) => {
            res.json({
                status: "error",
                message: error.message,
            });
        });
});

module.exports = app;
