/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// npm run devStart


const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

    app = express();

const passport = require('passport');
// Middleware to use our consts   
app.use(express.static('public'));    
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 'http://localhost:8000', 
'http://localhost:1234', 'https://my-flix-ajs.netlify.app', 'http://localhost:4000', 'https://myflix-angular-ajs.netlify.app' ];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    // If a specific origin isn’t found on the list of allowed origins
    if(allowedOrigins.indexOf(origin) === -1){ 
      let message = 'The CORS policy for this application doesn`t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

const { check, validationResult } = require('express-validator');



let auth = require('./auth')(app);

require('./passport');

const mongoose = require('mongoose');
const Models = require('./models.js');
const { hash } = require('bcrypt');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb+srv://ajsweeney2324:test1234@cluster0.gdtbrp2.mongodb.net/myFlixDB', 
{useNewUrlParser: true, useUnifiedTopology: true });

// Logging when the API is accessed
const accessLog = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLog}));

// Error Message

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(' Something broke :( ');
  });

// connect to ports
const port = process.env.PORT || 8080; 
app.listen(port, '0.0.0.0', () => {
   console.log('App is listening on port ' + port);
 });

// Default greeting message
app.get('/', (req,res) => {
    res.status(200).send('Welcome to the myFlix API!!!!');
});


// Create  // Create
/** Methods 
 */

/**
 * post: /users
 * This method is for creating a user
 * Will check the database first to see if a user with that username exists yet
 */

app.post('/users',
[
  check('Username', 'Username must be at least 5 characters').isLength({min: 6}),
  check('Username', 'Username contains non alphanumeric characters').isAlphanumeric(),
  check('Password', 'Password must be at least 6 characters').isLength({min: 6}),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  // Search to see if a user with the requested username already exists
  Users.findOne({ Username: req.body.Username }) 
    .then((user) => {
      if (user) {
      //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
            Name: req.body.Name
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


// Read   // Read 
 
app.get('/documentation', (req,res) => {
    res.sendFile('public/Documentation.html', {root: __dirname});     
});



app.get('/users', passport.authenticate('jwt', { session: false }),
 (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  /**
 * get: /users/:Username
 * This method will get the user of whatever username is entered
 */
  app.get('/users/:Username', passport.authenticate('jwt', { session: false }),
   (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  /**
   * get: /movies
   * This method will get all movies from the database
   */
 
  
  app.get('/movies', passport.authenticate('jwt', { session: false }),
   (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

  /**
 * get: /movies/:title
 * This method will get a movie from the database that matches the title
 */


app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = Movies.find( movie => movie.Title.toLowerCase() === title.toLowerCase() );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('movie does not exist, please check spelling')
    }
});

/**
 * get: /movies/gentres/:genreName
 * This method will get a description of the given genre
 */
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name.toLowerCase() === genreName.toLowerCase() ).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('genre does not exist, please check spelling')
    }
});

/**
 * get: /movies/directors/:directorName
 * This method will get the biography of the named director
 */
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name.toLowerCase() === directorName.toLowerCase() ).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('director does not exist, please check spelling')
    }
});


// Update   // Update 

/**
 * put: /users/:Username
 * This method will update all user information
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), 
(req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username }, 
      { $set:
        {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
          Name: req.body.Name
        }
      },
      { new: true }  // This line makes sure that the updated document is returned
    )
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

/**
 * put: /user/:Username/movies/:MovieID
 * This method will add a movie to the user's favorite movies
 */
  app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }, // This line makes sure that the updated document is returned
    )
    .then(updatedUser => {
        res.json(updatedUser);
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
  });
  


// Delete   // Delete

/**
 * delete: /users/:Username/movies/:MovieID
 * This method will remove a movie from the user's favorite movies
 */
 app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),
 (req,res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
    { new: true }, 
    )
    .then(updatedUser => {
        res.json(updatedUser);
    })
    .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
 });
 
 /**
 * delete: /users/:Username
 * This method will delete the given user profile
 */
 app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });
 




