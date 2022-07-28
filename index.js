//import
const express = require("express");
const cors = require("cors");
const port = 2004;

//implementasi
const app = express();
app.use(cors());

// endpoint user
const user = require("./routes/user");
app.use("/user", user);

// endpoint category
const category = require("./routes/post_category");
app.use("/category", category);

// endpoint post
const post = require("./routes/post");
app.use("/post", post);

// endpoint comments
const comments = require("./routes/post_comment");
app.use("/comments", comments);

//run server
app.listen(port, () => {
    console.log("server run on port " + port);
});
