const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;
const multer = require("multer");
const favicon = require("serve-favicon");
const nodemailer = require('nodemailer');



const app = express();

app.use(favicon(__dirname + "/car_13260.ico"));


  

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-chitvan:test123@cluster0.9yhbca8.mongodb.net/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Database connected!"))
    .catch(err => console.log(err));


    
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    dob: Date,
    gender: String,
    contact: String,
    vehicleNo: String,
    drivingLicense: String,
    pollutionCertificate: String,
    vehicleRegistration: String,
    status: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const upload = multer({ dest: "uploads/" });

// Set up email transporter
const transporter = nodemailer.createTransport({
  service: 'YOUR_EMAIL_SERVICE',
  auth: {
    user: 'YOUR_EMAIL_ADDRESS',
    pass: 'YOUR_EMAIL_PASSWORD'
  }
});

// Function to send email
function sendEmail(email, password) {
  const mailOptions = {
    from: 'chitvans20@gmail.com',
    to: email,
    subject: 'Registration Success',
    text: `Thank you for registering. Your password is: ${password}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent successfully');
    }
  });
}

app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", async function(req, res) {
    try {
      const foundUsers = await User.find({ "secret": { $ne: null } });
      if (foundUsers) {
        res.render("secrets", { user: req.user});
      }
    } catch (err) {
      console.log(err);
    }
});

app.get("/user-login", function (req, res) {
    if (req.isAuthenticated()) {
        // Retrieve the user's email from the req.user object
        const userEmail = req.user.username;
        // Set the userImage based on the user's email and the absolute file path
        let userImage;
        
        if (userEmail === '1@2.com') {
            userImage = '/images/img1.jpg';
        } else if (userEmail === '3@4.com') {
            userImage = '/images/img1.jpg';
        } else {
            userImage = '/images/img1.jpg';
        }
        
        const userImageMapping = {
            '1@2.com': '/images/img1.jpg',
            '3@4.com': '/images/img1.jpg',
            // Add more email-image mappings as needed
        };

        // Render the user-details page and pass the authenticated user object, image URL, and userImageMapping to it
        res.render("user-login", { user: req.user, userImage: userImage, userImageMapping: userImageMapping });
    } else {
        // User is not authenticated, redirect to the login page
        res.redirect("/login");
    }
});

        
   



app.get("/submit", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/register", upload.fields([
    { name: "drivingLicense", maxCount: 1 },
    { name: "pollutionCertificate", maxCount: 1 },
    { name: "vehicleRegistration", maxCount: 1 }
]), function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        dob: req.body.dob,
        gender: req.body.gender,
        contact: req.body.contact,
        vehicleNo: req.body.vehicleNo,
        drivingLicense: req.files && req.files["drivingLicense"] ? req.files["drivingLicense"][0].path : "",
        pollutionCertificate: req.files && req.files["pollutionCertificate"] ? req.files["pollutionCertificate"][0].path : "",
        vehicleRegistration: req.files && req.files["vehicleRegistration"] ? req.files["vehicleRegistration"][0].path : "",
        status: req.body.status,
        secret: ""
    });

    User.register(user, req.body.password, function (err, registeredUser) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            // Send registration success email
            sendEmail(user.username, user.password);

            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            });
        }
    });
});

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.post("/login", async function (req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    try {
        await req.login(user, function (err) {
            if (err) {
                console.log(err);
                res.redirect("/login");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/user-login");
                });
            }
        });
    } catch (err) {
        console.log(err);
    }
});

app.listen(3000, function () {
    console.log("Server started on port 3000.");
});