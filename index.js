/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    app = express();


app.use(express.static('public'));    
app.use(morgan('common'));

// Logging when the API is accessed
const accessLog = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLog}));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(' Something broke :( ');
  });


app.get('/movies', (req, res) => {
   // Filler list for now
    let myMovies = [
            {
            title: 'Book of Eli',
            director: 'The Hughes Brothers'
            },
            {
            title: 'Inception',
            director: 'Christopher Nolan'
            },
            {
            title: 'The Departed',
            director: 'Martin Scorsese'
            },
            {
            title: 'Lord of the Rings: Return of the King',
            director: 'Peter Jackson'
            },
            {
            title: 'V for Vendetta',
            director: 'James McTeigue'
            },
            {
            title: 'A Promising Young Woman',
            director: 'Emerald Fennell'
            },
            {
            title: 'The Dark Knight',
            director: 'Christopher Nolan'
            },
            {
            title: 'Forrest Gump',
            director: 'Robert Zemeckis'
            },
            {
            title: 'The Incredibles',
            director: 'Brad Bird'
            },
            {
            title: 'Interstellar',
            director: 'Christopher Nolan'
            }   
        ];
    res.json(myMovies);
})

// Default greeting message
app.get('/', (req,res) => {
    res.send('Welcome to my API!');
});

// Route /documentation to its html file
app.get('/documentation', (req,res) => {
    res.sendFile('public/Documentation.html', {root: __dirname});     
});


 
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});




