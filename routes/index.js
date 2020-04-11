const express = require("express");
const router = express.Router();

//Homepage
router.get("/", function (req, res) {
    res.render("homepage");
});

//About Us
router.get("/about", function (req, res) {
    res.render("about");
});

module.exports = router;