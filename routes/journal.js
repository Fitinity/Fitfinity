const express = require("express");
const router = express.Router();

const { isLoggedIn, setGreeting, setCurrentPage } = require("../middleware");
const { JournalEntry } = require("../models/journal");
router.get("/journals", setCurrentPage, setGreeting, async (req, res) => {
  try {
    const journals = await JournalEntry.find({});
    res.render("journals/index", { journals });
  } catch (err) {
    req.flash("error", "Failed to fetch journal entries");
    console.log(err);
    res.redirect("/home");
  }
});
router.get("/journals/new", (req, res) => {
  res.render("journals/new");
});
router.post("/journals", async (req, res) => {
  try {
    const JournalEntry = new JournalEntry({
      author: req.user._id,
      title: req.body.title,
      content: req.body.content,
    });
    await JournalEntry.save();
    req.flash("success", "Journal entry created successfully");
    res.redirect("/journals");
  } catch (err) {
    console.err("Erro creating journal entry: ", err);
    req.flash("error", "Failed to create journal entry");
    res.redirect("journals/new");
  }
});
router.get("/journals/:id", isLoggedIn, async (req, res) => {
  try {
    const journalEntry = await JournalEntry.findById(req.params.id);
    res.render("journals/show", { journalEntry });
  } catch (err) {
    req.flash("error", "Failed to fetch journal entry");
    res.redirect("/journals");
  }
});
router.put("/journals/:id", isLoggedIn, async (req, res) => {
  try {
    await JournalEntry.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
    });
    req.flash("success", "Journal entry updated successfully");
    res.redirect(`/journals/${req.params.id}`);
  } catch (err) {
    req.flash("error", "Failed to update journal entry");
    res.redirect(`/journals/${req.params.id}/edit`);
  }
});
router.get("/journals/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const journalEntry = await JournalEntry.findById(req.params.id);
    res.render("journals/edit", { journalEntry });
  } catch (err) {
    req.flash("error", "Failed to fetch journal entry for editing");
    res.redirect("/journals");
  }
});
router.delete("/journals/:id", isLoggedIn, async (req, res) => {
  try {
    await JournalEntry.findByIdAndDelete(req.params.id);
    res.redirect("/journals");
  } catch (err) {
    req.flash("error", "Failed to delete journal entry");
    res.redirect(`/journals/${req.params.id}`);
  }
});
module.exports = router;
