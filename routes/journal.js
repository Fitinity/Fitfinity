const express = require("express");
const router = express.Router();

const { isLoggedIn, setGreeting, setCurrentPage } = require("../middleware");
const { JournalEntry } = require("../models/journal");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router.get("/journals", setCurrentPage, setGreeting, async (req, res) => {
  try {
    const journals = await JournalEntry.find({});
    console.log("meow");
    res.render("journals/index", { journals });
  } catch (err) {
    req.flash("error", "Failed to fetch journal entries");
    console.log(err);
    res.redirect("/home");
  }
});
// router.post("/journals", setCurrentPage, upload.single("image"), (req, res) => {
//   res.send(req.body, req.file);
// });
router.get(
  "/journals/new",
  isLoggedIn,
  setCurrentPage,
  setGreeting,
  (req, res) => {
    res.render("journals/new");
  }
);
router.post(
  "/journals",
  setCurrentPage,
  upload.array("images"),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
      }));

      const newJournalEntry = new JournalEntry({
        title,
        content,
        images,
        author: req.user._id,
      });

      await newJournalEntry.save();

      req.flash("success", "Journal entry created successfully");
      res.redirect("/journals");
    } catch (err) {
      console.error(err);
      req.flash("error", "Failed to create journal entry");
      res.redirect("journals/new");
    }
  }
);

router.get("/journals/:id", setCurrentPage, async (req, res) => {
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
    const journalEntry = await JournalEntry.findById(req.params.id);
    // Check if the logged-in user is the author of the journal entry
    if (!journalEntry.author.equals(req.user._id)) {
      req.flash("error", "You are not authorized to edit this journal entry");
      return res.redirect(`/journals/${req.params.id}`);
    }
    // Update the journal entry
    console.log("Heil");
    console.log(req.body.title);
    await JournalEntry.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      content: req.body.content,
    });
    req.flash("success", "Journal entry updated successfully");
    res.redirect(`/journals`);
  } catch (err) {
    req.flash("error", "Failed to update journal entry");
    res.redirect(`/journals/${req.params.id}/edit`);
  }
});
router.get(
  "/journals/:id/edit",
  isLoggedIn,
  setCurrentPage,
  async (req, res) => {
    try {
      const journalEntry = await JournalEntry.findById(req.params.id);
      res.render("journals/edit", { journalEntry });
    } catch (err) {
      req.flash("error", "Failed to fetch journal entry for editing");
      res.redirect("/journals");
    }
  }
);
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
