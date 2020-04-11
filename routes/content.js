const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../config/middleware");

router.get("/men", function (req, res) {
    res.render("men");
});

router.get("/women", function (req, res) {
    res.render("women");
});

router.get("/kids", function (req, res) {
    res.render("kids");
});

router.get("/cart", isLoggedIn, function (req, res) {
    res.render("cart");
});

module.exports = router;