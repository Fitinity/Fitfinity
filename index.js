const express = require("express");

const ejsMate = require('ejs-mate')
require("dotenv").config();

const mongoose = require("mongoose");
const { JournalEntry } = require("./models/journal");

mongoose
  .connect("mongodb://127.0.0.1:27017/fitfinity")
  .then(() => console.log("Connected!"));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
const flash = require("connect-flash");
const path = require("path");

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


//---------------------------------------------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("home");
});
app.get("/journal", async (req, res) => {
  const journals = await JournalEntry.find({});
  res.render("journal/index", { journals });
});
app.get("/journal/new", async (req, res) => {
  res.render("journal/new");
});

app.listen(4000, () => {
  console.log("connection established on port 4000");
});
