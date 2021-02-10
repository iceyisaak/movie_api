const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Use LocalStrategy() to check if Username & Password in req.body exist
require('./passport');

// generateJWTToken when user exists in DB
let generateJWTToken = (user) => {

 // Return JWT signed based on username, and jwtSecret
 return jwt.sign(user, jwtSecret, {

  // The username encoded in the JWT
  subject: user.Username,

  // Set expiration date
  expiresIn: '7d',

  // Set algorithm used to sign/encode the values of JWT
  algorithm: 'HS256'
 });
};


// Export the router module
module.exports = (router) => {

 // Use router.post() to send POST req to /login
 router.post('/login', (req, res) => {

  // PassportJS to Authenticate user
  passport.authenticate(
   // Implement 'local' strategy
   'local',

   // When user is authenticated, disable session support
   {
    session: false
   },

   // callback 
   (error, user, info) => {

    // If error or user not found, return this response
    if (error || !user) {
     return res.status(404).json({
      message: 'Something went wrong',
      user
     });
    }

    // Establish a Login session
    req.login(

     // Use User credential
     user,
     // Disable session support
     {
      session: false
     },

     // Handle error
     (error) => {
      // If error, send error message as response
      if (error) {
       res.send(error);
      }

      // Assign token as generated JWT containing user data parsed as JSON format
      let token = generateJWTToken(user.toJSON());

      // Return response as JSON, container user, and token
      return res.json({
       user,
       token
      });
     });
   })
   // Callback returns req & res
   (req, res);
 });
};
