
const express= require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const { json } = require('body-parser');
const authentificate =require('./middelware/token_validation');
const UserRoute = require('../router/auth');
const Voiture = require('../router/crud');
const db = require('./configuration/config');


var app = express();
app.use(bodyParser.json());
//connection to DB

//Inscription et connexion (créer un utilisateur).
app.use('/auth', UserRoute );
app.use('/crud',Voiture);


app.listen(3000, ()=>{
  console.log('Started on port 3000');
});
















//Inscription
