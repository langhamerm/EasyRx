var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var PatientSchema = new Schema({
  // `name` must be unique and of type String
  name: {
    type: String,
    unique: false
  },
  dob: {
    type: Date
  },
  // `notes` is an array that stores ObjectIds
  // The ref property links these ObjectIds to the Note model
  // This allows us to populate the User with any associated Notes
  scripts: [
    {
      // Store ObjectIds in the array
      type: Schema.Types.ObjectId,
      // The ObjectIds will refer to the ids in the Note model
      ref: "Rx"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model("Patient", PatientSchema);

// Export the User model
module.exports = Patient;
