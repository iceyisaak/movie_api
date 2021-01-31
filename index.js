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
    title: 'The Gentlemen',
    description: {
      summary: 'Mickey Pearson is an American expatriate who became rich by building a highly profitable marijuana empire in London. When word gets out that he\'s looking to cash out of the business, it soon triggers an array of plots and schemes -- including bribery and blackmail -- from shady characters who want to steal his domain.',
      genre: [
        'Action',
        'Crime'
      ],
    },
    year: 2019,
    director: [
      {
        name: 'Guy Ritchie',
        bio: 'Guy Stuart Ritchie is an English film director, producer, writer, and businessman. His work includes British gangster films and the Sherlock Holmes franchise. Ritchie left school at age 15 and worked entry-level jobs in the film industry before going on to direct television commercials.',
        birthYear: 1968,
        deathYear: null,
      }
    ],
    imageURL: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRubFp5zFZxMxjaZN88iqFJTsDM9jwXnVAP4cfZ9T1Ah2rKPp3y'
  },
  {
    title: 'Archive',
    description: {
      summary: '2038: George Almore is working on a true human-equivalent AI. His latest prototype is almost ready. This sensitive phase is also the riskiest. Especially as he has a goal that must be hidden at all costs: being reunited with his dead wife.',
      genre: [
        'Sci-Fi'
      ]
    },
    year: 2020,
    director: [
      {
        name: 'Gavin Rothery',
        bio: '',
        birthYear: null,
        deathYear: null
      }
    ],
    imageURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm15yfUV1tKyrUa1mlbEnSnbP5CRL9w-JHSlyJen-EssCdNG89'
  },
  {
    title: 'The Dig',
    description: {
      summary: 'An excavator and his team discover a wooden ship from the Dark Ages while digging up a burial ground on a woman\'s estate.',
      genre: [
        'Drama',
        'History'
      ],
    },
    year: 2021,
    director: [
      {
        name: 'Simon Stone',
        bio: 'Simon Stone is an Australian film and theatre director, writer and actor.',
        birthYear: 1984,
        deathYear: null
      }
    ],
    imageURL: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTSZdGrSNXrJ_PCXvngEnHn19tdTUtKKh6xfDp9oT-HrHqbZOxw'
  },
  {
    title: 'After',
    description: {
      summary: 'Tessa Young is a dedicated student, dutiful daughter and loyal girlfriend to her high school sweetheart. Entering her first semester of college, Tessa\'s guarded world opens up when she meets Hardin Scott, a mysterious and brooding rebel who makes her question all she thought she knew about herself -- and what she wants out of life.',
      genre: [
        'Romance',
        'Drama'
      ],
    },
    year: 2019,
    director: [
      {
        name: 'Jenny Gage',
        bio: 'Jenny Gage is Academic Coordinator for the Motivate Project, Millennium, Mathematics at Cambridge University. She also provides training in the use of interactive whiteboards for teaching mathematics at all levels.',
        birthYear: 1969,
        deathYear: null
      }
    ],
    imageURL: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS3E0TK3iq5527vUbBosSbyNHFESuSoFtev2dTk3y843rcyRLMG'
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
app.get('/movies/:title/:description', (req, res) => {

  // Get the movie by name
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


// DEELTE: Remove a user
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
