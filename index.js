const express = require('express');

const server = new express();

server.use(express.json());

// req
// query params = ?1
// route params = /1
// request body = { }

// CRUD - Create | Read | Update | Delete

//Middlewares

//Global
server.use((req, res, next) => {
  console.time("Request");

  console.log(`Method: ${req.method} Url: ${req.url}`)

  next();

  console.timeEnd("Request");
});

//Local

function checkUserExists(req, res, next) {
  const name = req.body.name;
  if(!name) {
    return res.status(400).json({ error: "User required"})
  }

  req.name = name;
  
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if(!user) {
    return res.status(400).json({ error : "User does not exists"})
  }

  req.user = user;

  return next();
}


const users = ["Leonel", "Diego", "Denise"];

// Routes

server.get('/helloUser', (req, res) => {
  const name = req.query.name;
  res.json({ message: `Hello ${name}`});
});

server.get('/user/:index', checkUserInArray, (req, res) => {
  res.json(req.user);
});

server.get('/users', (req, res) => {
  res.json(users);
});

server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put('/user/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;

  users[index] = req.name;

  return res.json(users)
});

server.delete('/user/:index', (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.json(users);
})

server.listen(3000);

