const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');

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
  database.users.push(
    {
      id: "123",
      name: name,
      email: email,

      entries: 0,
      create_at: new Date()
    }
  );
    res.json(database.users[database.users.length-1]);
});

app.get('/profile/:id',(req,res) => {
  const { id } = req.params;
  const userId = database.users.filter(user =>{
    return user.id === id
  });
  (userId.length > 0) ? res.json(userId) : res.status(404).json("no user found");

});

app.put('/Image',(req,res) =>{
  const { id } = req.body;
  const userId = database.users.filter(user =>{

    return user.id === id
  });
  if (userId.length > 0) {
    userId[0].entries++;
    res.json(userId[0].entries)
  }
  else {
    res.status(404).json("no user found");
  }

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
