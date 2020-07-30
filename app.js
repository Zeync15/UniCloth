var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    session = require("express-session"),
    User = require("./models/user");

// localhost database
// mongoose.connect("mongodb://localhost/UniCloth", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
// });

//mongo atlas
mongoose.connect('mongodb+srv://dbUser:dbUser@cluster0.fuih8.mongodb.net/UniCloth?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("Error:", err.message);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/Image'));

//PASSPORT CONFIGURATION
require("./config/passport")(passport);
app.use(session({
    secret: "UniCloth",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Connect Flash
app.use(flash());

//Global Vars
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success_message = req.flash("success_message");
    res.locals.error_message = req.flash("error_message");
    res.locals.error = req.flash("error");
    next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/content"));
app.use("/", require("./routes/user"));

app.listen(3000, function () {
    console.log("Server started!");
});