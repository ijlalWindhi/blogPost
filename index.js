//import
const express = require("express");
const cors = require("cors");
const port = 2004;

//implementasi
const app = express();
app.use(cors());

//endpoint nanti ditambahkan di sini
const user = require("./routes/user");
app.use("/user", user);

const category = require("./routes/post_category");
app.use("/category", category);

//run server
app.listen(port, () => {
    console.log("server run on port " + port);
});
