const fetch = require('node-fetch');
const mysql = require('mysql');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',      
  user: 'root',   
  password: '',  
  database: 'movies'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Fetch JSON data from the API
  fetch('https://my-json-server.typicode.com/ajaympawaskar98/movies-api/db')
    .then(response => response.json())
    .then(data => {
      // Assuming the JSON response has an array of movies stored in 'data.movies'
      const movies = data.movies;

      // Insert each entry into the MySQL database
      movies.forEach(entry => {
        const { id,title,genre,actor,director,year } = entry;

        const insertQuery = 'INSERT INTO movies_list (id,title,genre,actor,director,year) VALUES (?,?,?,?,?,?)';
        const values = [id,title,genre,actor,director,year];

        connection.query(insertQuery, values, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err);
            return;
          }
          console.log('Data inserted successfully');
        });
      });
    })
    .catch(error => {
      console.error('Error fetching JSON data:', error);
    })
    .finally(() => {
      // Close the database connection
      connection.end((err) => {
        if (err) {
          console.error('Error closing connection:', err);
          return;
        }
        console.log('Connection closed');
      });
    });
});