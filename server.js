const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'aifi',
    password : '',
    database : 'face-rec'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database ={
  users: [
    {
      id: "123",
      name: "john",
      email: "john@gmail.com",
      password: "apples",
      entries: 0,
      create_at: new Date()
    },
    {
      id: "122",
      name: "sally",
      email: "sally@gmail.com",
      password: "banana",
      entries: 0,
      create_at: new Date()
    }
  ]
}

app.get('/',(req,res) =>{
  res.send(database.users);
});

app.post('/signin',(req,res) =>{
  if(database.users[0].email === req.body.email && database.users[0].password === req.body.password){
    res.json(database.users[0]);
  }
  else {
    res.status(400).json("error logining in");
  }
});

app.post('/register',(req,res) =>{
  const { name, email, password } = req.body;
  return db('users')
      .returning('*')
      .insert({
        name: name,
        email: email,
        create_at: new Date()
      })
      .then(user => {
          res.json(user[0]);
      })
      .catch(err => res.status(400).json('Unable to register'))
});

app.get('/profile/:id',(req,res) => {
  const { id } = req.params;
  db.select('*').from('users')
    .where({id})
    .then(user =>
      {
        if(user.length){
          res.json(user[0])
        }else {
          res.status(404).json("no user found")
        }
      })
    .catch(err => res.status(404).json("error getting user"));

});

app.put('/Image',(req,res) =>{
  const { id } = req.body;
  db('users').where({id})
    .increment('entries',1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(404).json("no user found"))
  })

app.listen(3001, ()=> {
  console.log("app is running on 3000");
});

/*
/ --> res = this is working
/signin --> POST  == succ/fail
/register --> POST == user
/profile/:userID -->GET =userID
/Image --> PUT =user
*/
