//import library
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

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

// get all data
app.get("/", async (req, res) => {
    await user
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

// get data by id
app.get("/:id", async (req, res) => {
    await user
        .findByPk(req.params.id)
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

// register
app.post("/register", upload.single("profile"), async (req, res) => {
    const data = {
        name: req.body.name,
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        role: req.body.role,
        location: "Indonesia",
        website: "auvers.netlify.app",
        status: "Alway Happy",
        profile: "userProfile.svg",
        resultArr: {},
    };
    await user
        .findAll({
            where: {
                [Op.or]: [{ email: data.email }, { username: data.username }],
            },
        })
        .then((result) => {
            resultArr = result;
            if (resultArr.length > 0) {
                if (resultArr[0].email == data.email) {
                    res.status(400).json({
                        status: "error",
                        message: "email already exist",
                    });
                } else {
                    res.status(400).json({
                        status: "error",
                        message: "username already exist",
                    });
                }
            } else {
                user.create(data)
                    .then((result) => {
                        res.status(200).json({
                            status: "success",
                            message: "Success register",
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

// login
app.post("/login", async (req, res) => {
    const data = await user.findOne({ where: { username: req.body.username } });

    if (data) {
        const validPassword = await bcrypt.compare(
            req.body.password,
            data.password
        );
        if (validPassword) {
            res.status(200).json({
                status: "success",
                logged: true,
                message: "valid password",
                data: data,
            });
        } else {
            res.status(400).json({
                status: "error",
                logged: false,
                message: "invalid Password",
            });
        }
    } else {
        res.status(400).json({
            status: "error",
            message: "user does not exist",
        });
    }
});

// delete data
app.delete("/delete/:id", async (req, res) => {
    let param = {
        id: req.params.id,
    };
    let result = await user.findOne({ where: param });
    if (result.profile != "userProfile.svg") {
        let oldFileName = result.profile;
        // delete old file
        let dir = path.join(__dirname, "../public/image/profile/", oldFileName);
        fs.unlink(dir, (error) => error);
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

// edit data
app.put("/edit/:id", upload.single("profile"), async (req, res) => {
    let param = { id: req.params.id };
    const data = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        location: req.body.location,
        website: req.body.website,
        status: req.body.status,
        resultArr: {},
    };

    // check if password is empty
    if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
    }

    // check if image is empty
    if (req.file) {
        // get data by id
        user.findOne({ where: param }).then((result) => {
            let oldFileName = result.profile;
            // delete old file
            if (oldFileName != "userProfile.svg") {
                let dir = path.join(
                    __dirname,
                    "../public/image/profile/",
                    oldFileName
                );
                fs.unlink(dir, (err) => err);
            }
        });
        // set new filename
        data.profile = req.file.filename;
    }

    if (data.username) {
        user.findAll({
            where: {
                username: data.username,
            },
        }).then((result) => {
            resultArr = result;
            if (resultArr.length > 0) {
                res.status(400).json({
                    status: "error",
                    message: "username already exist",
                });
            }
        });
    } else {
        user.update(data, { where: param })
            .then((result) => {
                res.status(200).json({
                    status: "success",
                    message: "User has been updated",
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

module.exports = app;
