const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let movieSchema = mongoose.Schema({

  Title: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [
    String
  ],
  ImageURL: String,
  Featured: Boolean
});

let userSchema = mongoose.Schema({

  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    requird: true
  },
  Email: {
    type: String,
    required: true
  },
  Birthday: Date,
  FavouriteMovies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }]
});


/**
 * Add a static class 'hashPassword' to take in 'password' parameter
 * @param {string} - password
 * @return bcrypt - synchronously auto-generated hash for 'password', with the salt length of 10
 *  */
userSchema.statics.hashPassword = (password) => {

  return bcrypt.hashSync(password, 10);
};





/**
 * Add an instance method 'validatePassword' to take in 'password' parameter
 * @param {string} - password
 * @return bcrypt.compareSync() - Return result of synchronously tested 'this.password' against the hashed password
 *  */
userSchema.methods.validatePassword = function (password) {

  return bcrypt.compareSync(password, this.Password);
};




let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;