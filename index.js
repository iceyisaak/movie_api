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
    info: {
      username: '',
      email: '',
      password: ''
    },
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
app.get('/movies/:genre/:name', (req, res) => {

  // Get the movie by movie title
  let movie = movieList.find(
    (movie) => {
      return movie.title === req.params.title;
    }
  );

  // If that movie exists in database, 
  if (movie) {

    // access its genre
    let genre = movieList.description.genre;
    return genre;

  } else {
    res
      .status(404)
      .send(`Movie with the title of ${movie} is not found.`);
  }
});


// GET a movie director by name
app.get('/movies/:director', (req, res) => {
  let movie;
});



// POST: Add to favMovies
app.post('/users/:id/:favMovies', (req, res) => {
  // Add movies to favourite
});



// GET all users
app.get('/users', (req, res) => {
  res.json(usersList);
});


// POST a new user to list
app.post('/users', (req, res) => {

  let newUser = req.body;
  if (!newUser.username) {
    const message = 'Please add your info.';
    res.send(message);
  } else {
    newUser.id = uuid.v4();
    newUser.push(newUser);
    res
      .status(201)
      .send(newUser);
  }
});

// PUT: Update User Info
app.put('/users/:id', (req, res) => {
  let user = usersList.find(
    (user) => {
      return user.username === req.params.username;
    }
  );

  if (user) {
    // Overwrite existing info with new info

    res
      .status(201)
      .send('User info has been changed successfully.');
  } else {
    res
      .status(404)
      .send('User not found.');
  }
});


// DELETE: Remove a user
app.delete('/users/:id', (req, res) => {
  let user = userList.find(
    (user) => {
      return user.id = req.params.id;
    }
  );

  if (user) {
    usersList = usersList.filter(
      (obj) => {
        return obj.id !== req.params.id;
      }
    );
  }
  res
    .status(201)
    .send(`User with ${userList.info.email} has been deleted.`);
});



// Listen for response on this port
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
