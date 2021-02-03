// Import packages
const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const morgan = require('morgan');

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

// Use express.static() to serve a file 
app.use('/documentation.html', express.static('public/documentation.html'));


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
  res.json(movieList);
});

// Route: /movies/:title
//  GET a movie by title
app.get('/movies/:title', (req, res) => {
  res.json(
    movieList.find(
      (movie) => {
        return movie.title === req.params.title;
      }
    )

  );

});

// GET a movie genre by movie title
app.get('/movies/genre/:name', (req, res) => {
  res.json(
    movieList.find(
      (movie) => {
        if (movie.genre.name === req.params.name) {
          res
            .status(200)
            .json(movie.genre);
        } else {
          res
            .status(404)
            .send(`Genre ${req.params.name} not found.`);
        }
      }
    )
  );
});

// GET a movie director by name
app.get('/movies/director/:name', (req, res) => {
  res.json(
    movieList.find(
      (movie) => {
        if (movie.director.name === req.params.name) {

          res
            .status(200)
            .json(movie.director);
        } else {

          res
            .status(404)
            .send(`Director ${req.params.name} not founds.`);
        }
      }
    )
  );
});




// POST a new user to list
app.post('/users', (req, res) => {

  let newUser = req.body;
  if (!newUser.username) {
    const message = 'Please add your info.';
    res.send(message);
  } else {
    newUser.id = uuid.v4();
    usersList.push(newUser);
    res
      .status(201)
      .send(newUser);
  }
});


// PUT: Update User Info
app.put('/users/:username', (req, res) => {
  usersList.find(
    (user) => {
      if (user.username === req.params.username) {
        res
          .status(201)
          .send(`User info for ${req.body.username} has been changed successfully.`);
      } else {
        res
          .status(404)
          .send(`User ${req.params.username} not found.`);
      }
    }
  );
});


// POST: user add new movie
app.post('/users/:username/movies/:title', (req, res) => {

  res.send('Movie Added to Favourite');
});


// DELETE: user remove movie from list of favourite
app.delete('/users/:username/movies/:id', (req, res) => {
  res.send('Movie Removed from Favourite');
});


// DELETE: Remove a user
app.delete('/users/:username', (req, res) => {
  usersList.find(
    (user) => {
      return user.username = req.params.username;
    }
  );
  res
    .status(201)
    .send(`User has been deleted.`);
});



// Listen for response on this port
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
