const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

require("handlebars");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

const exphbs = require("express-handlebars");
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs"
  })
);
app.set("view engine", "hbs");

require("./routes/routes.js")(app);

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
