// Import packages
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

// Import Models
const Models = require('./models');
const Movies = Models.Movie;
const Users = Models.User;

// Import ./passport.js
require('./passport');


// Connect to the Database
mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

// Connect to the 'remote' database
// mongoose.connect(process.env.CONNECTION_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// });




// Assign variable for express()
const app = express();

// movieList Object Array
const movieList = [
  {
    title: 'Bohemian Rhapsody',
    year: 2018,
    description: 'Description about Bohemian Rhapsody',
    genre: {
      name: 'drama',
      description: 'Description of biographical drama'
    },
    director: {
      name: 'Bryan Singer',
      bio: 'Bio of Bryan Singer',
      birth: '1965',
      death: ''
    },
    imageURL: '',
    featured: ''
  },
  {
    title: 'Forrest Gump',
    year: 1994,
    description: 'Description about Forrest Gump',
    genre: {
      name: 'drama',
      description: 'Description of comedy drama'
    },
    director: {
      name: 'Robert Zemeckis',
      bio: 'Bio of Robert Zemeckis',
      birth: '1952',
      death: ''
    },
    imageURL: '',
    featured: ''
  }
];

const usersList = [
  {
    username: 'Jon Doe',
    email: 'jon@doe.com',
    password: '12345',
    favMovies: []
  }
];


// Use BodyParser to Parse data in the Request Body as JSON
app.use(bodyParser.json());

// Import auth.js file + make Express() available in auth.js
const auth = require('./auth')(app);

// Use Morgan to log all requests from users
app.use(morgan('common'));

// Route requests to serve static files in /public/
app.use('/', express.static(`${__dirname}/public/`));


// Use CORS to allow request from specific origins
// let allowedOrigins = [
//   'http://127.0.0.1:8080',
//   'http://heroku.com'
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) {
//         return callback(null, true);
//       }

//       // If a specific origin is NOT found in allowedOrigins []
//       if (allowedOrigins.indexOf(origin) === -1) {

//         // Return this message
//         const message = `The CORS policy for this app doesn't allow access from ${origin}`;
//         return callback(
//           new Error(message),
//           false
//         );
//       }

//       // Return callback
//       return callback(null, true);
//     }
//   })
// );

app.use(cors());



// Handle Errors with express()
app.use((err, req, res, next) => {
  // Log errors to console
  console.log(err.stack);
  // Send Error Status + Message
  res.status(500).send('Something went wrong.');
});



// Route: Root
app.get('/', (req, res) => {
  res.send('INDEX PAGE: Welcome to MyFlix');
});

// Route: /movies
// GET all movies
app.get(

  // set URL endpoint
  '/movies',

  // Use PassportJS as a middleware to authenticate user
  passport.authenticate(

    // Use 'JWT' strategy for authentication process
    'jwt',

    //When authentication is done: Disable Session support
    {
      session: false
    }
  ),

  // callback
  (req, res) => {
    Movies.find()
      .then(
        (movies) => {
          res
            .status(201)
            .json(movies);
        }
      )
      .catch(
        (err) => {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        }
      );
  });

// Route: /movies/:title
//  GET a movie by title
app.get(
  '/movies/:Title',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  (req, res) => {
    Movies.findOne({
      Title: req.params.Title
    })
      .then(
        (movie) => {
          if (!movie) {
            res
              .status(404)
              .send(`Movie with the title ${req.params.Title} is not found.`);
          } else {
            res
              .json(movie)
              .status(201);
          }
        }
      )
      .catch(
        (err) => {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        }
      );

  });

// GET a movie genre by name
app.get(
  '/movies/genre/:Name',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  (req, res) => {
    Movies.findOne({
      'Genre.Name': req.params.Name
    })
      .then(
        (movie) => {
          if (!movie) {
            res
              .status(404)
              .send(`Movie ${req.params.Name} not found.`);
          } else {
            res
              .json(movie.Genre)
              .status(201);
          }
        }
      )
      .catch(
        (err) => {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        }
      );
  });

// GET a movie director info by name
app.get(
  '/movies/director/:Name',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  (req, res) => {
    Movies.findOne({
      'Director.Name': req.params.Name
    })
      .then(
        (movie) => {
          if (!movie) {
            res
              .status(404)
              .send(`Director: ${req.params.Name} not found.`);
          } else {
            res
              .json(movie.Director)
              .status(201);
          }
        }
      )
      .catch(
        (err) => {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        }
      );
  });





// GET all users
app.get(
  '/users',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  (req, res) => {
    Users.find()
      .then(
        (users) => {
          res
            .status(201)
            .json(users);
        }
      )
      .catch(
        (err) => {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        }
      );
  });


// Get a user by username
app.get(
  '/users/:Username',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  (req, res) => {
    Users.findOne({
      Username: req.params.Username
    })
      .then(
        (user) => {
          if (!user) {
            res
              .status(404)
              .send(`User: ${req.params.Username} not found.`);
          } else {
            res
              .json(user)
              .status(201);
          }
        }
      )
      .catch(
        (err) => {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        }
      );
  });


// POST 
// Add a new user to the platform
app.post(

  // Endpoint URL
  '/users',

  // Validate Input
  [
    // Username is require and must have at least X characters
    check('Username', 'Username is required to have at least 6 characters.')
      .isLength({
        min: 6
      }),
    // Username contains non-alphanumeric numbers - NOT allowed
    check('Username', 'Username contains non-alphanumeric numbers - NOT allowed')
      .isAlphanumeric(),
    // Password is required, and must have X characters or more
    check('Password', 'Password is required to have at least 6 characters.')
      .not()
      .isEmpty()
      .isLength({
        min: 6
      }),
    // Email must have a valid format
    check('Email', 'Email seems to be invalid.')
      .isEmail()
  ],

  // Callback function
  (req, res) => {

    // Check validation result of the request for errors
    const errors = validationResult(req);

    // If empty error is not found
    if (!errors.isEmpty()) {

      // Return this status code and JSON container errors array
      return res

        // 422 Unprocessable Entity
        .status(422)
        .json({
          errors: errors.array()
        });
    }

    // Declare .hashPassword() to User's Password in req.body
    const hashedPassword = Users.hashPassword(req.body.Password);

    // findOne() particular Username in the DB
    Users.findOne({
      Username: req.body.Username
    })
      .then(

        // When user is found, return this message
        (user) => {
          if (user) {
            return res
              .status(400)
              .send(`${req.body.Username} already exists.`);

            // Else, create the user
          } else {
            Users
              .create({
                Username: req.body.Username,

                // Store the hashed version of the Password entered
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
              })

              // Then return status code and JSON Object with User data
              .then(
                (user) => {
                  res
                    .status(201)
                    .json(user);
                }
              )

              // Catch any error found
              .catch(
                (error) => {
                  console.error(error);
                  res
                    .status(500)
                    .send(`Error: ${error}`);
                }
              );
          }
        }
      );

  });



// PUT: Update User Info
app.put(
  '/users/:Username',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),

  // Validate Input
  [
    check('Username', 'Username is required.')
      .isLength({
        min: 6
      }),
    check('Usernane', 'Username contains a non-alphanumeric numbers - NOT allowed')
      .isAlphanumeric(),
    check('Password', 'Password is required.')
      .not()
      .isEmpty()
      .isLength({
        min: 6
      }),
    check('Email', 'Email seems to be invalid.')
      .isEmail()
  ],
  (req, res) => {

    // Handle any errors from the input validation
    const errors = validationResult(res);

    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({
          erros: errors.array()
        });
    }

    const hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate({
      Username: req.params.Username
    },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      {
        // Return Updated Document
        new: true
      }
    )
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch(
        (err) => {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        }
      );

  });


// POST: user add movie to favourite
app.post(
  '/users/:Username/Movies/:MovieID',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  (req, res) => {
    Users.findOneAndUpdate({
      Username: req.params.Username
    },
      {
        $push: {
          FavouriteMovies: req.params.MovieID
        }
      },
      {
        // Return Updated Document
        new: true
      },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        } else {
          res
            .json(updatedUser)
            .status(201);

        };
      }
    );

  });

// PUT user remove movie from favourite
app.put(
  '/users/:Username/Movies/:MovieID',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  (req, res) => {

    Users.findOneAndUpdate({
      Username: req.params.Username
    },
      {
        $pull: {
          FavouriteMovies: req.params.MovieID
        }
      },
      {
        new: true
      },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        } else {
          res
            .json(updatedUser)
            .status(201);
        }
      }
    );
  });


// DELETE: Remove a user
app.delete(
  '/users/:Username',
  passport.authenticate(
    'jwt',
    {
      session: false
    }
  ),
  (req, res) => {
    Users.findOneAndRemove(
      {
        Username: req.params.Username
      }
    )
      .then(
        (user) => {
          if (!user) {
            res
              .status(400)
              .send(`${req.params.Username} not found.`);
          } else {
            res
              .status(200)
              .send(`${req.params.Username} is successfully deleted.`);
          }
        }
      )
      .catch(
        (err) => {
          console.error(err);
          res
            .status(500)
            .send(`Error: ${err}`);
        }
      );
  });



// Listen for response on either a pre-configured port or simply on this port
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
