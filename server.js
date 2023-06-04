/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// npm run dev

const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

    app = express();

// Middleware to use our consts   
app.use(express.static('public'));    
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logging when the API is accessed
const accessLog = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLog}));

// Error Message
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(' Something broke :( ');
  });

// connect to port 8080
 app.listen(8080, () => {
   console.log('App is listening on port 8080');
 });

// Default greeting message
app.get('/', (req,res) => {
    res.status(200).send('Welcome to the myFlix API!');
});

// Filler movie list for now
let movies = [
   
    {
        Title: 'Inception', 
        Description: 'The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets.',
        Genre: {
            Name: 'science fiction',
            Description: 'Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies.'
        },
        Director: 
        {
            Name: 'Christopher Nolan',
            bio: 'Christopher Edward Nolan is a British-American filmmaker who is known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century.',
            Birthyear: '1970',
            Deathyear: 'present'
        },
        imageUrl: 'https://pixabay.com/images/id-3265473/',
        year: '2010',
        featured: 'yes'
    },
   
    {
        title: 'The Lion King',
        description: 'A young lion prince flees his kingdom after the murder of his father. Years later, he returns to reclaim his throne.',
        director: {
          firstName: 'Roger',
          lastName: 'Allers',
          bio: 'Roger Allers is an American film director, screenwriter, storyboard artist, animator and voice actor. He is best known for co-directing the Disney animated feature The Lion King (1994).',
          dateOfBirth: 1949,
          dateOfDeath: undefined
        },
        genres: [
          {
            name: 'Animation',
            description: 'Animated films are ones in which individual drawings, paintings, or illustrations are photographed frame by frame (stop-frame cinematography).'
          },
          {
            name: 'Adventure',
            description: 'Adventure films are often set in an historical period and may include adapted stories of historical or literary adventure heroes, kings, battles, rebellion, or piracy.'
          },
          {
            name: 'Drama',
            description: 'Drama films are a genre that relies on the emotional and relational development of realistic characters. They often feature intense character development, and sometimes rely on tragedy to evoke an emotional response from the audience.'
          }
        ],
        imageURL: 'https://www.themoviedb.org/t/p/w600_and_h900_bestv2/wx3wpNh4LhRJ3h6yN3vSGPVepuo.jpg',
        featured: true
      },

    {
        Title: 'The Lord of the Rings: The Return of the King', 
        Description: 'Continuing the plot of the previous film, Frodo, Sam and Gollum are making their final way toward Mount Doom in Mordor in order to destroy the One Ring, unaware of Gollum\'s true intentions, while Merry, Pippin, Gandalf, Aragorn, Legolas, Gimli and the rest are joining forces together against Sauron and his legions in Minas Tirith.',
        Genre: 
        {
            Name: 'fantasy',
            Description: 'Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        Director: 
        {
            Name: 'Peter Jackson',
            bio: 'Sir Peter Robert Jackson is a New Zealand film director, screenwriter and producer.',
            Birthyear: '1961',
            Deathyear: 'present'
        },
        imageUrl: 'https://pixabay.com/images/id-2021410/',
        year: '2003',
        featured: 'yes'
    },




];

// Filler user list
let users = [
    {
        "name": "Jon",
        "favoriteMovies": ["The Lion King", "Tenet"],
        "id": "1"
    },
    {
        "name": "Jacob",
        "favoriteMovies": ["Inception", "Coco"],
        "id": "2"
    },
    {
        "name": "Jose",
        "favoriteMovies": [],
        "id": "3"
    }
]


// Create  // Create

app.post('/users', (req, res) => {
    users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
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

app.get('/users', (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  app.get('/users/:Username', (req, res) => {
    users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title.toLowerCase() === title.toLowerCase() );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('movie does not exist, please check spelling')
    }
});

app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.Genre.Name.toLowerCase() === genreName.toLowerCase() ).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('genre does not exist, please check spelling')
    }
});

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

app.put('/users/:Username', (req, res) => {
    users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

app.put('/users/:id/:movieTitle', (req,res) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id );
    let name = user.name;
    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${name}'s favorites`);
    } else {
        res.status(400).send('user does not exist')
    }
});


// Delete   // Delete

app.delete('/users/:id/:movieTitle', (req,res) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id );
    let name = user.name;

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from ${name}'s favorites`);
    } else {
        res.status(400).send('user does not exist')
    }
});
 
app.delete('/users/:id', (req,res) => {
    const { id } = req.params;
    
    let user = users.find( user => user.id == id );
    let name = user.name;

    if (user) {
        users = users.filter( user => user.id !== id);
        res.status(200).send(`user ${id} '${name}' has been removed from database`);
    } else {
        res.status(400).send('user does not exist')
    }
});
 




