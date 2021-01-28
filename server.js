// Import all relevant modules
const http = require('http');
const fs = require('fs');
const url = require('url');

// Create server
http.createServer(
 (request, response) => {

  // URL request from users
  const addr = request.url;
  const q = url.parse(addr, true);
  let filepath = '';

  // Append File with log information
  fs.appendFile(
   // Append to the file with this name
   'log.txt',
   // Include these info into the file
   `
   URL: ${addr} \n 
   Timestamp: ${new Date()} \n\n
   `,
   // Catch the error
   (err) => {

    // If error is found,
    if (err) {
     // Log error in the console if any
     console.log(err);;
    } else {
     // Else, log this message
     console.log('Added to log');
    }

   }
  );

  // Check if a particular pathname is included
  if (q.pathname.includes('documentation')) {
   // If so, set filepath to the directory path + filename
   filepath = (`${__dirname}/documentation.html`);
  } else {
   // Otherwise, set filepath to index.html
   filepath = 'index.html';
  }

  // Read the file
  fs.readFile(
   // From this particular path
   filepath,
   // Check for error
   (err, data) => {
    // Throw error if any
    if (err) {
     throw err;
    }

    // Indicate response's head
    response.writeHead(
     // Response Status Code
     200,
     // Response Head
     {
      'Content-Type': 'text/html'
     }
    );
    // Write out the data from response
    response.write(data);
    // End the response when done
    response.end();
   });

 }
)
 // Listen for response on this port
 .listen(8080);

// Log Server Status with this message
console.log('Server is running on port 8080');