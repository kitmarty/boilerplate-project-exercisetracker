const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

var users = new Map();
var userCounter = 0;

app.post('/api/exercise/new-user', (req, res) => {
  var _id = String(++userCounter);
  users.set(_id, {
    _id: _id,
    username:req.body.username,
    log : []
  });
  res.json({_id: _id, username: req.body.username});
});

app.get('/api/exercise/users', (req, res) => {
  res.json(Array.from(users.values()));
});

app.post('/api/exercise/add', (req, res) => {
  var date = new Date(req.body.date);
  if (date=="Invalid Date")
    date = new Date();
  var user = users.get(req.body.userId);
  user.log.push({
    username: user.username,
    _id: user._id,
    description: req.body.description,
    duration: Number(req.body.duration),
    date: date.toDateString()
  })
  res.json(user.log[user.log.length-1]);
});

app.get('/api/exercise/log', (req, res) => {
  var user = users.get(req.query.userId);
  if (user!=null){
    if (req.query.from!=null){
      var from = new Date(from);
      if (from!="Invalid Date"){
        user.log = user.log.filter(exercise => new Date(exercise.date) >= from);
      }
    }
    if (req.query.to!=null){
      var to = new Date(to);
      if (to!="Invalid Date"){
        user.log = user.log.filter(exercise => new Date(exercise.date) <= to);
      }
    }
    if (req.query.limit!=null){
      user.log = user.log.slice(0, req.query.limit);
    }
    user.count = user.log.length;
    res.json(user);
  } else 
    res.json({});
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
