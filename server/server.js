
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
const avaries = require('../router/Sinistralités');
const db = require('./configuration/config');

const port=process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());

//connection to DB

//Inscription et connexion (créer un utilisateur).
app.use('/auth', UserRoute );
app.use('/crud',Voiture);
app.use('/sinistralites',avaries);

app.listen(port, ()=>{
  console.log(`Started up at port ${port}`);
});
















//Inscription
