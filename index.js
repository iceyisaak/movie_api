// Import packages
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const morgan = require('morgan');
const mongoose = require('mongoose');

// Import Models
const Models = require('./models');
const Movies = Models.Movie;
const Users = Models.User;


// Connect to the Database
mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});


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

// Use Morgan to log all requests from users
app.use(morgan('common'));

// Route requests to serve static files in /public/
app.use('/', express.static(`${__dirname}/public/`));


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
app.get('/movies', (req, res) => {
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
app.get('/movies/:Title', (req, res) => {
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

// GET a movie genre by movie title
app.get('/movies/:Title/Genre', (req, res) => {
  Movies.findOne({
    Title: req.params.Title
  })
    .then(
      (movie) => {
        if (!movie) {
          res
            .status(404)
            .send(`Movie ${req.params.Title} not found.`);
        } else {
          res
            .json(movie.Genre.Name)
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
app.get('/movies/director/:Name', (req, res) => {
  Movies.findOne({
    Director: req.params.Director
  })
    .then(
      (director) => {
        if (!director) {
          res
            .status(404)
            .send(`Director: ${req.params.Director} not found.`);
        } else {
          res
            .json(director)
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
app.get('/users', (req, res) => {
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
app.get('/users/:Username', (req, res) => {
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


// POST a new user to list
app.post('/users', (req, res) => {

  Users.findOne({
    Username: req.body.Username
  })
    .then(
      (user) => {
        if (user) {
          return res
            .status(400)
            .send(`${req.body.Username} already exists.`);
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then(
              (user) => {
                res
                  .status(201)
                  .json(user);
              }
            )
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
app.patch('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({
    Username: req.params.Username
  },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
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
app.post('/users/:Username/Movies/:MovieID', (req, res) => {

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
app.put('/users/:Username/Movies/:MovieID', (req, res) => {

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
app.delete('/users/:Username', (req, res) => {
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



// Listen for response on this port
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
