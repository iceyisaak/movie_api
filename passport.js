const passport = require('passport');
const LocalStrategy = require('passport-local');
const Models = require('./models');
const passportJWT = require('passport-jwt');

let Users = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;


// use LocalStrategy() to define basic authentication 
passport.use(new LocalStrategy({
 usernameField: 'Username',
 passwordField: 'Password'
},
 (username, password, callback) => {
  console.log(`${username} ${password}`);

  // Query the database for Username
  Users.findOne({
   Username: username
  },
   // callback the error & user
   (error, user) => {

    // If error, return error
    if (error) {
     console.log(error);
     return callback(error);
    }
    // If Username doesn't exist in the DB, return false with this message
    if (!user) {
     console.log('Incorrect Username');
     return callback(null, false, {
      message: 'Incorrect username or password.'
     });
    }
    // When done, return user data
    console.log('Done');
    return callback(null, user);
   }
  );
 }
));


// Use JWTStrategy() to authenticate user base on JWT submited with their request 
passport.use(new JWTStrategy({

 // Extract JWT from Header of HTTP request
 jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),

 // JWT Secret Key used for verification
 secretOrKey: 'your_jwt_secret'
},
 // Takes in jwtPayload, callback
 (jwtPayload, callback) => {

  // Returns jwtPayload._id found in Users collection
  return Users.findById(jwtPayload._id)

   // If user is found, return user data
   .then(
    (user) => {
     return callback(null, user);
    }
   )
   // If error, return error
   .catch(
    (error) => {
     return callback(error);
    }
   );
 }
));