const express = require("express");
const ejsMate = require('ejs-mate')
require("dotenv").config();

const mongoose = require("mongoose");
const { JournalEntry } = require("./models/journal");
const session = require("express-session");
const methodOverride = require("method-override");


mongoose
  .connect("mongodb://127.0.0.1:27017/fitfinity")
  .then(() => console.log("Connected!"));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

//--------------------------------------------------------------------------------------------------------------
const passport = require("passport");
const LocalSrategy = require("passport-local");
const User = require("./models/user");
//---------------------------------------------------------------------------------------------------------------
const app = express();
const flash = require("connect-flash");
const path = require("path");

app.engine('ejs', ejsMate)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

//---------------------------------------------------------------------------------------------------------------
const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    //I used http only for extra protection
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalSrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//-------------------------------------------------------------------------------------------------------------
app.get("/fakeUser", async (req, res) => {
  //the below line makes the username and takes the gmail
  const user = new User({
    email: "coltt@gmaidasddl.com",
    username: "coltt1234d",
  });
  //the below line makes the newUser and adds the password, where chicken is the password
  //passport automatically adds the salt and hash
  //register is an inbuilt passport method
  const newUser = await User.register(user, "chicdasken");
  res.send(newUser);
});
//-----------------------------------------------------------------------------------------------------------
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

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});
app.listen(4000, () => {
  console.log("connection established on port 4000");
});
