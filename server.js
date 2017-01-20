var express = require('express')
var bodyParser = require('body-parser')
var pg = require('pg-promise')()

var app = express()
var PORT = process.env.PORT || 3000

// database connection
var db = pg({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'gex',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'greenfox-movies'
})

// super duper logger middleware
app.use(function(req, res, next) {
  console.log('[%s] %s', req.method, req.url)
  next()
})

// body parser middleware
app.use(bodyParser.json())

// GET / endpoint
app.get('/', function(req, res) {
  res.send('YOLO')
})

// GET /movies endpoint
app.get('/movies', function(req, res) {
  db.any('SELECT * FROM movies')
    .then(function(movies) {
      res.json(movies)
    })
    .catch(function(err) {
      res.status(500).json({error: err.message})
    })
})

// POST /movies endpoint
app.post('/movies', function(req, res) {
  var query = {
    text: 'INSERT INTO movies (title) VALUES ($1) returning id',
    values: [req.body.title]
  }
  db.one(query)
    .then(function(movie) {
      res.json({status: 'ok', id: movie.id})
    })
    .catch(function(err) {
      res.status(500).json({error: err.message})
    })
})

// start server
app.listen(PORT, function() {
  console.log('app is runnning on port ' + PORT)
})
