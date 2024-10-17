const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME 
});

db.connect((err) => {
    // If no connection 
    if(err) return console.log("Error connecting to MYSQL");

    //If connect works successfully
    console.log("Connected to MYSQL as id: ", db.threadId); 
}) 
// Question 1
app.set('view engine', 'ejs');
app.set('views', __dirname + '/check');

app.get('/data', (req,res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error Retrieving Data')
        } else {
            res.render('data', {results: results});
        }
    });
});

// Question 2
app.get('/pro', (req,res) => {
    db.query('SELECT * FROM providers', (err, results) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error Retrieving Data')
        } else {
            res.render('pro', {results: results});
        }
    });
});

//Question 3
app.get('/patients', (req, res) => {
    const sqlQuery = 'SELECT first_name FROM patients';
  
    db.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      res.json(results);
    });
  });

// Question 4
app.get('/prov', (req,res) => {
    db.query('SELECT provider_specialty FROM providers', (err, results) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error Retrieving Data')
        } else {
            res.render('prov', {results: results});
        }
    });
});

// Start the server 
app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    // Sending a message to the browser 
    console.log('Sending message to browser...');
    app.get('/', (req,res) => {
        res.send('Server Started Successfully!');
    });

});