var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user");

mongoose.connect("mongodb://localhost/UniCloth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/Image'));

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "UniCloth",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get("/men", function (req, res) {
    res.render("men");
});

app.get("/women", function (req, res) {
    res.render("women");
});

app.get("/kids", function (req, res) {
    res.render("kids");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/cart", isLoggedIn, function (req, res) {
    res.render("cart");
});

// =====================
//AUTH ROUTES
//show register form
app.get("/register", function (req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    });
});

// show login form
app.get("/login", function (req, res) {
    res.render("login");
});
//handling login logic
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/",
        failureRedirect: "/login"
    }), function (req, res) {

    });
//logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});
// =====================

app.get("/", function (req, res) {
    res.render("homepage");
});

//middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

app.listen(3000, function () {
    console.log("Server started!");
});