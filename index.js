// Import packages
const express = require('express');
const morgan = require('morgan');

// Assign variable for express()
const app = express();


// movieList Object Array
const movieList = [
 {
  id: 1,
  title: '1917',
  genre: 'Suspense',
  year: 2016
 },
 {
  id: 2,
  title: 'Level 16',
  genre: 'Sci-Fi',
  year: 2018
 },
 {
  id: 3,
  title: 'Bad Boys for Life',
  genre: 'Action',
  year: 2020
 },
 {
  id: 4,
  title: 'Sonic: The Hedgehog',
  genre: 'Adventure',
  year: 2016
 },
 {
  id: 5,
  title: 'Styx',
  genre: 'Drama',
  year: 2018
 },
 {
  id: 6,
  title: 'Overdrive',
  genre: 'Action/Thriller',
  year: 2016
 },
 {
  id: 7,
  title: 'Life Like',
  genre: 'Sci-fi/Thriller',
  year: 2016
 },
 {
  id: 8,
  title: 'The Gentlemen',
  genre: 'Action/Crime',
  year: 2020
 },
 {
  id: 9,
  title: 'After',
  genre: 'Romance/Drama',
  year: 2019
 },
 {
  id: 10,
  title: '365 Days',
  genre: 'Romance/Drama',
  year: 2020
 },

];


// Use Morgan to log all requests from users
app.use(morgan('common'));

// Use Express.Static to serve a file 
app.use('/documentation.html', express.static('public/documentation.html'));

// Handle Errors
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

// Route: /movie
app.get('/movies', (req, res) => {
 res.json(movieList);
});



// Listen for response on this port
const PORT = 8080;
app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});

