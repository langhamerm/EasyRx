var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = 3000;

// Require all models
var db = require("./models");

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/rx", { useNewUrlParser: true });

// When the server starts, create and save a new User document to the db
// The "unique" rule in the User model's schema will prevent duplicate users from being added to the server
db.Patient.create({
  name: "Bark Wanghamer",
  dob: '03.19.1993'
})
  .then(function (dbPatient) {
    console.log(dbPatient);
  })
  .catch(function (err) {
    console.log(err.message);
  });

// Routes

// Route for retrieving all Rx from the db
app.get("/rx", function (req, res) {
  // Find all Rx
  db.Rx.find({})
    .then(function (dbRx) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbRx);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for retrieving all Patient from the db
app.get("/patient", function (req, res) {
  // Find all Users
  db.Patient.find({})
    .then(function (dbPatient) {
      // If all Users are successfully found, send them back to the client
      res.json(dbPatient);
    })
    .catch(function (err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});

// Route for saving a new Rx to the db and associating it with a Patient
app.post("/submit", function (req, res) {
  // Create a new Note in the db
  db.Rx.create(req.body)
    .then(function (dbRx) {
      // If a Note was created successfully, find one User (there's only one) and push the new Note's _id to the User's `notes` array
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Patient.findOneAndUpdate({ name: req.body.title }, {
        $push: {
          rx: [
            {rxNum: req.body.rxNum},
            {refills: req.body.refills}
          ]
        }
      }, { new: true });
    })
    .then(function (dbPatient) {
      // If the User was updated successfully, send it back to the client
      res.json(dbPatient);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route to get all User's and populate them with their notes
app.get("/populateduser", function (req, res) {
  // Find all users
  db.Patient.find({})
    // Specify that we want to populate the retrieved users with any associated notes
    .populate("scripts")
    .then(function (dbPatient) {
      // If able to successfully find and associate all Users and Notes, send them back to the client
      res.json(dbPatient);
    })
    .catch(function (err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
  console.log("App running on http://localhost:" + PORT);
});
